// only for development with `npm run serve`, to take advantage of HMR

import '@babel/polyfill';
import compareVersions from 'compare-versions';
import { createWorkerFactory } from '@shopify/web-worker';
import 'chrome-extension-async';
import Kefir, { Observable } from 'kefir';
import 'preact/debug';
import * as R from 'ramda';
import {
  andThen,
  assoc,
  curry,
  defaultTo,
  either,
  filter,
  head,
  isEmpty,
  isNil,
  keys,
  map,
  not,
  pipe,
  prop,
  propEq,
  values,
} from 'ramda'; // Function
import { FullUser, User } from 'twitter-d';
import {
  fetchUserInfo,
  genericLoopRetry,
  getBookmarks,
  patchArchive,
  searchAPI,
  searchUsers,
  thFetch,
  timelineQuery,
  tweetLookupQuery,
  updateQuery,
} from './bg/twitterScout';
import { makeAuthObs } from './bg/auth';
import {
  choosePatchUrl,
  uninstallUrl,
  updateNeedRefresh,
} from './bg/updateManager';
import {
  apiSearchToTweet,
  apiToTweet,
  archToTweet,
  bookmarkToTweet,
} from './bg/tweetImporter';
import { loadIndexFromIdb, updateIdxFromIdb } from './dev/storage/devStgUtils';
import window from './global';
import { StoreName } from './types/dbTypes';
import {
  ActiveAccsType,
  IdleMode,
  SearchFilters,
  SearchResult,
} from './types/stgTypes';
import { UserAndThTweets, thTweet, UserObj } from './types/tweetTypes';
import { Credentials } from './types/types';
import {
  compareAuths,
  getDateFormatted,
  makeInitOptionsObs,
  makeInitStgObs,
  saferTweetMap,
  twitter_url,
} from './utils/bgUtils';
import {
  cleanOldStorage,
  dequeue4WorkStg,
  dequeueWorkQueueStg,
  enqueueStg,
  enqueueStgNoDups,
  enqueueTweetStg,
  enqueueUserStg,
  getData,
  getOption,
  getStg,
  getStgPath,
  makeStorageChangeObs as makeStorageChangeObs,
  modStg,
  msgCS,
  setStg,
  setStgFlag,
  setStgPath,
  softUpdateStorage,
} from './utils/dutils';
import { initGA, PageView } from './utils/ga';
import { n_tweets_results, update_size, queue_load } from './utils/params';
import {
  currentValue,
  errorFilter,
  inspect,
  isExist,
  nullFn,
  promiseStream,
  toggleDebug,
} from './utils/putils';
import { dbFilter, dbOpen } from './bg/idb_wrapper';
import { getLatestTweets, getRandomSampleTweets } from './bg/search';

const createSearchWorker = createWorkerFactory(
  () => import('./bg/searchWorker')
);
const createIdbWorker = createWorkerFactory(() => import('./bg/idbWorker'));
const createScrapeWorker = createWorkerFactory(
  () => import('./bg/twitterScout')
  // () => import('./dev/workers/scrapeWorker')
);
const searchWorker = createSearchWorker();
const idbWorker = createIdbWorker();
const scrapeWorker = createScrapeWorker();

// Scrape worker can't make requests for some people (TODO: find cause)
// tries one function with the arguments and if it doesn't work tries the other one
const tryFnsAsync = async (fn1, fn2, ...args) => {
  try {
    return await fn1(...args);
  } catch (e) {
    console.log(`[ERROR] ${fn1.name} failed, trying ${fn2.name}`);
    return await fn2(...args);
  }
};

// Analytics //IMPORTANT: this block must come before setting the currentValue for Kefir. Property and I have no idea why
(function initAnalytics() {
  initGA();
})();
PageView('/background.html');
// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;
// log can contain the name of the operations done, arguments, succcess or not, time
const bgOpLog = (op: string) => {
  if (DEBUG) {
    const timestamp = `[${new Date().toISOString()}] `;
    enqueueStg('bgOpLog', [timestamp + op]);
  }
};

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

const isQueueBusy = async (name) => {
  const qLen = await getStg(name + '_work_queue_length');
  // console.log('isQueueBusy', { qLen });
  return !isNil(qLen) && qLen > 0;
};

