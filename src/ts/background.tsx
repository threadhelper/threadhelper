// only for development with `npm run serve`, to take advantage of HMR
import '@babel/polyfill';
// import "core-js/stable";
// import "regenerator-runtime/runtime";
import { createContext, h, options, render } from 'preact';
import 'preact/debug';
import * as css from '././style/cs.css';
import * as pcss from '././styles.css';
import { MsgObs, StorageChangeObs } from './hooks/BrowserEventObs';
import { updateTheme } from './utils/wutils';
import { dbOpen } from './worker/idb_wrapper';
import Scraper from './bgModules/Scraper';
import Search from './bgModules/Search';
import Storage from './bgModules/Storage';
import TtReader from './bgModules/TtReader';
import {
  WranggleRpc,
  PostMessageTransport,
  BrowserExtensionTransport,
} from '@wranggle/rpc';
import Kefir, { Observable } from 'kefir';
import { createWorkerFactory } from '@shopify/web-worker';
import * as R from 'ramda';
import {
  and,
  andThen,
  assoc,
  curry,
  defaultTo,
  either,
  equals,
  F,
  filter,
  head,
  ifElse,
  isEmpty,
  isNil,
  keys,
  last,
  map,
  not,
  pipe,
  prop,
  propEq,
  propSatisfies,
  reduce,
  trim,
  tryCatch,
  values,
  when,
} from 'ramda'; // Function
import { FullUser, User } from 'twitter-d';
import { makeAuthObs, makePermissionsObs } from './bg/auth';
import {
  apiSearchToTweet,
  apiToTweet,
  archToTweet,
  bookmarkToTweet,
} from './bg/tweetImporter';
import {
  fetchUserInfo,
  getBookmarks,
  patchArchive,
  searchAPI,
  searchUsers,
  thFetch,
  timelineQuery,
  tweetLookupQuery,
  updateQuery,
} from './bg/twitterScout';
import { initWorker } from './bg/workerBoss';
import window from './global';
import {
  GaException,
  GaMsg,
  Msg,
  ReqDefaultTweetsMsg,
  ReqSearchMsg,
  TweetResult,
  TweetResWorkerMsg,
  WorkerMsg,
} from './types/msgTypes';
import { IdleMode, SearchFilters } from './types/stgTypes';
import { Credentials, curProp } from './types/types';
import {
  apiBookmarkToTweet,
  combineOptions,
  compareAuths,
  getDateFormatted,
  makeReqDefaultTweetsMsg,
  makeReqSearchMsg,
  msgSomeWorker,
  resetData,
  saferTweetMap,
  twitter_url,
  _makeOptionObs,
  _makeStgObs,
  extractTweetPropIfNeeded,
  makeInitStgObs,
} from './utils/bgUtils';
import {
  cleanOldStorage,
  dequeue4WorkStg,
  dequeueStg,
  dequeueWorkQueueStg,
  enqueueStg,
  enqueueTweetStg,
  getData,
  getStg,
  makeGotMsgObs,
  makeStgItemObs,
  makeStorageChangeObs as makeStorageChangeObs,
  modStg,
  msgCS,
  removeData,
  setStg,
  setStgPath,
  updateStorage,
} from './utils/dutils';
import { Event, Exception, initGA, PageView } from './utils/ga';
import { update_size } from './utils/params';
import {
  currentValue,
  curVal,
  errorFilter,
  inspect,
  list2Obj,
  makeMsgStream,
  nullFn,
  promiseStream,
  streamAnd,
  toggleDebug,
  toVal,
  waitFor,
} from './utils/putils';
import { makeValidateTweet } from './worker/search';
import 'chrome-extension-async';
import { permissions } from '../../baseManifest';
import {
  importTweets,
  loadIndexFromIdb,
  updateIdxFromIdb,
} from './dev/storage/devStgUtils';

const createSearchWorker = createWorkerFactory(
  () => import('./dev/workers/searchWorker.tsx')
);
// const createScrapeWorker = createWorkerFactory(() => import('../dev/workers/scrapeWorker.tsx'));
// const createStorageWorker = createWorkerFactory(() => import('../dev/workers/storageWorker.tsx'));
const searchWorker = createSearchWorker();

// Analytics //IMPORTANT: this block must come before setting the currentValue for Kefir. Property and I have no idea why
(function initAnalytics() {
  initGA();
})();
PageView('/background.html');
// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;

