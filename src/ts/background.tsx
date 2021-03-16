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
import { dbFilter, dbOpen } from './worker/idb_wrapper';
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
  makeInitOptionsObs,
} from './utils/bgUtils';
import {
  cleanOldStorage,
  dequeue4WorkStg,
  dequeueStg,
  dequeueWorkQueueStg,
  enqueueStg,
  enqueueTweetStg,
  getData,
  getOption,
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
import { update_size, n_tweets_results } from './utils/params';
import {
  currentValue,
  curVal,
  errorFilter,
  inspect,
  isExist,
  list2Obj,
  makeMsgStream,
  nullFn,
  promiseStream,
  streamAnd,
  toggleDebug,
  toVal,
  waitFor,
} from './utils/putils';
import {
  getLatestTweets,
  getRandomSampleTweets,
  makeValidateTweet,
} from './worker/search';
import 'chrome-extension-async';
import { permissions } from '../../baseManifest';
import {
  importTweets,
  loadIndexFromIdb,
  removeTweets,
  updateIdxFromIdb,
} from './dev/storage/devStgUtils';
import { thTweet } from './types/tweetTypes';
import { StoreName } from './types/dbTypes';

const createSearchWorker = createWorkerFactory(
  () => import('./dev/workers/searchWorker')
);
const createIdbWorker = createWorkerFactory(
  () => import('./dev/workers/idbWorker')
);
const createScrapeWorker = createWorkerFactory(
  () => import('./bg/twitterScout')
  // () => import('./dev/workers/scrapeWorker')
);
const searchWorker = createSearchWorker();
const idbWorker = createIdbWorker();
const scrapeWorker = createScrapeWorker();

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

const queue_load = 2000;
const isQueueBusy = async (name) => {
  const wQ = await getStg(name + '_work_queue');
  console.log('isQueueBusy', { wQ });
  return isExist(wQ);
};

const maybeDq = curry(async (name) => {
  const busy = await isQueueBusy(name);
  if (!busy) {
    console.log('[DEBUG] dq', { name });
    dequeue4WorkStg(name, queue_load);
  } else {
    console.log('[DEBUG] dq: queue busy ', { name });
  }
  // dequeue4WorkStg(name, R.length(defaultTo([], queue)));
});
const subWorkQueue = (name, workFn) => {
  const queue$ = makeInitStgObs(name).filter(isExist);
  queue$.log(name + '$');
  subObs({ [name + '$']: queue$ }, (_) => maybeDq(name));
  const workQueue$ = makeInitStgObs(name + '_work_queue').filter(
    pipe(isNil, not)
  );
  workQueue$.log(name + '_work_queue' + '$');
  const _workFn = async (queue) => {
    if (isExist(queue)) {
      await workFn(queue);
      dequeueWorkQueueStg(name, R.length(queue));
    } else {
      maybeDq(name);
    }
  };
  subObs({ [name + '_work_queue' + '$']: workQueue$ }, _workFn);
};

const emitIndexUpdated = () => {
  window.dispatchEvent(new CustomEvent('indexUpdated'));
};

/* TODO: Functions to move out of this file */
// Scraping functions
const checkGotTimeline = async (
  userInfo: FullUser,
  timeline: string | any[]
) => {
  // const userInfo = await getStg('userInfo');
  return (
    timeline.length > 3000 || timeline.length >= userInfo.statuses_count - 1
  );
};
var usernameFilterRegex = /(from|to):([a-zA-Z0-9_]*\s?[a-zA-Z0-9_]*)$/;
const makeUserQuery = (userQuery) => {
  var usernameMatch = userQuery.match(usernameFilterRegex);
  return usernameMatch ? usernameMatch[2] : userQuery;
};
const assocUser = (userInfo) => assoc('account', prop('id_str', userInfo));

const doBookmarkScrape = async (auth, userInfo) => {
  const toTh = saferTweetMap(pipe(bookmarkToTweet, assocUser(userInfo)));
  try {
    const bookmarks = await scrapeWorker.getBookmarks(auth);
    const thBookmarks = toTh(bookmarks);
    return thBookmarks;
  } catch (e) {
    console.error("couldn't doBookmarkScrape");
    return [];
  }
};
const doTimelineScrape = async (auth, userInfo) => {
  // try {
  const toTh = saferTweetMap(pipe(apiToTweet, assocUser(userInfo)));
  const timelineTweets = await scrapeWorker.timelineQuery(auth, userInfo);
  const thTimelineTweets = toTh(timelineTweets);
  return thTimelineTweets;
  // } catch (e) {
  //   console.error("couldn't doTimelineScrape");
  //   return [];
  // }
};
const doTimelineUpdateScrape = async (auth, userInfo) => {
  const toTh = saferTweetMap(pipe(apiToTweet, assocUser(userInfo)));
  try {
    const updateTweets = await scrapeWorker.updateQuery(
      auth,
      userInfo,
      update_size
    );
    const thUpdateTweets = toTh(updateTweets);
    return thUpdateTweets;
  } catch (e) {
    console.error("couldn't doTimelineUpdateScrape");
    return [];
  }
};

const doBigTweetScrape = async (_) => {
  const [auth, userInfo] = await Promise.all([
    getStg('auth'),
    getStg('userInfo'),
  ]);
  try {
    const timeline = await doTimelineScrape(auth, userInfo);
    const bookmarks = await doBookmarkScrape(auth, userInfo);
    const toAdd = R.concat(timeline, bookmarks);
    enqueueTweetStg('queue_addTweets', toAdd);
    setStg('doBigTweetScrape', false);
  } catch (e) {
    console.error('doBigTweetScrape failed', { e });
  }
};

const doSmallTweetScrape = async (_) => {
  const [auth, userInfo] = await Promise.all([
    getStg('auth'),
    getStg('userInfo'),
  ]);
  console.log('[DEBUG] doSmallTweetScrape', { auth, userInfo });
  const timeline = await doTimelineUpdateScrape(auth, userInfo);
  const bookmarks = await doBookmarkScrape(auth, userInfo);
  const toAdd = R.concat(timeline, bookmarks);
  enqueueTweetStg('queue_addTweets', toAdd);
  setStg('doSmallTweetScrape', false);
};

// TODO: mind the associated account in full lookup: should be the original one, not the one doing the lookup
const genericLookupAPI = curry(
  async (toTweet: (ts: Status) => thTweet, ids) => {
    const [auth, userInfo] = await Promise.all<Credentials, User>([
      getStg('auth'),
      getStg('userInfo'),
    ]);
    const toTweetAndAcc = pipe(toTweet, assocUser(userInfo));
    const toTh = saferTweetMap(toTweetAndAcc);
    const lookupTweets = await scrapeWorker.tweetLookupQuery(auth, ids);
    const thLookupTweets = toTh(lookupTweets);
    enqueueTweetStg('queue_addTweets', thLookupTweets);
  }
);

const doLookupAPI = genericLookupAPI(apiToTweet);
const doLookupBookmarkAPI = genericLookupAPI(bookmarkToTweet);

// IDB functions

const importArchive = async (queue) => {
  const [auth, userInfo] = await Promise.all<Credentials, User>([
    getStg('auth'),
    getStg('userInfo'),
  ]);
  const patchedArchive = await scrapeWorker.patchArchive(auth, userInfo, queue);
  const toTh = saferTweetMap(archToTweet);
  const thArchiveTweets = toTh(patchedArchive);
  enqueueTweetStg('queue_addTweets', thArchiveTweets);
};

const importTweetQueue = async (queue) => {
  // await importTweets(db, (x) => x, queue);
  console.log('importTweetQueue', { queue, idbWorker });
  await idbWorker.workerImportTweets(queue);
  setStg('doIndexUpdate', true);
  // dequeueWorkQueueStg('queue_addTweets', R.length(queue)); // need to empty the working queue after using it
};
// remove tweets in the remove queue
const removeTweetQueue = async (queue) => {
  // await removeTweets(db, queue);
  await idbWorker.workerRemoveTweets(queue);
  setStg('doIndexUpdate', true);
  // dequeueWorkQueueStg('queue_removeTweets', R.length(queue)); // need to empty the working queue after using it
};

const updateNTweets = async () => {
  const db = await dbOpen();
  const keys = await db.getAllKeys('tweets');
  db.close();
  const n = R.length(keys);
  setStg('nTweets', n);
  return n;
};

const setLastUpdated = async () => {
  const date = getDateFormatted();
  setStg('lastUpdated', date);
  return date;
};

const doIndexUpdate = async () => {
  const db_promise = dbOpen();
  const index = await loadIndexFromIdb(db_promise);
  const newIndex = await updateIdxFromIdb(index, db_promise);
  setStg('doIndexUpdate', false);
  emitIndexUpdated();
};

const onIndexUpdated = async () => {
  await searchWorker.loadIndex();
  updateNTweets();
  setLastUpdated();
  getLatest();
};

// RPC functions

// Chrome extension business

const webReqPermission = async ({}) => {
  console.log('webReqPermission... ');
  const permitted = await chrome.permissions.contains({
    permissions: ['webRequest'],
  });
  if (permitted) {
    setStg('webRequestPermission', permitted);
    return permitted;
  } else {
    const granted = await chrome.permissions.request({
      permissions: ['webRequest'],
    });
    setStg('webRequestPermission', granted);
    return granted;
  }
};
// Playground proxy functions
const fetchBg = async ({ url, options }) => {
  return await scrapeWorker.thFetch(url, options);
};
const getAuth = async (_) => {
  return await getData('auth');
};

const calcAccsShown = (activeAccounts: activeAccsType): User[] =>
  filter(
    either(pipe(prop('showTweets'), isNil), propEq('showTweets', true)),
    values(activeAccounts)
  );

const getSearchParams = async () => {
  const [getRTs, useBookmarks, useReplies, activeAccounts] = await Promise.all([
    getOption('getRTs'),
    getOption('useBookmarks'),
    getOption('useReplies'),
    getStg('activeAccounts'),
  ]);
  const accsShown: User[] = calcAccsShown(activeAccounts);
  const filters: SearchFilters = {
    getRTs: getRTs.value,
    useBookmarks: useBookmarks.value,
    useReplies: useReplies.value,
  };
  return { accsShown, filters };
};
const seek = async ({ query }) => {
  // const isMidSearch = getStg('isMidSearch')
  // console.trace(`seek ${query}`);
  if (await getStg('isMidSearch')) return;
  const { accsShown, filters } = await getSearchParams();
  console.time(`${query} seek`);
  const searchResults = await searchWorker.seek(
    filters,
    accsShown,
    n_tweets_results,
    query
  );
  console.timeEnd(`${query} seek`);
  setStg('isMidSearch', false);
  await setStg('search_results', searchResults);
  return map(prop('id'), searchResults);
};
const getLatest = async () => {
  const { accsShown, filters } = await getSearchParams();
  const db = await dbOpen();
  const dbGet = curry((storeName, key) => db.get(storeName, key));
  console.log('getting latest tweets ', { accsShown, filters });
  const latestTweets = await getLatestTweets(
    n_tweets_results,
    filters,
    dbGet,
    accsShown,
    () => db.getAllKeys('tweets')
  );
  const res = map((tweet) => {
    return { tweet };
  }, latestTweets);
  db.close();
  setStg('latest_tweets', res);
  return map(prop('id'), latestTweets);
};

const getRandom = async () => {
  const { accsShown, filters } = await getSearchParams();
  const db = await dbOpen();
  const dbGet = curry((storeName, key) => db.get(storeName, key));
  const randomSample = await getRandomSampleTweets(
    n_tweets_results,
    filters,
    dbGet,
    accsShown,
    () => db.getAllKeys('tweets')
  );
  const res = map((tweet) => {
    return { tweet };
  }, randomSample);
  db.close();
  setStg('latest_tweets', res);
  setStg('random_tweets', res);
  console.log('getRandom', { res, accsShown, filters });
  return map(prop('id'), randomSample);
};

const getDefault = (mode) => {
  if (mode === 'random') {
    getRandom();
  } else {
    getLatest();
  }
  return;
};

const doUserSearch = async ({ query }) => {
  if (
    isEmpty(query) ||
    (query.match(/^\/(?!from|to)/) && !query.match(/(from|to)/))
  ) {
    setStg('api_users', []);
    return [];
  }
  const auth = await getStg('auth');
  const usersRes = await searchUsers(auth, query);
  const users = prop('users', usersRes);
  console.log('doUserSearch', { usersRes, users });
  setStg('api_users', users);
};

const doSearchApi = async ({ query }) => {
  if (isEmpty(query)) {
    setStg('api_results', []);
    return [];
  }
  const auth = await getStg('auth');
  const apiResults = await searchAPI(auth, query);
  const toTh = pipe(
    saferTweetMap(apiSearchToTweet),
    map((tweet) => {
      return { tweet };
    })
  );
  const res = toTh(apiResults);
  setStg('api_results', res);
  return res;
};

const addBookmark = ({ ids }) => {
  enqueueTweetStg('queue_lookupBookmark', ids);
};
const removeBookmark = ({ ids }) => {
  enqueueTweetStg('queue_removeTweets', ids);
};
const deleteTweet = ({ ids }) => {
  enqueueTweetStg('queue_removeTweets', ids);
};

const removeAccount = async ({ id }) => {
  const db = await dbOpen();
  const removeAccount = async (id_str: string): Promise<any> => {
    db.delete('accounts', id_str);
    return db.getAll('accounts');
  };
  const filterByAccount = (id) => {
    dbFilter<thTweet>(db, StoreName.tweets, propEq('account', id));
  };
  const remainingAccounts = removeAccount(id);
  await pipe(
    () => filterByAccount(id),
    andThen(map(prop('id'))),
    andThen((ids) => enqueueTweetStg('queue_removeTweets', ids))
  )();

  db.close();
  return remainingAccounts;
};

const updateTimeline = ({}) => setStg('doSmallTweetScrape', true);

/* BG flow */
// Listen for auth and store it. simple.
//const webRequestPermitted$ = permissions$.thru(

const webRequestPermission$ = makeInitStgObs('webRequestPermission');
// const webRequestPermission$ = makeInitStgObs('webRequestPermission');
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
    promiseStream((auth: Credentials) => fetchUserInfo(auth))
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

const incomingAccount$ = userInfo$.map(assoc('showTweets', true)).toProperty();
// Add to a list with no duplicates of the key (so no duplicates)

const onIncomingAccount = async (acc: User) => {
  if (!R.has('id_str', acc)) return; // it needs to have at least an id_str to be valid
  const oldAccs = await getStg('activeAccounts');
  const isNew = !R.has(prop('id_str', acc), oldAccs); // check
  if (isNew) setStg('doBigTweetScrape', true);
  console.log('[DEBUG] onIncomingAccount', { acc, oldAccs, isNew });
  modStg('activeAccounts', (olds) =>
    R.set(R.lensProp(prop('id_str', acc)), acc, olds)
  );
};
subObs({ incomingAccount$ }, onIncomingAccount);

// we need userinfo and auth to do these
const doBigTweetScrape$ = userInfo$
  .take(1)
  .flatMapLatest((_) => makeInitStgObs('doBigTweetScrape'))
  .map(inspect('[DEBUG] doBigTweetScrape change'))
  .filter((x) => x)
  .throttle(2500);
subObs({ doBigTweetScrape$ }, doBigTweetScrape);

const doSmallTweetScrape$ = userInfo$
  .take(1)
  .flatMapLatest((_) => makeInitStgObs('doSmallTweetScrape'))
  .filter((x) => x)
  .throttle(2500);
subObs({ doSmallTweetScrape$ }, doSmallTweetScrape);

subWorkQueue('queue_lookupBookmark', doLookupBookmarkAPI);
subWorkQueue('queue_lookupTweets', doLookupAPI);
subWorkQueue('queue_addTweets', importTweetQueue);
subWorkQueue('queue_removeTweets', removeTweetQueue);
subWorkQueue('queue_tempArchive', importArchive);

const doIndexUpdate$ = makeInitStgObs('doIndexUpdate').filter((x) => x);
subObs({ doIndexUpdate$ }, doIndexUpdate);

const indexUpdated$ = Kefir.fromEvents(window, 'indexUpdated');
subObs({ indexUpdated$ }, (_) => onIndexUpdated());

const query$ = makeInitStgObs('query');
query$.log('query$');
subObs({ query$ }, (query) => seek({ query }));
const isMidSearch$ = makeInitStgObs('isMidSearch');
// just to make sure isMidSearch$ never gets stuck
subObs(
  { isMidSearch$: isMidSearch$.filter((x) => x).delay(2000 * 5) },
  setStg('isMidSearch', false)
);
// const msg$ = makeGotMsgObs().map(prop('m'));
// const msgStream = makeMsgStream(msg$);
// const apiQuery$ = msgStream('apiQuery').map(prop('query'));
// subObs({ apiQuery$ }, doSearchApi);

// const apiReqUsers$ = apiQuery$
//   .filter(
//     (q) => !(isEmpty(q) || (q.match(/^\/(?!from|to)/) && !q.match(/(from|to)/)))
//   )
//   .map(makeUserQuery);
// subObs({ apiReqUsers$ }, doUserSearch);

// const accountsUpdate$ = Kefir.merge([incomingAccounts$])
// // const accountsUpdate$ = Kefir.merge([removeAccount$, incomingAccounts$])
// subObs({ accountsUpdate$ }, setStg('activeAccounts'));
const optionsChange$ = makeStorageChangeObs().filter(
  propEq('itemName', 'options')
);

const _makeInitOptionsObs = makeInitOptionsObs(optionsChange$);
const accounts$ = makeInitStgObs('activeAccounts').map(defaultTo([]));
accounts$.log('accounts$');
const accsShown$ = (accounts$.map(
  filter(either(pipe(prop('showTweets'), isNil), propEq('showTweets', true)))
) as unknown) as Observable<User[], any>;
subObs({ accsShown$ }, (_) => getLatest());
accsShown$.log('accsShown$');
/* Display options and Search filters */
const idleMode$ = _makeInitOptionsObs('idleMode') as Observable<IdleMode, any>;
idleMode$.log('idleMode$');
subObs({ idleMode$ }, getDefault);

const searchMode$ = _makeInitOptionsObs('searchMode');
const searchFilters$ = Kefir.merge([
  _makeInitOptionsObs('getRTs'),
  _makeInitOptionsObs('useBookmarks'),
  _makeInitOptionsObs('useReplies'),
]).toProperty();
subObs({ searchFilters$ }, (_) => getLatest());

/* RPC BG */
// RPC INSTRUCTIONS:
// write rpc functions like this: fnName({arg0, arg1....})
// call bg functions like this, rpcBg(fnName, args?)
var scrapingFns = {
  updateTimeline,
};
var idbFns = {
  addBookmark,
  removeBookmark,
  deleteTweet,
  removeAccount,
};
var searchFns = {
  seek,
  getLatest,
  getRandom,
  doUserSearch,
  doSearchApi,
};
var proxyFns = {
  fetchBg,
  getAuth,
};
var rpcFns = {
  ...proxyFns,
  ...searchFns,
  ...idbFns,
  ...scrapingFns,
  webReqPermission,
};
// RPC central
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  // console.log(
  //   sender.tab
  //     ? 'from a content script:' + sender.tab.url
  //     : 'from the extension',
  //   { sender, request }
  // );

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
  let response = '';
  if (
    propEq('type', 'rpcBg') &&
    R.has('fnName', request) &&
    R.includes(request.fnName, keys(rpcFns))
  ) {
    try {
      // console.time(`[TIME] RPC ${request.fnName}`);
      response = await rpcFns[request.fnName](defaultTo({}, request.args));
      // console.timeEnd(`[TIME] RPC ${request.fnName}`);
      sendResponse(response);
    } catch (error) {
      response = 'RPC call failed';
      console.error(error);
    }
  } else {
    response = 'not RPC';
    console.error(`bgRpc no function ${request.fnName}`);
  }
  sendResponse(response);

  return true;
});