const maybeDq = async (name) => {
  const busy = await isQueueBusy(name);
  if (!busy) {
    const workload = dequeue4WorkStg(name, queue_load);
    // console.log('[DEBUG] dq', { name, workload });
    return true;
  } else {
    // console.log('[DEBUG] dq: queue busy ', { name });
    return false;
  }
  // dequeue4WorkStg(name, R.length(defaultTo([], queue)));
};
const subWorkQueueStg = curry((storageChange$, name, workFn) => {
  // Waiting queue
  const queueFn = async (q) => {
    const qLen = R.length(q);
    setStg(name + '_length', qLen);
    // console.log('subWorkQueue ' + name, { qLen, q });
    if (qLen > 0) {
      await maybeDq(name);
    }
  };
  const queue$ = makeInitStgObs(storageChange$, name).filter(pipe(isNil, not));
  queue$.log(name + '$');
  subObs({ [name + '$']: queue$ }, queueFn);

  // Work queue (being worked on right now)
  const workQueueFn = async (queue) => {
    // keep track of the size of the queue because we check it sometimes
    setStg(name + '_work_queue' + '_length', R.length(queue));
    // If there's a queue, work it!
    if (isExist(queue)) {
      try {
        await workFn(queue);
        dequeueWorkQueueStg(name, R.length(queue));
      } catch (e) {
        console.error(
          `couldn't consume ${name + '_work_queue'} with ${workFn.name}`,
          e
        );
      }
    } else {
      //if the work queue is empty, maybe it shouldn't be! Dequeue any queued workload!
      maybeDq(name);
    }
  };
  const workQueue$ = makeInitStgObs(
    storageChange$,
    name + '_work_queue'
  ).filter(pipe(isNil, not));
  // workQueue$.log(name + '_work_queue' + '$');

  subObs({ [name + '_work_queue' + '$']: workQueue$ }, workQueueFn);
});

const emitEvent = (name) => {
  window.dispatchEvent(new CustomEvent(name));
};
const emitIndexUpdated = () => emitEvent('indexUpdated');
const emitDoBigScrape = () => emitEvent('doBigTweetScrape');
const emitDoSmallScrape = () => emitEvent('doSmallTweetScrape');

/* TODO: Functions to move out of this file */
// Scraping functions

var usernameFilterRegex = /(from|to):([a-zA-Z0-9_]*\s?[a-zA-Z0-9_]*)$/;

const startRefreshIdb = async () => {
  console.log('[DEBUG] startRefreshIdb');
  await idbWorker.resetIndex();
  const ids = await idbWorker.getAllIds(StoreName.tweets);
  enqueueStgNoDups('queue_lookupRefresh', ids);
  bgOpLog(`[startRefreshIdb] refreshing ${R.length(ids)} tweets. Success.`);
};

const loopRetryScrape = genericLoopRetry(3, 1000);
const assocUser = (userInfo) => assoc('account', prop('id_str', userInfo));
const doBookmarkScrape = async (auth, userInfo): Promise<UserAndThTweets> => {
  const toTh = saferTweetMap(pipe(bookmarkToTweet, assocUser(userInfo)));
  try {
    const { users, tweets } = await tryFnsAsync(
      scrapeWorker.getBookmarks,
      getBookmarks,
      auth
    );
    const thTweets = toTh(tweets);
    return { users, tweets: thTweets };
  } catch (e) {
    console.error("couldn't doBookmarkScrape");
    return { users: [], tweets: [] };
  }
};
const doTimelineScrape = async (auth, userInfo): Promise<UserAndThTweets> => {
  // try {
  const toTh = saferTweetMap(pipe(apiToTweet, assocUser(userInfo)));
  const { users, tweets } = await tryFnsAsync(
    scrapeWorker.timelineQuery,
    timelineQuery,
    auth,
    userInfo
  );
  const thTweets = toTh(tweets);
  return { users, tweets: thTweets };
  // } catch (e) {
  //   console.error("couldn't doTimelineScrape");
  //   return [];
  // }
};
const doTimelineUpdateScrape = async (
  auth,
  userInfo
): Promise<UserAndThTweets> => {
  const toTh = saferTweetMap(pipe(apiToTweet, assocUser(userInfo)));
  const { users, tweets } = await tryFnsAsync(
    scrapeWorker.updateQuery,
    updateQuery,
    auth,
    userInfo,
    update_size
  );
  console.log('doTimelineUpdateScrape', { users, tweets });
  const thTweets = toTh(tweets);
  return { users, tweets: thTweets };
};

