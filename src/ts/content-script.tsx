/* CS is here to manage the presence of components and events they're not supposed to access.

. Process messages from BG
. Create Sidebar
. Inject Sidebar into twitter pages when appropriate
. Remove Sidebar from twitter pages when appropriate
. manage information about twitter use (inited in initLocalStorage)
. manage inputs in twitter use
. define destruction and dispatch its event on start up
*/
//
import 'preact/debug';
import 'preact/devtools';
import '@babel/polyfill';
// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import * as pcss from '../styles.css';
// console.log('hi pcss', pcss);
import * as css from '../style/cs.css';
console.log('hi css', css);
import Kefir, { Observable, Observer, Property, Subscription } from 'kefir';
import { h, render } from 'preact';
import * as R from 'ramda';
import { curProp, StorageChange, UrlModes } from './types/types';
import { UrlMsg } from './types/msgTypes';
import * as window from './global';
import ThreadHelper from './components/ThreadHelper';
import { makeComposeObs } from './domInterface/composeHandler';
import {
  getHostTweetId,
  makeActionStream,
  makeAddBookmarkStream,
  makeComposeFocusObs,
  makeDeleteEventStream,
  makeLastClickedObs,
  makeRemoveBookmarkStream,
  makeReplyObs,
  makeRoboStream,
} from './domInterface/inputsHandler';
import {
  injectDummy,
  injectSidebarHome,
  makeFloatSidebarObserver,
  makeHomeSidebarObserver,
  makeSidebarCompose,
  makeSidebarHome,
} from './domInterface/sidebarHandler';
import { makeBgColorObs, makeLastStatusObs } from './domInterface/tabsHandler';
import {
  makeGotMsgObs,
  makeStorageChangeObs,
  msgBG,
  setStg,
} from './utils/dutils';
import {
  currentValue,
  flattenModule,
  inspect,
  nullFn,
  toggleDebug,
} from './utils/putils';
import { getMode, updateTheme } from './utils/wutils';
import {
  __,
  curry,
  pipe,
  andThen,
  map,
  filter,
  reduce,
  tap,
  apply,
  tryCatch,
} from 'ramda'; // Function
import {
  prop,
  propEq,
  propSatisfies,
  path,
  pathEq,
  hasPath,
  assoc,
  assocPath,
  values,
  mergeLeft,
  mergeDeepLeft,
  keys,
  lens,
  lensProp,
  lensPath,
  pick,
  project,
  set,
  length,
} from 'ramda'; // Object
import {
  head,
  tail,
  take,
  isEmpty,
  any,
  all,
  includes,
  last,
  dropWhile,
  dropLastWhile,
  difference,
  append,
  fromPairs,
  forEach,
  nth,
  pluck,
  reverse,
  uniq,
  slice,
} from 'ramda'; // List
import {
  equals,
  ifElse,
  when,
  both,
  either,
  isNil,
  is,
  defaultTo,
  and,
  or,
  not,
  F,
  gt,
  lt,
  gte,
  lte,
  max,
  min,
  sort,
  sortBy,
  split,
  trim,
  multiply,
} from 'ramda'; // Logic, Type, Relation, String, Math

// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;
// Sidebar functions
let thBarHome = makeSidebarHome();
let thBarComp = makeSidebarCompose();
const activateSidebar = curry(
  (inject: (arg0: Element) => any, bar: Element) => {
    console.log('[DEBUG] activating sidebar');
    inject(bar);
    render(<ThreadHelper />, bar);
  }
);
const activateFloatSidebar = () => activateSidebar(injectDummy, thBarComp);
const activateHomeSidebar = () => activateSidebar(injectSidebarHome, thBarHome);
const deactivateSidebar = (bar: Element) => {
  render(null, bar);
};
// Webpage events
const makeIdObsMsg = curry((lastClickedId$: curProp<any>, type) => {
  return { type: type, id: lastClickedId$.currentValue() };
});
const getBgColor = (x: HTMLElement) => x.style.backgroundColor;
const minIdleTime = 3000;
// Effects
const handlePosting = () => msgBG({ type: 'update-tweets' }); // handle twitter posting actions like tweets, rts and deletes
const reqSearch = R.pipe<any, string, void>(defaultTo(''), q =>
  msgBG({ type: 'search', query: q })
);
// const reqSearch = R.pipe<any, string, void>(
//     defaultTo(''),
//     query => {
//         setStg('query', query)});
// Stream clean up
const subscriptions: Subscription[] = [];
const rememberSub = (sub: Subscription) => {
  subscriptions.push(sub);
  return sub;
};
const subObs = <T,>(
  obs: Observable<T, Error> | Property<T, Error | any>,
  effect: (val: T) => void
): Subscription => rememberSub(obs.observe({ value: effect }));

function main() {
  onLoad(thBarHome, thBarComp);
}

