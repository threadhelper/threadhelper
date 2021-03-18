// only for development with `npm run serve`, to take advantage of HMR
import '@babel/polyfill';
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
import { genericLoopRetry } from './bg/twitterScout';
import { makeAuthObs } from './bg/auth';
import {
  apiSearchToTweet,
  apiToTweet,
  archToTweet,
  bookmarkToTweet,
} from './bg/tweetImporter';
import { loadIndexFromIdb, updateIdxFromIdb } from './dev/storage/devStgUtils';
import window from './global';
import { StoreName } from './types/dbTypes';
import { IdleMode, SearchFilters } from './types/stgTypes';
import { thTweet } from './types/tweetTypes';
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
  enqueueStgNoDups,
  enqueueTweetStg,
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
  promiseStream,
  toggleDebug,
} from './utils/putils';
import { dbFilter, dbOpen } from './worker/idb_wrapper';
import { getLatestTweets, getRandomSampleTweets } from './worker/search';

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

const isQueueBusy = async (name) => {
  const wQ = await getStg(name + '_work_queue');
  console.log('isQueueBusy', { wQ });
  return isExist(wQ);
};

const maybeDq = async (name) => {
  const busy = await isQueueBusy(name);
  if (!busy) {
    console.log('[DEBUG] dq', { name });
    dequeue4WorkStg(name, queue_load);
    return true;
  } else {
    console.log('[DEBUG] dq: queue busy ', { name });
    return false;
  }
  // dequeue4WorkStg(name, R.length(defaultTo([], queue)));
};
const subWorkQueue = (name, workFn) => {
  const queue$ = makeInitStgObs(name).filter(isExist);
  queue$.log(name + '$');
  subObs({ [name + '$']: queue$ }, async (q) => {
    const didDq = await maybeDq(name);
    const qLen = R.length(q);
    const newQLen = didDq ? (queue_load > qLen ? 0 : qLen - queue_load) : qLen;
    setStg(name + '_length', newQLen);
  });
  const workQueue$ = makeInitStgObs(name + '_work_queue').filter(
    pipe(isNil, not)
  );
  workQueue$.log(name + '_work_queue' + '$');
  const _workFn = async (queue) => {
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
      maybeDq(name);
    }
  };
  subObs({ [name + '_work_queue' + '$']: workQueue$ }, _workFn);
};

const emitEvent = (name) => {
  window.dispatchEvent(new CustomEvent(name));
};
const emitIndexUpdated = () => emitEvent('indexUpdated');
const emitDoBigScrape = () => emitEvent('doBigTweetScrape');
const emitDoSmallScrape = () => emitEvent('doSmallTweetScrape');

/* TODO: Functions to move out of this file */
// Scraping functions

var usernameFilterRegex = /(from|to):([a-zA-Z0-9_]*\s?[a-zA-Z0-9_]*)$/;
const makeUserQuery = (userQuery) => {
  var usernameMatch = userQuery.match(usernameFilterRegex);
  return usernameMatch ? usernameMatch[2] : userQuery;
};

const doRefreshIdb = async () => {
  console.log('[DEBUG] doRefreshIdb');
  await idbWorker.resetIndex();
  const ids = await idbWorker.getAllIds('tweets');
  enqueueStgNoDups('queue_lookupRefresh', ids);
  // setStg('doIndexUpdate', true);
};

const loopRetryScrape = genericLoopRetry(3, 1000);
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
  const updateTweets = await scrapeWorker.updateQuery(
    auth,
    userInfo,
    update_size
  );
  const thUpdateTweets = toTh(updateTweets);
  return thUpdateTweets;
};

const credsAndRetry = (fn, userInfo) =>
  loopRetryScrape(async () => {
    const auth = await getStg('auth');
    return fn(auth, userInfo);
  });

const doBigTweetScrape = async (_) => {
  try {
    const [auth, userInfo] = await Promise.all([
      getStg('auth'),
      getStg('userInfo'),
    ]);
    setStg('isMidScrape', true);
    const [timeline, bookmarks] = await Promise.all([
      credsAndRetry(doTimelineScrape, userInfo),
      credsAndRetry(doBookmarkScrape, userInfo),
    ]);
    // const timeline = await doTimelineScrape(auth, userInfo);
    // const bookmarks = await doBookmarkScrape(auth, userInfo);
    const toAdd = R.concat(timeline, bookmarks);
    enqueueTweetStg('queue_addTweets', toAdd);
    // setStg('doBigTweetScrape', false);
    await setStgPath(
      ['activeAccounts', userInfo.id_str, 'lastGotTimeline'],
      Date.now()
    );
    await setStgPath(
      ['activeAccounts', userInfo.id_str, 'lastGotTimelineCount'],
      R.length(timeline)
    );
    setStg('isMidScrape', false);
  } catch (e) {
    console.error('doBigTweetScrape failed', { e });
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

    const [timeline, bookmarks] = await Promise.all([
      credsAndRetry(doTimelineUpdateScrape, userInfo),
      credsAndRetry(doBookmarkScrape, userInfo),
    ]);
    // const timeline = await doTimelineUpdateScrape(auth, userInfo);
    // const bookmarks = await doBookmarkScrape(auth, userInfo);
    const toAdd = R.concat(timeline, bookmarks);
    enqueueTweetStg('queue_addTweets', toAdd);
    // setStg('doSmallTweetScrape', false);
    setStg('isMidScrape', false);
  } catch (e) {
    console.error('doSmallTweetScrape failed', { e });
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
      const lookupTweets = await scrapeWorker.tweetLookupQuery(auth, ids);
      const thLookupTweets = toTh(lookupTweets);
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
    const patchedArchive = await scrapeWorker.patchArchive(
      auth,
      userInfo,
      queue
    );
    const toTh = saferTweetMap(archToTweet);
    const thArchiveTweets = toTh(patchedArchive);
    enqueueTweetStg('queue_addTweets', thArchiveTweets);
    setStg('isMidScrape', false);
  } catch (e) {
    console.error("couldn't importArchive ", e);
    setStg('isMidScrape', false);
  }
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
  setStg('doRefreshIdb', false);
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
  const usersRes = await scrapeWorker.searchUsers(auth, query);
  const users = prop('users', usersRes);
  console.log('doUserSearch', { usersRes, users });
  setStg('api_users', users);
  return users;
};