const credsAndRetry = (fn, userInfo) =>
  loopRetryScrape(async () => {
    const auth = await getStg('auth');
    return fn(auth, userInfo);
  });

const updateLastGotTimeline = async (id_str, len) => {
  console.log('updateLastGotTimeline', { id_str, len, date: Date.now() });
  await setStgPath(['activeAccounts', id_str, 'lastGotTimeline'], Date.now());
  await setStgPath(['activeAccounts', id_str, 'lastGotTimelineCount'], len);
};
const doBigTweetScrape = async (_) => {
  try {
    const [auth, userInfo] = await Promise.all([
      getStg('auth'),
      getStg('userInfo'),
    ]);
    setStg('isMidScrape', true);
    const [timelineRes, bookmarksRes] = await Promise.all([
      credsAndRetry(doTimelineScrape, userInfo),
      credsAndRetry(doBookmarkScrape, userInfo),
    ]);

    console.log('doBigTweetScrape', {
      timelineRes,
      bookmarksRes,
      usersToStore: values(R.mergeLeft(timelineRes.users, bookmarksRes.users)),
    });
    enqueueUserStg(
      'queue_addUsers',
      values(R.mergeLeft(timelineRes.users, bookmarksRes.users))
    );
    enqueueTweetStg(
      'queue_addTweets',
      R.concat(timelineRes.tweets, bookmarksRes.tweets)
    );
    await updateLastGotTimeline(userInfo.id_str, R.length(timelineRes.tweets));
    setStg('isMidScrape', false);
    bgOpLog(
      `[doBigTweetScrape] yielded ${R.length(
        timelineRes.tweets
      )} tweets. Success.`
    );
  } catch (e) {
    console.error('doBigTweetScrape failed', { e });
    bgOpLog(`[doBigTweetScrape] Failed.`);
    setStg('isMidScrape', false);
  }
};

const doSmallTweetScrape = async (_) => {
  try {
    const [auth, userInfo] = await Promise.all([
      getStg('auth'),
      getStg('userInfo'),
    ]);
    setStg('isMidScrape', true);
    console.log('[DEBUG] doSmallTweetScrape', { auth, userInfo });

    const [timelineRes, bookmarksRes] = await Promise.all([
      credsAndRetry(doTimelineUpdateScrape, userInfo),
      credsAndRetry(doBookmarkScrape, userInfo),
    ]);
    console.log('doSmallTweetScrape', {
      timelineRes,
      bookmarksRes,
      usersToStore: values(R.mergeLeft(timelineRes.users, bookmarksRes.users)),
    });
    enqueueUserStg(
      'queue_addUsers',
      values(R.mergeLeft(timelineRes.users, bookmarksRes.users))
    );
    enqueueTweetStg(
      'queue_addTweets',
      R.concat(timelineRes.tweets, bookmarksRes.tweets)
    );
    // setStg('doSmallTweetScrape', false);
    setStg('isMidScrape', false);
    bgOpLog(
      `[doSmallTweetScrape] yielded ${R.length(
        timelineRes.tweets
      )} tweets. Success.`
    );
  } catch (e) {
    console.error('doSmallTweetScrape failed', { e });
    bgOpLog(`[doSmallTweetScrape] Failed.`);
    setStg('isMidScrape', false);
  }
};