// Stream clean up
const subscriptions: any[] = [];
const rememberSub = (sub) => {
  subscriptions.push(sub);
  return sub;
};
const subObs = (
  obsObj: { [key: string]: Observable<any, any> },
  effect: any
) => {
  let obs = head(values(obsObj));
  let name = head(keys(obsObj)) as string;
  obs = obs.setName(name);
  rememberSub(obs.observe({ value: effect }));
};

/* TODO: Functions to move out of this file */
// Scraping functions
const assocUser = (userInfo) => assoc('account', prop('id_str', userInfo));

const doBookmarkScrape = async (auth, userInfo) => {
  const toTh = saferTweetMap(pipe(bookmarkToTweet, assocUser(userInfo)));
  const bookmarks = await getBookmarks(auth);
  const thBookmarks = toTh(bookmarks);
  return thBookmarks;
};
const doTimelineScrape = async (auth, userInfo) => {
  const toTh = saferTweetMap(pipe(apiToTweet, assocUser(userInfo)));
  const timelineTweets = await timelineQuery(auth, userInfo);
  const thTimelineTweets = toTh(timelineTweets);
  return thTimelineTweets;
};
const doTimelineUpdateScrape = async (auth, userInfo) => {
  const toTh = saferTweetMap(pipe(apiToTweet, assocUser(userInfo)));
  const updateTweets = await updateQuery(auth, userInfo, update_size);
  const thUpdateTweets = toTh(updateTweets);
  return thUpdateTweets;
};

const doBigTweetScrape = async (_) => {
  const auth = await getStg('auth');
  const userInfo = await getStg('userInfo');
  const timeline = await doTimelineScrape(auth, userInfo);
  const bookmarks = await doBookmarkScrape(auth, userInfo);
  const toAdd = R.concat(timeline, bookmarks);
  enqueueTweetStg('queue_addTweets', toAdd);
  setStg('doBigTweetScrape', false);
};

const doSmallTweetScrape = async (_) => {
  const auth = await getStg('auth');
  const userInfo = await getStg('userInfo');
  const timeline = await doTimelineUpdateScrape(auth, userInfo);
  const bookmarks = await doBookmarkScrape(auth, userInfo);
  const toAdd = R.concat(timeline, bookmarks);
  enqueueTweetStg('queue_addTweets', toAdd);
  setStg('doSmallTweetScrape', false);
};

// IDB functions
const importTweetQueue = async (queue) => {
  const db = await dbOpen();
  const queueContents = await dequeue4WorkStg(
    'queue_addTweets',
    R.length(queue)
  );
  await importTweets(db, (x) => x, queueContents);
  db.close();
  updateNTweets();
  setStg('doIndexUpdate', true);
  dequeueWorkQueueStg('queue_addTweets', R.length(queueContents)); // need to empty the working queue after using it
};

const updateNTweets = async () => {
  const db = await dbOpen();
  const keys = await db.getAllKeys('tweets');
  db.close();
  const n = R.length(keys);
  setStg('nTweets', n);
  return n;
};

const doIndexUpdate = async () => {
  const db_promise = dbOpen();
  const index = await loadIndexFromIdb(db_promise);
  const newIndex = await updateIdxFromIdb(index, db_promise);
};

// RPC functions

// Chrome extension business
const webReqPermission = async ({}) => {
  console.log('webReqPermission... ');
  const granted = await chrome.permissions.request({
    permissions: ['webRequest'],
  });
  setStg('webRequestPermission', granted);
  // console.log('webReqPermission', { granted });
  return granted;
};

// Playground proxy functions
const fetchBg = async ({ url, options }) => {
  return await thFetch(url, options);
};
const getAuth = async (_) => {
  return await getData('auth');
};

/* BG flow */
// Listen for auth and store it. simple.
//
const webRequestPermission$ = makeInitStgObs('webRequestPermission');
webRequestPermission$.log('webRequestPermission$');
const auth$ = webRequestPermission$
  .filter((x) => x)
  .skipDuplicates()
  .map(inspect('making auth obs'))
  .flatMapLatest((_) => makeAuthObs())
  .skipDuplicates(compareAuths);
subObs({ auth$ }, setStg('auth'));
const _userInfo$ = auth$
  .thru<Observable<User, any>>(
    promiseStream((auth: RequestInit) => fetchUserInfo(auth))
  )
  .filter(pipe(isNil, not))
  .filter(pipe(prop('id'), isNil, not))
  .thru(errorFilter('_userInfo$'));