async function onLoad(thBarHome: Element, thBarComp: Element) {
  console.log('[DEBUG] onLoad', { thBarHome, thBarComp });
  msgBG({ type: 'cs-created' });
  // Define streams
  //      messages
  const gotMsg$ = makeGotMsgObs().map(prop('m'));
  const urlChange$ = ((gotMsg$.filter(
    propEq('type', 'tab-change-url')
  ) as unknown) as Observable<UrlMsg, Error>).map(prop('url'));
  const mode$ = urlChange$.map(getMode);
  //      storage
  const storageChange$ = makeStorageChangeObs();
  const latest$ = storageChange$
    .filter((x: { itemName: string }) => x.itemName == 'latest_tweets')
    .map(prop('newVal'));
  const sync$ = storageChange$
    .filter((x: { itemName: string }) => x.itemName == 'sync')
    .map(prop('newVal'));
  const syncDisplay$ = storageChange$
    .filter((x: { itemName: string }) => x.itemName == 'syncDisplay')
    .map(prop('newVal'))
    .toProperty(() => '');
  //      webpage events
  //          theme
  const bgColor$ = makeBgColorObs();
  const theme$ = bgColor$
    .map(getBgColor)
    .skipDuplicates()
    .toProperty(() => getBgColor(document.body));
  //          tweet ids
  const lastStatus$ = makeLastStatusObs(mode$);
  const getTargetId = getHostTweetId(lastStatus$);
  const lastClickedId$ = (makeLastClickedObs()
    .map(getTargetId)
    .filter(x => !isNil(x))
    .toProperty() as unknown) as curProp<string>;
  const makeIdMsg = makeIdObsMsg(lastClickedId$); // function
  //          actions
  const actions$ = makeActionStream(); // post, rt, unrt
  const replyTo$ = makeReplyObs(mode$)
    .map(getTargetId)
    .toProperty(() => null) as curProp<string>;
  const addBookmark$ = makeAddBookmarkStream()
    .map(inspect('add bookmark'))
    .map(_ => 'add-bookmark');
  const removeBookmark$ = makeRemoveBookmarkStream()
    .map(inspect('remove bookmark'))
    .map(_ => 'remove-bookmark');
  const delete$ = makeDeleteEventStream()
    .map(inspect('delete'))
    .map(_ => 'delete-tweet');
  const targetedTweetActions$ = Kefir.merge([
    addBookmark$,
    removeBookmark$,
    delete$,
  ]);
  const [composeFocus$, composeFocusOut$] = makeComposeFocusObs(); // stream for focus on compose box
  composeFocus$.log('composeFocus$');
  const composeUnfocused$ = Kefir.merge([
    composeFocusOut$.map(_ => ''),
    urlChange$.map(_ => ''),
  ]);
  const composeContent$ = composeFocus$.flatMapLatest((e: Event) =>
    makeComposeObs(e.target as HTMLElement)
  );
  composeContent$.log('composeContent$');
  const composeQuery$ = Kefir.merge([
    urlChange$.map(_ => ''),
    composeContent$,
  ]).toProperty(() => '');
  const stoppedWriting$ = composeQuery$
    .skipDuplicates()
    .filter(x => !isEmpty(x))
    .debounce(minIdleTime); // to detect when writing has stopped for a bit
  const robo$ = Kefir.merge([
    makeRoboStream(),
    stoppedWriting$,
  ]).throttle(minIdleTime, { trailing: false });
  // const thStreams = {
  //     actions: actions$,
  //     robo: robo$,
  //     composeQuery: composeQuery$,
  //     replyTo: replyTo$,
  //     syncDisplay: syncDisplay$,
  // };
  // Sidebar control
  const updateFloat = (value: any) =>
    value ? activateFloatSidebar() : deactivateSidebar(thBarComp); //function
  const updateHome = (value: any) =>
    value ? activateHomeSidebar() : deactivateSidebar(thBarHome); //function
  const floatSidebar$ = makeFloatSidebarObserver(thBarComp); // floatSidebar$ :: String || Element  // for floating sidebar in compose mode
  const floatActive$ = floatSidebar$
    .map(equals('render'))
    .toProperty(() => false); // floatActive$ ::Bool
  const homeSidebar$ = makeHomeSidebarObserver(thBarHome); // homeSidebar$ :: String || Element // for main site sidebar over recent trends
  const homeActive$ = homeSidebar$
    .map(equals('render'))
    .toProperty(() => false); // homeActive$ ::Bool
  const homeActiveSafe$ = Kefir.combine(
    [homeActive$, floatActive$.map(not)],
    and
  );
  // Effects from streams
  //  Actions
  targetedTweetActions$.log('targetedTweetActions');
  subObs(lastClickedId$, _ => {});
  subObs(composeQuery$, reqSearch),
    subObs(actions$.delay(1000), _ => {
      handlePosting();
    });
  subObs(targetedTweetActions$, pipe(makeIdMsg, msgBG));
  subObs(theme$, updateTheme);
  subObs(floatActive$, updateFloat);
  subObs(homeActiveSafe$, updateHome);
}
function destructor(destructionEvent: any) {
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
  window.removeEventListener('load', onLoad, true);
  subscriptions.forEach((x: { unsubscribe: () => void }) => x.unsubscribe());
  render(null, thBarHome);
  render(null, thBarComp);
  console.log('DESTROYED');
}
function setDestruction(destructor: {
  (destructionEvent: any): void;
  (arg0: string): any;
}) {
  const destructionEvent = 'destructmyextension_' + chrome.runtime.id;
  // Unload previous content script if needed
  document.dispatchEvent(new CustomEvent(destructionEvent));
  const _destructor = () => destructor(destructionEvent);
  document.addEventListener(destructionEvent, _destructor);
  //let port = chrome.runtime.connect()
  //port.onDisconnect.addListener(destructor)
}
setDestruction(destructor); // destroys previous content script
main(); // Let's go
//
