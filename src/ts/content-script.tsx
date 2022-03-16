/* 
- `content-script.tsx`: Reads webpage activity and injects sidebar. 
- Observes webpage activity like:
    - compose text
    - theme colors
    - url changes
    - tweet actions (post, delete, rt, bookmarking)

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
import ThreadHelper from './components/sidebar/Sidebar';
import { makeComposeObs } from './twitter-page-read/composerReader';
import {
  getHostTweetId,
  makeActionStream,
  makeAddBookmarkStream,
  makeComposeFocusObs,
  makeDeleteEventStream,
  makeLastClickedObs,
  makeRemoveBookmarkStream,
} from './twitter-page-read/userInputsHandler';
import {
  injectSidebarContainerCompose,
  injectSidebarContainerHome,
  makeSearchBarObserver,
  createSidebarElementCompose,
  createSidebarContainerHome,
  removeSearchBar,
  removeSidebarContent,
} from './twitter-page-write/injectSidebar';
import {
  makeFloatSidebarObserver,
  makeHomeSidebarObserver,
} from './twitter-page-read/sidebarReader';
import { makeThemeObs } from './twitter-page-read/themeReader';
import * as window from './global';
import { MsgObs, QueryObs, StorageChangeObs } from './hooks/BrowserEventObs';
import { UrlMsg } from './types/msgTypes';
import { curProp } from './types/types';
import {
  getStg,
  makeStorageChangeObs,
  msgBG,
  resetStorageField,
  rpcBg,
  setStg,
} from './stg/dutils';
import { makeGotMsgObs } from './stg/msgUtils';
import { currentValue, inspect, nullFn, toggleDebug } from './utils/putils';
import {
  getMetadataForPage,
  getTwitterPageMode,
} from './twitter-page-read/twitterPageReader';
import { updateTheme } from './twitter-page-write/setTheme';
import { makeInitStgObs } from './bg/bgUtils';
import { makeLastStatusObs } from './twitter-page-read/openTweetReader';

// console.log('need to reference pcss so it doesn\'t vanish on packing', pcss);
pcss;
css;
// console.log('hi css', css);

// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;

// Connection to BG
// for knowing when to unload BG
let myPort = chrome.runtime.connect({ name: 'port-from-cs' });

// Sidebar functions
let sidebarContainerHome = createSidebarContainerHome();
let sidebarContainerComposer = createSidebarElementCompose();
const injectAndRenderSidebar = curry(
  (
    inject: (arg0: Element) => any,
    bar: Element,
    inHome: boolean,
    storageChange$,
    msgObs$,
    composeQuery$
  ) => {
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
const activateComposeSidebar = injectAndRenderSidebar(
  injectSidebarContainerCompose,
  sidebarContainerComposer,
  false
);
const activateHomeSidebar = injectAndRenderSidebar(
  injectSidebarContainerHome,
  sidebarContainerHome,
  true
);
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

async function onLoad(
  sidebarContainerHome: Element,
  sidebarContainerComposer: Element
) {
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
  const mode$ = urlChange$.map(getTwitterPageMode);
  //      storage
  const storageChange$ = makeStorageChangeObs();
  const hideTtSearchBar$ = makeInitStgObs(storageChange$, 'doIndexUpdate');
  const hideTtSidebarContent$ = makeInitStgObs(storageChange$, 'doIndexUpdate');
  //      webpage events
  //          theme
  const theme$ = makeThemeObs(document);
  subObs(theme$, updateTheme);
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
  const post$ = actions$.filter((x) => x == 'tweet');
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
  //
  // Sidebar control
  const updateFloat = (value: any) =>
    value
      ? activateComposeSidebar(storageChange$, msgObs$, composeQuery$)
      : deactivateSidebar(sidebarContainerComposer); //function
  const updateHome = (value: any) =>
    value
      ? activateHomeSidebar(storageChange$, msgObs$, composeQuery$)
      : deactivateSidebar(sidebarContainerHome); //function
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
  const floatSidebar$ = makeFloatSidebarObserver(
    sidebarContainerComposer
  ).filter(filterOutRender); // floatSidebar$ :: String || Element  // for floating sidebar in compose mode
  const floatActive$ = floatSidebar$
    .map(equals('render'))
    .toProperty(() => false); // floatActive$ ::Bool
  const homeSidebar$ = makeHomeSidebarObserver(sidebarContainerHome); // homeSidebar$ :: String || Element // for main site sidebar over recent trends
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
  subObs(floatActive$, updateFloat);
  subObs(homeActiveSafe$, updateHome);
  subObs(storageChange$, nullFn);
  subObs(msgObs$, nullFn);
  subObs(
    searchBar$.filterBy(hideTtSearchBar$.map((x) => !!x)),
    removeSearchBar
  );
  subObs(
    searchBar$.filterBy(hideTtSidebarContent$.map((x) => !!x)),
    removeSidebarContent
  );
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
  render(null, sidebarContainerHome);
  render(null, sidebarContainerComposer);
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
  render(null, sidebarContainerHome);
  render(null, sidebarContainerComposer);
});
onLoad(sidebarContainerHome, sidebarContainerComposer); // Let's go
//