const userInfo$ = Kefir.merge([
  _userInfo$.skipDuplicates(),
  // _userInfo$.sampledBy(dataReset$),
]);
subObs({ userInfo$ }, setStg('userInfo'));
subObs({ userInfo$ }, (_) => setStg('doSmallTweetScrape', true));
const accounts$ = makeInitStgObs('activeAccounts').map(defaultTo([]));
accounts$.log('accounts$');
const incomingAccount$ = userInfo$.map(assoc('showTweets', true)).toProperty();
// Add to a list with no duplicates of the key (so no duplicates)
subObs({ incomingAccount$ }, async (acc) => {
  if (!R.has('id_str', acc)) return;
  const oldAccs = await getStg('activeAccounts');
  const isNew = isNil(R.find(propEq('id_str', prop('id_str', acc)), oldAccs));
  if (isNew) setStg('doBigTweetScrape', true);
  modStg('activeAccounts', (oldAccs) =>
    R.unionWith(R.eqBy(R.prop('id_str')), [acc], oldAccs)
  );
});

// we need userinfo and auth to do these
const doBigTweetScrape$ = userInfo$
  .take(1)
  .flatMapLatest((_) => makeInitStgObs('doBigTweetScrape'))
  .filter((x) => x);
subObs({ doBigTweetScrape$ }, doBigTweetScrape);

const doSmallTweetScrape$ = userInfo$
  .take(1)
  .flatMapLatest((_) => makeInitStgObs('doSmallTweetScrape'))
  .filter((x) => x);
subObs({ doSmallTweetScrape$ }, doSmallTweetScrape);

const queue_addTweets$ = makeInitStgObs('queue_addTweets').filter(
  (queue) => !(isEmpty(queue) || isNil(queue))
);
subObs({ queue_addTweets$ }, importTweetQueue);

const doIndexUpdate$ = makeInitStgObs('doIndexUpdate').filter((x) => x);
subObs({ doIndexUpdate$ }, doIndexUpdate);

// const accountsUpdate$ = Kefir.merge([incomingAccounts$])
// // const accountsUpdate$ = Kefir.merge([removeAccount$, incomingAccounts$])
// subObs({ accountsUpdate$ }, setStg('activeAccounts'));
const accsShown$ = accounts$.map(
  pipe(
    // it's a search filter
    values,
    filter(either(pipe(prop('showTweets'), isNil), propEq('showTweets', true)))
  )
) as unknown as Observable<User[], any>;
accsShown$.log('accsShown$');

/* RPC BG */

var proxyFns = {
  fetchBg,
  getAuth,
};
var rpcFns = { ...proxyFns, webReqPermission };
// RPC central
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension',
    { sender, request }
  );

  if (request.type != 'rpcBg' || R.has('fname', request)) {
    sendResponse('not RPC');
    return;
  }
  // switch (request.fnName) {
  //   case 'webReqPermission':
  //     const granted = await reqWebReqPermission({});
  //     setStg('webRequestPermission', granted);
  //     sendResponse(granted);
  //     break;
  //   case 'fetchBg':
  //     const resP = thFetch(request.args.url, request.args.options);
  //     const res = await resP;
  //     sendResponse(res);
  //     break;
  //   case 'getAuth':
  //     const auth = await getData('auth');
  //     sendResponse(auth);
  //     break;
  //   default:
  //     break;
  // }
  if (
    propEq('type', 'rpcBg') &&
    R.has('fnName', request) &&
    R.includes(request.fnName, keys(rpcFns))
  ) {
    try {
      sendResponse(await rpcFns[request.fnName](defaultTo({}, request.args)));
    } catch (error) {
      sendResponse('RPC call failed');
      console.error(error);
    }
  } else {
    sendResponse('not RPC');
    console.error(`bgRpc no function ${request.fnName}`);
  }

  return true;
});

/* Connection to tabs and CS */

let ports = [];

function disconnected(p: chrome.runtime.Port) {
  ports = R.without([p], ports);
  console.log('[DEBUG] Port disconnected', { p, ports });
}

function connected(p: chrome.runtime.Port) {
  if (R.length(ports) <= 0) setStg('doBigTweetScrape', true);
  ports = R.append(p, ports);
  p.onDisconnect.addListener(disconnected);
  console.log('[DEBUG] Port connected', { p, ports });
}

chrome.runtime.onConnect.addListener(connected);

