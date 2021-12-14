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
import 'chrome-extension-async';
import Kefir, { Observable, Property, Subscription } from 'kefir';
import { h, render } from 'preact';
import 'preact/debug';
import 'preact/devtools';
import {
  __,
  and,
  curry,
  equals,
  includes,
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
  removeSidebarContent,
} from './domInterface/sidebarHandler';
import { makeLastStatusObs, makeThemeObs } from './domInterface/tabsHandler';
import * as window from './global';
import { MsgObs, QueryObs, StorageChangeObs } from './hooks/BrowserEventObs';
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
} from './stg/dutils';
import { currentValue, inspect, nullFn, toggleDebug } from './utils/putils';
import {
  getMetadataForPage,
  getMode,
  updateTheme,
} from './domInterface/wutils';
import { makeInitStgObs } from './bg/bgUtils';

console.log('hi pcss', pcss);
console.log('hi css', css);

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
    inHome: boolean,
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
            <ThreadHelper inHome={inHome} />
          </QueryObs.Provider>
        </MsgObs.Provider>
      </StorageChangeObs.Provider>,
      bar
    );
  }
);
const activateFloatSidebar = activateSidebar(injectDummy, thBarComp, false);
const activateHomeSidebar = activateSidebar(injectSidebarHome, thBarHome, true);
const deactivateSidebar = (bar: Element) => {
  render(null, bar);
};
// Webpage events
// Effects
const handlePosting = () => {
  msgBG({ type: 'update-tweets' });
}; // handle twitter posting actions like tweets, rts and deletes

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
  const urlChange$ = (
    gotMsg$.filter(propEq('type', 'tab-change-url')) as unknown as Observable<
      UrlMsg,
      Error
    >
  ).map(prop('url'));
  const mode$ = urlChange$.map(getMode);
  //      storage
  const storageChange$ = makeStorageChangeObs();
  const hideTtSearchBar$ = makeInitStgObs(storageChange$, 'doIndexUpdate');
  hideTtSearchBar$.log('hideTtSearchBar$');
  const hideTtSidebarContent$ = makeInitStgObs(storageChange$, 'doIndexUpdate');
  hideTtSidebarContent$.log('hideTtSidebarContent$');
  //      webpage events
  //          theme
  const theme$ = makeThemeObs();
  //          tweet ids
  const lastStatus$ = makeLastStatusObs(mode$);
  const getTargetId = getHostTweetId(lastStatus$);
  const lastClickedId$ = makeLastClickedObs()
    .map(getTargetId)
    .filter((x) => !isNil(x))
    .toProperty() as unknown as curProp<string>;
  subObs(lastClickedId$, setStg('lastClickedId'));
  //          actions
  const actions$ = makeActionStream(); // post, rt, unrt
  actions$.log('actions$');
  const post$ = actions$.filter((x) => x == 'tweet');
  post$.log('post$');
  subObs(post$.delay(1000), async (_) => rpcBg('updateTimeline'));
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
  const [composeFocus$, composeFocusOut$] = makeComposeFocusObs(); // stream for focus on compose box
  const composeContent$ = Kefir.merge([
    composeFocus$.flatMapLatest((e: Event) =>
      makeComposeObs(e.target as HTMLElement)
    ),
    post$.map((_) => ''),
  ]).throttle(200);
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
  const searchBar$ = makeSearchBarObserver();
  searchBar$.log('searchBar$');
  const isComposing = pipe(
    (_) => getMetadataForPage(window.location.href),
    prop('pageType'),
    includes(__, ['compose', 'intent', 'intentReply'])
  );
  const filterOutRender = (msg) => {
    if (equals('render', msg)) {
      return isComposing(null);
    } else {
      return msg;
    }
  };
  const floatSidebar$ =
    makeFloatSidebarObserver(thBarComp).filter(filterOutRender); // floatSidebar$ :: String || Element  // for floating sidebar in compose mode
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
  subObs(actions$.delay(800), (_) => {
    handlePosting();
  });
  subObs(theme$, updateTheme);
  subObs(floatActive$, updateFloat);
  subObs(homeActiveSafe$, updateHome);
  subObs(storageChange$, nullFn);
  subObs(msgObs$, nullFn);
  subObs(searchBar$.filterBy(hideTtSearchBar$), removeSearchBar);
  subObs(searchBar$.filterBy(hideTtSidebarContent$), removeSidebarContent);
  subObs(
    hideTtSearchBar$.filter((x) => x == true),
    removeSearchBar
  );
  subObs(
    hideTtSidebarContent$.filter((x) => x == true),
    removeSidebarContent
  );
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
