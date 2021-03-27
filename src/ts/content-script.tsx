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
import '@babel/polyfill';
import Kefir, { Observable, Property, Subscription } from 'kefir';
import { h, render } from 'preact';
import 'preact/debug';
import 'preact/devtools';
import { MsgObs, QueryObs, StorageChangeObs } from './hooks/BrowserEventObs';
import * as R from 'ramda';
import {
  and,
  curry,
  defaultTo,
  equals,
  isEmpty,
  isNil,
  not,
  pipe,
  prop,
  propEq,
} from 'ramda'; // Function
import * as css from '../style/cs.css';
import * as pcss from '../styles.css';
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
  makeSearchBarObserver,
  makeSidebarCompose,
  makeSidebarHome,
  removeSearchBar,
  resizeSidebar,
  ttSidebarObserver,
} from './domInterface/sidebarHandler';
import {
  makeBgColorObs,
  makeLastStatusObs,
  makeThemeObs,
} from './domInterface/tabsHandler';
import * as window from './global';
import { UrlMsg } from './types/msgTypes';
import { curProp } from './types/types';
import {
  getStg,
  makeGotMsgObs,
  makeStorageChangeObs,
  msgBG,
  resetStorageField,
  rpcBg,
  setStg,
} from './utils/dutils';
import { currentValue, inspect, nullFn, toggleDebug } from './utils/putils';
import { getMode, updateTheme } from './utils/wutils';
import {
  WranggleRpc,
  Relay,
  PostMessageTransport,
  BrowserExtensionTransport,
} from '@wranggle/rpc';
import 'chrome-extension-async';

console.log('hi pcss', pcss);
console.log('hi css', css);