const doSearchApi = async ({ query }) => {
  if (isEmpty(query)) {
    setStg('api_results', []);
    return [];
  }
  const auth = await getStg('auth');
  const apiResults = await scrapeWorker.searchAPI(auth, query);
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
    promiseStream((auth: Credentials) => scrapeWorker.fetchUserInfo(auth))
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

const onIncomingAccount = async (acc: User) => {
  // if (!R.has('id_str', acc)) return; // it needs to have at least an id_str to be valid
  const oldAccs = await getStg('activeAccounts');
  console.log('[DEBUG] onIncomingAccount', { acc, oldAccs });
  await modStg('activeAccounts', (olds) =>
    R.set(R.lensProp(prop('id_str', acc)), acc, olds)
  );
  // if (await shouldDoBigTweetScrape(acc)) setStgFlag('doBigTweetScrape', true);
};
subObs({ incomingAccount$ }, onIncomingAccount);

// we need userinfo and auth to do these
const doRefreshIdb$ = userInfo$
  .take(1)
  .flatMapLatest((_) => makeInitStgObs('doRefreshIdb'))
  .filter((x) => x);
doRefreshIdb$.log('doRefreshIdb$');
subObs({ doRefreshIdb$ }, doRefreshIdb);

// const doBigTweetScrape$ = userInfo$
//   .take(1)
//   .flatMapLatest((_) => makeInitStgObs('doBigTweetScrape'))
//   .filter((x) => x)
//   .throttle(500);
const doBigTweetScrape$ = Kefir.fromEvents(window, 'doBigTweetScrape');
subObs({ doBigTweetScrape$ }, doBigTweetScrape);

// const doSmallTweetScrape$ = userInfo$
// .take(1)
// .flatMapLatest((_) => makeInitStgObs('doSmallTweetScrape'))
// .filter((x) => x)
// .throttle(500);
const doSmallTweetScrape$ = Kefir.fromEvents(window, 'doSmallTweetScrape');
subObs({ doSmallTweetScrape$ }, doSmallTweetScrape);

subWorkQueue('queue_lookupRefresh', doLookupRefreshAPI);
subWorkQueue('queue_lookupBookmark', doLookupBookmarkAPI);
subWorkQueue('queue_lookupTweets', doLookupAPI);
subWorkQueue('queue_addTweets', importTweetQueue);
subWorkQueue('queue_refreshTweets', refreshTweetQueue);
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
const accsShown$ = accounts$.map(
  filter(either(pipe(prop('showTweets'), isNil), propEq('showTweets', true)))
) as unknown) as Observable<User[], any>;
subObs({ accsShown$ }, (_) => getDefault());
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

  if (request.type != 'rpcBg' || !R.has('fnName', request)) {
    console.log('BG RPC: ignoring request', { request });
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
      sendResponse(response);
    }
  } else {
    response = 'not RPC';
    console.error(`bgRpc no function ${request.fnName}`);
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
  if (!DEBUG) {
    chrome.tabs.create({
      url:
        'https://www.notion.so/v0-3-Patch-Notes-ThreadHelper-afab29148a0c49358df0e55131978d48',
    });
  }
  // fill in empty spots in local storage with default values
  softUpdateStorage();
  // delete old stg fields that are not in default
  const newStg = await cleanOldStorage();
  console.log('[INFO] onUpdated chrome.storage', newStg);
  // refresh idb tweets (lookup)
  if (!DEBUG) setStg('doRefreshIdb', true);
  // triggers patch notes
  setStg('showPatchNotes', true);
  // remake index
};

if (!DEBUG) {
  chrome.runtime.setUninstallURL(
    'https://docs.google.com/forms/d/e/1FAIpQLSf2s5y8tIFEQj4dIyk55QXS0DQmHQ_cmspmJmKNTslISOJ6oA/viewform'
  );
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