/* Connection to tabs and CS */

let ports = [];

function disconnected(p: chrome.runtime.Port) {
  ports = R.without([p], ports);
  console.log('[DEBUG] Port disconnected', { p, ports });
}

function connected(p: chrome.runtime.Port) {
  if (R.length(ports) <= 0 && !DEBUG) setStg('doBigTweetScrape', true);
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

const onInstalled = ({ reason, previousVersion, id }) => {
  if (DEBUG) webReqPermission({}); // check and request webReqpermission on install
  console.log('[DEBUG] onInstalled', { reason, previousVersion, id });
  switch (
    reason // "install", "update", "chrome_update", or "shared_module_update"
  ) {
    case 'update':
      onUpdated(previousVersion);
      break;
    case 'install':
      onFirstInstalled(previousVersion, id);
      break;
    default:
      console.log('on installed', { reason, previousVersion, id });
      break;
  }
};

const onFirstInstalled = async (previousVersion, id) => {
  console.log(`[INFO] first install. Welcome to TH! ${previousVersion}`);
  if (DEBUG) setStg('doBigTweetScrape', true);
  if (!DEBUG) {
    const welcomeUrl =
      'https://www.notion.so/Welcome-e7c1b2b8d8064a80bdf5600c329b370d';
    chrome.tabs.create({ url: welcomeUrl });
  }
  // resetData();
};

const onUpdated = async (previousVersion) => {
  console.log(`[INFO] updated from version ${previousVersion}`);
  // add new stg fields from defaults
  if (!DEBUG) {
    // chrome.tabs.create({
    //   url: 'https://www.notion.so/Patch-Notes-afab29148a0c49358df0e55131978d48',
    // });
  }
  // updateStorage();
  // // delete old stg fields that are not in default
  // cleanOldStorage();
  // // refresh idb tweets (lookup)
  // setStg('doRefreshIdb', true);
  // setStg('showPatchNotes', true);
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

chrome.runtime.onInstalled.addListener(onInstalled);

/* modular bg */

// const db = dbOpen();
// const stgObs$ = makeStorageChangeObs();
// stgObs$.onValue(nullFn);