// TODO: mind the associated account in full lookup: should be the original one, not the one doing the lookup
const genericLookupAPI = curry(
  async (toTweet: (ts: Status) => thTweet, queueName, ids) => {
    try {
      const [auth, userInfo] = await Promise.all<Credentials, User>([
        getStg('auth'),
        getStg('userInfo'),
      ]);
      setStg('isMidScrape', true);
      const toTweetAndAcc = pipe(toTweet, assocUser(userInfo));
      const toTh = saferTweetMap(toTweetAndAcc);
      const tweets = await tryFnsAsync(
        scrapeWorker.tweetLookupQuery,
        tweetLookupQuery,
        auth,
        ids
      );
      const users: UserObj = R.indexBy('id_str', map(prop('user'), tweets));
      const thLookupTweets = toTh(tweets);
      enqueueUserStg('queue_addUsers', values(users));
      enqueueTweetStg(queueName, thLookupTweets);
      setStg('isMidScrape', false);
    } catch (e) {
      console.error('lookupAPI failed', { e, queueName, fnName: toTweet.name });
      setStg('isMidScrape', false);
    }
  }
);

const doLookupAPI = genericLookupAPI(apiToTweet, 'queue_addTweets');
const doLookupBookmarkAPI = genericLookupAPI(
  bookmarkToTweet,
  'queue_addTweets'
);
const doLookupRefreshAPI = genericLookupAPI(apiToTweet, 'queue_refreshTweets');
// IDB functions

const importArchive = async (queue) => {
  try {
    const [auth, userInfo] = await Promise.all<Credentials, User>([
      getStg('auth'),
      getStg('userInfo'),
    ]);
    setStg('isMidScrape', true);
    const { users, tweets } = await tryFnsAsync(
      scrapeWorker.patchArchive,
      patchArchive,
      auth,
      userInfo,
      queue
    );
    const toTh = saferTweetMap(archToTweet);
    const thArchiveTweets = toTh(tweets);
    enqueueUserStg('queue_addUsers', values(users));
    enqueueTweetStg('queue_addTweets', thArchiveTweets);
    setStg('isMidScrape', false);
  } catch (e) {
    console.error("couldn't importArchive ", e);
    setStg('isMidScrape', false);
  }
};

const importUserQueue = async (queue) => {
  try {
    setStg('isMidStore', true);
    await idbWorker.workerImportUsers(queue);
    setStg('isMidStore', false);
  } catch (e) {
    console.error("couldn't importUserQueue ", e);
    setStg('isMidStore', false);
  }
};

// remove tweets in the remove queue
const removeUserQueue = async (queue) => {
  // await removeTweets(db, queue);
  try {
    setStg('isMidStore', true);
    await idbWorker.workerRemoveUsers(queue);
    setStg('isMidStore', false);
  } catch (e) {
    console.error("couldn't removeUserQueue ", e);
    setStg('isMidStore', false);
  }
  // dequeueWorkQueueStg('queue_removeTweets', R.length(queue)); // need to empty the working queue after using it
};

const importTweetQueue = async (queue) => {
  try {
    setStg('isMidStore', true);
    await idbWorker.workerImportTweets(queue);
    setStg('isMidStore', false);
    setStg('doIndexUpdate', true);
  } catch (e) {
    console.error("couldn't importTweetQueue ", e);
    setStg('isMidStore', false);
  }
};

const refreshTweetQueue = async (queue) => {
  try {
    setStg('isMidRefresh', true);
    await idbWorker.workerRefreshTweets(queue);
    setStg('isMidRefresh', false);
  } catch (e) {
    console.error("couldn't refreshTweetQueue ", e);
    setStg('isMidRefresh', false);
  }
  setStg('doIndexUpdate', true);
  setStg('startRefreshIdb', false);
};

// remove tweets in the remove queue
const removeTweetQueue = async (queue) => {
  // await removeTweets(db, queue);
  try {
    setStg('isMidStore', true);
    await idbWorker.workerRemoveTweets(queue);
    setStg('isMidStore', false);
    setStg('doIndexUpdate', true);
  } catch (e) {
    console.error("couldn't removeTweetQueue ", e);
    setStg('isMidStore', false);
  }
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
  return await tryFnsAsync(scrapeWorker.thFetch, thFetch, url, options);
};
const getAuth = async (_) => {
  return await getData('auth');
};