console.log('chrome.storage', { chrome });
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (var key in changes) {
//     var storageChange = changes[key];
//     console.log(
//       'Storage key "%s" in namespace "%s" changed. ' +
//         'Old value was "%s", new value is "%s".',
//       key,
//       namespace,
//       storageChange.oldValue,
//       storageChange.newValue
//     );
//   }
// });

// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;

// Connection to BG
// for knowing when to unload BG
let myPort = chrome.runtime.connect({ name: 'port-from-cs' });

// Sidebar functions
let thBarHome = makeSidebarHome();
let thBarComp = makeSidebarCompose();
const activateSidebar = curry(
  (
    inject: (arg0: Element) => any,
    bar: Element,
    storageChange$,
    msgObs$,
    composeQuery$
  ) => {
    console.log('[DEBUG] activating sidebar', { storageChange$ });
    inject(bar);
    render(
      <StorageChangeObs.Provider value={storageChange$}>
        <MsgObs.Provider value={msgObs$}>
          <QueryObs.Provider value={composeQuery$}>
            <ThreadHelper />
          </QueryObs.Provider>
        </MsgObs.Provider>
      </StorageChangeObs.Provider>,
      bar
    );
  }
);
const activateFloatSidebar = activateSidebar(injectDummy, thBarComp);
const activateHomeSidebar = activateSidebar(injectSidebarHome, thBarHome);
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
const handlePosting = () => {
  msgBG({ type: 'update-tweets' });
}; // handle twitter posting actions like tweets, rts and deletes

const reqSearch = R.pipe<any, string, void>(defaultTo(''), (query) => {
  // console.log('reqSearch', { query });
  // msgBG({ type: 'search', query });
  // setStg('query', query);
});
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

const initCsStg = () => {
  ['search_results', 'api_results', 'temp_archive', 'query'].map(
    resetStorageField
  );
};

function main() {
  onLoad(thBarHome, thBarComp);
}

async function onLoad(thBarHome: Element, thBarComp: Element) {
  console.log('[DEBUG] onLoad', { thBarHome, thBarComp });
  initCsStg();
  // Define streams
  //      messages
  const msgObs$ = makeGotMsgObs();
  const gotMsg$ = msgObs$.map(prop('m'));
  const urlChange$ = ((gotMsg$.filter(
    propEq('type', 'tab-change-url')
  ) as unknown) as Observable<UrlMsg, Error>).map(prop('url'));
  const mode$ = urlChange$.map(getMode);
  //      storage
  const storageChange$ = makeStorageChangeObs();
  console.log('storageChange$', { storageChange$ });
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
  // const theme$ = bgColor$
  //   .map(getBgColor)
  //   .skipDuplicates()
  //   .toProperty(() => getBgColor(document.body));
  const theme$ = makeThemeObs();
  //          tweet ids
  const lastStatus$ = makeLastStatusObs(mode$);
  const getTargetId = getHostTweetId(lastStatus$);
  const lastClickedId$ = (makeLastClickedObs()
    .map(getTargetId)
    .filter((x) => !isNil(x))
    .toProperty() as unknown) as curProp<string>;
  subObs(lastClickedId$, setStg('lastClickedId'));
  const makeIdMsg = makeIdObsMsg(lastClickedId$); // function
  //          actions
  const actions$ = makeActionStream(); // post, rt, unrt
  actions$.log('actions$');
  const post$ = actions$.filter((x) => x == 'tweet');
  post$.log('post$');
  subObs(post$.delay(1000), async (_) =>
    rpcBg('post', rpcBg('updateTimeline'))
  );
  const replyTo$ = makeReplyObs(mode$)
    .map(getTargetId)
    .toProperty(() => null) as curProp<string>;
  const addBookmark$ = makeAddBookmarkStream()
    .map(inspect('add bookmark'))
    .map((_) => 'add-bookmark');
  subObs(addBookmark$, async (_) =>
    rpcBg('addBookmark', { ids: [await getStg('lastClickedId')] })
  );
  const removeBookmark$ = makeRemoveBookmarkStream()
    .map(inspect('remove bookmark'))
    .map((_) => 'remove-bookmark');
  subObs(removeBookmark$, async (_) =>
    rpcBg('removeBookmark', { ids: [await getStg('lastClickedId')] })
  );
  const delete$ = makeDeleteEventStream()
    .map(inspect('delete'))
    .map((_) => 'delete-tweet');
  subObs(delete$, async (_) =>
    rpcBg('deleteTweet', { ids: [await getStg('lastClickedId')] })
  );
  const targetedTweetActions$ = Kefir.merge([
    addBookmark$,
    removeBookmark$,
    delete$,
  ]);
  const [composeFocus$, composeFocusOut$] = makeComposeFocusObs(); // stream for focus on compose box
  // composeFocus$.log('composeFocus$');
  const composeUnfocused$ = Kefir.merge([
    composeFocusOut$.map((_) => ''),
    urlChange$.map((_) => ''),
  ]);
  const composeContent$ = Kefir.merge([
    composeFocus$.flatMapLatest((e: Event) =>
      makeComposeObs(e.target as HTMLElement)
    ),
    post$.map((_) => ''),
  ]).throttle(200);
  composeContent$.log('composeContent$');
  const composeQuery$ = Kefir.merge([
    urlChange$.map((_) => ''),
    composeContent$,
  ]).toProperty(() => '');

  // Sidebar control
  const updateFloat = (value: any) =>
    value
      ? activateFloatSidebar(storageChange$, msgObs$, composeQuery$)
      : deactivateSidebar(thBarComp); //function
  const updateHome = (value: any) =>
    value
      ? activateHomeSidebar(storageChange$, msgObs$, composeQuery$)
      : deactivateSidebar(thBarHome); //function
  // const ttSidebar$ = ttSidebarObserver().flatten();
  // ttSidebar$.log('ttSidebar$');
  const searchBar$ = makeSearchBarObserver();
  searchBar$.log('searchBar$');
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
  subObs(lastClickedId$, (_) => {});
  // subObs(composeQuery$, reqSearch);
  subObs(actions$.delay(800), (_) => {
    handlePosting();
  });
  subObs(targetedTweetActions$, pipe(makeIdMsg, msgBG));
  subObs(theme$, updateTheme);
  theme$.log('theme$');
  subObs(floatActive$, updateFloat);
  subObs(homeActiveSafe$, updateHome);
  subObs(storageChange$, nullFn);
  subObs(msgObs$, nullFn);
  subObs(searchBar$, removeSearchBar);
  // subObs(ttSidebar$, resizeSidebar);
}

// Destructor if another CS comes to the same page(is this possible?)
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

// Destructor for when tab (and thus CS)
window.addEventListener('unload', () => {
  msgBG({ type: 'window is closing!' });
  subscriptions.forEach((x: { unsubscribe: () => void }) => x.unsubscribe());
  render(null, thBarHome);
  render(null, thBarComp);
});
main(); // Let's go
//