var openTwitterTabs: number[] = [];
const addTtTab = (id) => {
  openTwitterTabs = R.union(openTwitterTabs, [id]);
};
const remTtTab = (id) => {
  openTwitterTabs = R.without([id], openTwitterTabs);
};
// TODO emit to active tab
async function onTabActivated(activeInfo: { tabId: number }) {
  console.log('[DEBUG] Tab opened ', {
    tab: activeInfo,
    openTwitterTabs,
  });
  const tab = await chrome.tabs.get(activeInfo.tabId);
  console.log('[DEBUG] Tab get', { tab, openTwitterTabs });
  if (isNil(prop('url', tab))) return;
  try {
    if (tab.url.match(twitter_url)) {
      addTtTab(activeInfo.tabId);
      console.log('[DEBUG] Tab opened: Twitter', {
        tab: activeInfo.tabId,
        openTwitterTabs,
      });
    }
  } catch (e) {
    console.error(e);
  }
}

function onTabUpdated(
  tabId,
  change: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  try {
    // console.log(`[DEBUG] onTabUpdated, urls=`, {change, tab})
    if (change.status === 'complete' && tab.url && tab.url.match(twitter_url)) {
      console.log('[DEBUG] Browser action: enabling');
      chrome.browserAction.enable(tabId);
    } else {
      console.log('[DEBUG] Browser action: disabling');
      // chrome.browserAction.disable(tabId);
    }
  } catch (e) {
    // chrome.browserAction.disable(tabId);
    console.error(e);
  }
  if (change.status === 'complete' && tab.active && tab.url) {
    if (tab.url.match(twitter_url)) {
      addTtTab(tab.id);
      console.log('[DEBUG] Tab changed: Twitter', {
        tab: tab.id,
        openTwitterTabs,
      });

      msgCS(tab.id, { type: 'tab-change-url', url: change.url, cs_id: tab.id });
    } else {
      remTtTab(tab.id);
      console.log('[DEBUG] Tab changed: Twitter', {
        tab: tab.id,
        openTwitterTabs,
      });
    }
  }
}

function onTabRemoved(tabId, removeInfo) {
  remTtTab(tabId);
  console.log('[DEBUG] Tab removed: Twitter', { tab: tabId, openTwitterTabs });
}

// Onboarding, Upboarding, Off boarding

const onInstalled = curry(
  (
    resetData: () => void,
    {
      reason,
      previousVersion,
      id,
    }: { reason: string; previousVersion: string; id: string }
  ) => {
    console.log('[DEBUG] onInstalled', { reason, previousVersion, id });
    switch (
      reason // "install", "update", "chrome_update", or "shared_module_update"
    ) {
      case 'update':
        onUpdated(previousVersion);
        break;
      case 'install':
        onFirstInstalled(resetData, previousVersion, id);
        break;
      default:
        break;
    }
  }
);

const onFirstInstalled = async (resetData, previousVersion, id) => {
  console.log(`[INFO] first install. Welcome to TH! ${previousVersion}`);
  if (!DEBUG) {
    const welcomeUrl =
      'https://www.notion.so/Welcome-e7c1b2b8d8064a80bdf5600c329b370d';
    chrome.tabs.create({ url: welcomeUrl });
  }
  resetData();
};

const onUpdated = async (previousVersion) => {
  console.log(`[INFO] updated from version ${previousVersion}`);
  // add new stg fields from defaults
  if (!DEBUG) {
    // chrome.tabs.create({
    //   url: 'https://www.notion.so/Patch-Notes-afab29148a0c49358df0e55131978d48',
    // });
  }
  // msgSomeWorker(pWorker, { type: 'resetIndex' });
  updateStorage();
  // delete old stg fields that are not in default
  cleanOldStorage();
  // refresh idb tweets (lookup)
  setStg('doRefreshIdb', true);
  setStg('showPatchNotes', true);
  // remake index
};

if (!DEBUG) {
  chrome.runtime.setUninstallURL(
    'https://docs.google.com/forms/d/e/1FAIpQLSf2s5y8tIFEQj4dIyk55QXS0DQmHQ_cmspmJmKNTslISOJ6oA/viewform'
  );
}

chrome.runtime.onSuspend.addListener(function () {
  console.log('[DEBUG] Unloading, suspending.');
  chrome.browserAction.setBadgeText({ text: '' });
});

/* modular bg */

// const db = dbOpen();
// const stgObs$ = makeStorageChangeObs();
// stgObs$.onValue(nullFn);