const calcAccsShown = (activeAccounts: ActiveAccsType): User[] =>
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
const genericSeek = async (query) => {
  // const isMidSearch = getStg('isMidSearch')
  // console.trace(`seek ${query}`);
  const { accsShown, filters } = await getSearchParams();
  console.time(`${query} genericSeek`);
  const searchResults = await searchWorker.seek(
    filters,
    accsShown,
    n_tweets_results,
    query
  );
  console.timeEnd(`${query} genericSeek`);
  return searchResults;
};
let isMidSearch = false;
const seek = async ({ query }) => {
  // if (await getStg('isMidSearch')) return [];
  // await setStg('isMidSearch', true);
  console.log('isMidSearch', { isMidSearch });
  if (isMidSearch) {
    return;
  }
  isMidSearch = true;
  setTimeout(() => (isMidSearch = false), 3000);
  const searchResults = await genericSeek(query);
  await setStg('search_results', searchResults).then((x) => {
    isMidSearch = false;
  });
  isMidSearch = false;
  // await setStg('isMidSearch', false);
  // return map(prop('id'), searchResults);
};

const contextualSeek = async ({ query }) => {
  const searchResults: SearchResult[] = await genericSeek(query);
  await setStg('context_results', searchResults);
  return map(R.path(['tweet', 'id']), searchResults);
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

const addBookmark = ({ ids }) => {
  enqueueStgNoDups('queue_lookupBookmark', ids);
};
const removeBookmark = ({ ids }) => {
  enqueueStgNoDups('queue_removeTweets', ids);
};
const deleteTweet = ({ ids }) => {
  enqueueStgNoDups('queue_removeTweets', ids);
};

const removeActiveAccount = async (id) => {
  const activeAccsStg = await modStg(
    'activeAccounts',
    R.pickBy(pipe(propEq('id_str', id), not))
  );
  const activeAccs = prop('activeAccounts', activeAccsStg);
  return activeAccs;
};
const removeAccountTweets = async (id) => {
  const db = await dbOpen();
  const filterByAccount = (id) => {
    return dbFilter<thTweet>(db, StoreName.tweets, propEq('account', id));
  };
  await pipe(
    () => filterByAccount(id),
    andThen(map(prop('id'))),
    andThen((ids) => enqueueTweetStg('queue_removeTweets', ids)) //uses the enque tweet function bc they both have id_str
  )();
  db.close();
  return;
};

const removeAccount = async ({ id }) => {
  // const removeAccount = async (id_str: string): Promise<any> => {
  //   db.delete('accounts', id_str);
  //   return db.getAll('accounts');
  // };
  const remainingAccounts = await removeActiveAccount(id);
  removeAccountTweets(id);
  console.log('removeAccount', { id, remainingAccounts });
  return remainingAccounts;
};

// const updateTimeline = ({}) => setStgFlag('doSmallTweetScrape', true);
const updateTimeline = ({}) => emitDoSmallScrape();
/* BG flow */
// Listen for auth and store it. simple.
//const webRequestPermitted$ = permissions$.thru(
const storageChange$ = makeStorageChangeObs();
const subWorkQueue = subWorkQueueStg(storageChange$);

const webRequestPermission$ = makeInitStgObs(
  storageChange$,
  'webRequestPermission'
);
webRequestPermission$.log('webRequestPermission$');
const auth$ = webRequestPermission$
  .filter((x) => x)
  .skipDuplicates()
  .flatMapLatest((_) => makeAuthObs())
  .skipDuplicates(compareAuths);
subObs({ auth$ }, setStg('auth'));
const _userInfo$ = auth$
  .thru<Observable<User, any>>(
    promiseStream(async (auth: Credentials) => {
      console.log('calling scrapeWorker.fetchUserInfo(auth)');
      let userInfo;
      return await tryFnsAsync(scrapeWorker.fetchUserInfo, fetchUserInfo, auth);
    })
  )
  .filter(pipe(isNil, not))
  .filter(pipe(prop('id'), isNil, not))
  .thru(errorFilter('_userInfo$'));
const userInfo$ = Kefir.merge([
  _userInfo$.skipDuplicates(),
  // _userInfo$.sampledBy(dataReset$),
]);
subObs({ userInfo$ }, setStg('userInfo'));
// subObs({ userInfo$ }, (_) => setStgFlag('doSmallTweetScrape', true));
subObs({ userInfo$ }, (_) => emitDoSmallScrape());
subObs({ userInfo$ }, async (userInfo) => {
  if (await shouldDoBigTweetScrape(userInfo)) emitDoBigScrape();
});

// a big scrape should be done if it's been more than a week
const shouldDoBigTweetScrape = async (acc: FullUser) => {
  const _lastGotTimeline: number = await getStgPath([
    'activeAccounts',
    acc.id_str,
    'lastGotTimeline',
  ]);
  const lastGotTimeline = defaultTo(0, _lastGotTimeline);
  const timeSince = Date.now() - lastGotTimeline;
  const aWeek = 1000 * 60 * 60 * 24 * 7;
  console.log('shouldDoBigTweetScrape', {
    acc,
    activeAcc: await getStgPath(['activeAccounts', acc.id_str]),
    timeSince,
    aWeek,
    lastGotTimeline,
    should: timeSince > aWeek,
  });
  return timeSince > aWeek;
};
const dressActiveAccount = pipe(
  assoc('lastGotTimeline', 0),
  assoc('showTweets', true)
);
const incomingAccount$ = userInfo$.map(dressActiveAccount).toProperty();
// Add to a list with no duplicates of the key (so no duplicates)
const addActiveAccount = curry(
  (_acc: User, activeAccounts: ActiveAccsType): ActiveAccsType => {
    const acc = R.has(prop('id_str', _acc), activeAccounts)
      ? _acc
      : dressActiveAccount(_acc);
    return R.set(R.lensProp(prop('id_str', acc)), acc, activeAccounts);
  }
);
const onIncomingAccount = async (acc: User) => {
  // if (!R.has('id_str', acc)) return; // it needs to have at least an id_str to be valid
  const oldAccs = await getStg('activeAccounts');
  console.log('[DEBUG] onIncomingAccount', { acc, oldAccs });
  await modStg('activeAccounts', addActiveAccount(acc));
  // if (await shouldDoBigTweetScrape(acc)) setStgFlag('doBigTweetScrape', true);
};
subObs({ incomingAccount$ }, onIncomingAccount);

// we need userinfo and auth to do these
// what does this do?
// this starts an observer once we have userInfo
// I think skipUntilBy does the same
const startRefreshIdb$ = makeInitStgObs(storageChange$, 'startRefreshIdb')
  .skipUntilBy(userInfo$)
  .filter((x) => x != false);

startRefreshIdb$.log('startRefreshIdb$');
subObs({ startRefreshIdb$ }, startRefreshIdb);

const doBigTweetScrape$ = Kefir.fromEvents(window, 'doBigTweetScrape');
subObs({ doBigTweetScrape$ }, doBigTweetScrape);

const doSmallTweetScrape$ = Kefir.fromEvents(window, 'doSmallTweetScrape');
subObs({ doSmallTweetScrape$ }, doSmallTweetScrape);

subWorkQueue('queue_lookupRefresh', doLookupRefreshAPI);
subWorkQueue('queue_lookupBookmark', doLookupBookmarkAPI);
subWorkQueue('queue_lookupTweets', doLookupAPI);
subWorkQueue('queue_addTweets', importTweetQueue);
subWorkQueue('queue_refreshTweets', refreshTweetQueue);
subWorkQueue('queue_removeTweets', removeTweetQueue);
subWorkQueue('queue_tempArchive', importArchive);
subWorkQueue('queue_addUsers', importUserQueue);
subWorkQueue('queue_removeUsers', removeUserQueue);

const doIndexUpdate$ = makeInitStgObs(storageChange$, 'doIndexUpdate').filter(
  (x) => x != false
);
subObs({ doIndexUpdate$ }, doIndexUpdate);

const indexUpdated$ = Kefir.fromEvents(window, 'indexUpdated');
subObs({ indexUpdated$ }, (_) => onIndexUpdated());

const query$ = makeInitStgObs(storageChange$, 'query');
const contextQuery$ = makeInitStgObs(storageChange$, 'contextQuery');
query$.log('query$');
contextQuery$.log('contextQuery$');
subObs({ query$ }, (query) => seek({ query }));
subObs({ contextQuery$ }, (query) => contextualSeek({ query }));

const isMidSearchTrue$ = makeInitStgObs(storageChange$, 'isMidSearch')
  .filter((x) => x != false)
  .delay(2000 * 5);
// just to make sure isMidSearch$ never gets stuck
subObs({ isMidSearchTrue$ }, () => setStg('isMidSearch', false));
const optionsChange$ = storageChange$.filter(propEq('itemName', 'options'));

const _makeInitOptionsObs = makeInitOptionsObs(optionsChange$);
const accounts$ = makeInitStgObs(storageChange$, 'activeAccounts').map(
  defaultTo([])
);
accounts$.log('accounts$');
const accsShown$ = (accounts$.map(
  filter(either(pipe(prop('showTweets'), isNil), propEq('showTweets', true)))
) as unknown) as Observable<User[], any>;
subObs({ accsShown$ }, async (_) => {
  getDefault(await getStg('idleMode'));
});
accsShown$.log('accsShown$');
/* Display options and Search filters */
const idleMode$ = _makeInitOptionsObs('idleMode') as Observable<IdleMode, any>;
idleMode$.log('idleMode$');
subObs({ idleMode$ }, getDefault);

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

  if (request.type != 'rpcBg' || !R.has('fnName', request)) {
    console.log('BG RPC: ignoring request', { request });
    sendResponse('not RPC');
    return;
  }
  let response = '';
  if (
    propEq('type', 'rpcBg') &&
    R.has('fnName', request) &&
    R.includes(request.fnName, keys(rpcFns))
  ) {
    try {
      response = await rpcFns[request.fnName](defaultTo({}, request.args));
      sendResponse(response);
    } catch (error) {
      response = 'RPC call failed';
      console.error(error);
      sendResponse(response);
    }
  } else {
    response = 'not RPC';
    console.error(`rpcBg no function ${request.fnName}`);
    sendResponse(response);
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
  // if (R.length(ports) <= 0 && !DEBUG) setStgFlag('doSmallTweetScrape', true);
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

async function onTabUpdated(
  tabId,
  change: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  try {
    // console.log(`[DEBUG] onTabUpdated, urls=`, {change, tab})
    if (change.status === 'complete' && tab.url && tab.url.match(twitter_url)) {
      chrome.browserAction.enable(tabId);
    } else {
      // chrome.browserAction.disable(tabId);
    }
  } catch (e) {
    // chrome.browserAction.disable(tabId);
    console.error(e);
  }
  if (change.status === 'complete' && tab.active && tab.url) {
    if (tab.url.match(twitter_url)) {
      addTtTab(tab.id);
      const msgCsRes = msgCS(tab.id, {
        type: 'tab-change-url',
        url: tab.url,
        cs_id: tab.id,
      });
      console.log('onTabUpdated msgCsRes', { msgCsRes });
    } else {
      remTtTab(tab.id);
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
  // fill in empty spots in local storage with default values
  softUpdateStorage();
  // delete old stg fields that are not in default
  const newStg = await cleanOldStorage();
  console.log('[INFO] onUpdated chrome.storage', newStg);
  // refresh idb tweets (lookup)
  if (!DEBUG && updateNeedRefresh(previousVersion)) {
    setStg('startRefreshIdb', true);
    setStg('showApiSearchTooltip', true);
  }
  // triggers patch notes
  setStg('patchUrl', choosePatchUrl(previousVersion));
  // remake index
};

if (!DEBUG) {
  chrome.runtime.setUninstallURL(uninstallUrl);
}

// chrome.runtime.onSuspend.addListener(function () {
//   console.log('[DEBUG] Unloading, suspending.');
//   chrome.browserAction.setBadgeText({ text: '' });
// });

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.tabs.onActivated.addListener(onTabActivated);
chrome.tabs.onUpdated.addListener(onTabUpdated);
chrome.tabs.onRemoved.addListener(onTabRemoved);
/* modular bg */

// const db = dbOpen();
// const stgObs$ = makeStorageChangeObs();
// stgObs$.onValue(nullFn);
