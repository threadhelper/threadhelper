import '@babel/polyfill';
import { WranggleRpc, BrowserExtensionTransport } from '@wranggle/rpc';
import Kefir, { Observable } from 'kefir';
import PromiseWorker from 'promise-worker';
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
import { makeAuthObs } from './bg/auth';
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
} from './utils/bgUtils';
import {
  cleanOldStorage,
  getData,
  getStg,
  makeGotMsgObs,
  makeStgItemObs,
  makeStorageChangeObs as makeStorageChangeObs,
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
// Analytics //IMPORTANT: this block must come before setting the currentValue for Kefir. Property and I have no idea why
(function initAnalytics() {
  initGA();
})();
PageView('/background.html');
// Project business
var DEBUG = process.env.NODE_ENV != 'production';
// toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;

// Stream clean up
const subscriptions: any[] = [];
const rememberSub = (sub) => {
  subscriptions.push(sub);
  return sub;
};
const subObs = (obsObj: any, effect: any) => {
  let obs = head(values(obsObj));
  let name = head(keys(obsObj));
  obs = obs.setName(name);
  rememberSub(obs.observe({ value: effect }));
};

export async function main() {
  const worker = initWorker();
  const pWorker = new PromiseWorker(worker); //promise worker

  /* Extension business */
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.runtime.onInstalled.addListener(onInstalled(() => resetData(pWorker)));
  chrome.tabs.onUpdated.addListener(onTabUpdated);

  /* Stream value getters */
  // const getAuthInit = (_: any): RequestInit => makeInit(curVal(auth$));
  const getUserInfo = (_: any): FullUser => curVal(userInfo$);
  const getAccId = (_: any): string => prop('id_str', curVal(userInfo$));

  /* Define streams */

  /* Extension observers */
  /* Messages */
  const msg$ = makeGotMsgObs().map(prop('m'));
  const csTabId$ = makeGotMsgObs().map(prop('s'));
  msg$.log('[DEBUG] msg$');
  const msgStream = makeMsgStream(msg$);
  const reqReset$ = msgStream('clear');
  const dataReset$ = reqReset$.thru<Observable<any, any>>(
    promiseStream((_) => resetData(pWorker))
  );

  const csStart$ = msg$
    .filter(propEq('type', 'cs-created'))
    .map((_) => true)
    .toProperty(() => false);
  const csNotReady$ = csStart$.map(not); // const csNotReady$ = toVal(false, csStart$)

  /* Analytics */
  const csGaEvent$ = (msgStream('gaEvent') as Observable<GaMsg, any>).map(
    prop('event')
  );
  const csGaException$ = (msgStream('gaException') as Observable<
    GaException,
    any
  >).map(prop('exception'));

  /* Storage */
  // const refreshIdb = async () => {
  //   const ids = await msgSomeWorker(pWorker, { type: 'resetIndex' });
  //   const auth = await getData('auth');
  //   const lookup = await tweetLookupQuery(auth, ids);
  //   const thLookup = map(apiToTweet, lookup);
  //   msgSomeWorker(pWorker, { type: 'doRefreshIdb' });
  // };
  const doRefreshIdb$ = await _makeStgObs('doRefreshIdb');
  doRefreshIdb$.log('doRefreshIdb$');
  const didRefreshIndex$ = doRefreshIdb$
    .filter((x) => x == true)
    .thru(promiseStream((_) => msgSomeWorker(pWorker, { type: 'resetIndex' })));
  didRefreshIndex$.onValue((_) => setStg('doRefreshIdb', false));
  didRefreshIndex$.log('didRefreshIndex$');
  // doRefreshIdb$.filter((x) => x == true).onValue(refreshIdb);

  const optionsChange$ = makeStorageChangeObs().filter(
    propEq('itemName', 'options')
  );
  const makeOptionObs = _makeOptionObs(optionsChange$); // const storageChange$ = makeStorageChangeObs();

  /* Display options and Search filters */
  const idleMode$ = (await makeOptionObs('idleMode')).map(
    prop('value')
  ) as Observable<IdleMode, any>;
  const searchMode$ = (await makeOptionObs('searchMode')).map(prop('value'));
  const searchFilters$ = Kefir.combine(
    [
      await makeOptionObs('getRTs'),
      await makeOptionObs('useBookmarks'),
      await makeOptionObs('useReplies'),
    ],
    combineOptions
  ).toProperty();

  /* Worker msgs */
  const wMsgEvent$ = Kefir.fromEvents<MessageEvent, any>(worker, 'message');
  const workerMsg$ = wMsgEvent$
    .filter(propSatisfies((x) => R.type(x) == 'String', 'data'))
    .map(prop('data'))
    .map((x: string) =>
      tryCatch(
        //trycatch is here bc firefox handles requests faster if they're completely stringified rather than partially but I haven't made sure that all workerMsgs are stringified, especially PromiseWorker ones
        (x: string) => JSON.parse(x) as WorkerMsg,
        (e) => {
          console.error('[ERROR] workerMsg$ Couldnt parse', { e, x });
          throw e;
        }
      )(x)
    )
    .ignoreErrors(); // msgs sent as stringified json
  // const pWorkerMsg$ = wMsgEvent$
  //   .filter(pathSatisfies((x) => R.type(x) == 'Object', ['data', 2]))
  //   .map(path(['data', 2])); // msgs from Promise Worker
  const workerReady$ = workerMsg$
    .filter(propEq('type', 'ready'))
    .map(R.T)
    .toProperty(R.F);
  const _workerReady = (_) => curVal(workerReady$);

  const askWorkerReady$ = Kefir.repeat((i) => {
    if (i < 5 && !_workerReady(1)) {
      console.log(`[DEBUG] asking isWorkerReady i=${i}`, {
        workerReady: _workerReady(1),
      });
      return Kefir.sequentially(2000, [i]);
    } else {
      return false;
    }
  });
  const workerConsole$ = workerMsg$.filter(propEq('type', 'console'));

  /* Auth */
  const auth$ = makeAuthObs().skipDuplicates(compareAuths).toProperty();
  auth$.log('[DEBUG] auth$');
  //
  /* User Info */
  const _userInfo$ = auth$
    // .map(makeInit)
    .map(inspect('_userInfo$'))
    .thru<Observable<User, any>>(
      promiseStream((auth: RequestInit) => fetchUserInfo(auth))
    )
    .filter(pipe(isNil, not))
    .filter(pipe(prop('id'), isNil, not))
    .thru(errorFilter('_userInfo$'));
  const userInfo$ = Kefir.merge([
    _userInfo$.skipDuplicates(),
    _userInfo$.sampledBy(dataReset$),
  ]).toProperty();
  /*   Ready, Sync */
  const haveUserInfo$ = userInfo$.map((x: User) => {
    return isNil(prop('id', x)) ? false : true;
  });
  const ready$ = Kefir.combine([workerReady$, haveUserInfo$], (...args) =>
    reduce(and, true, args)
  ).toProperty(R.F);
  const notReady$ = ready$.map(not);
  notReady$.log('notReady$');

  /* Utils */
  const msgStreamSafe = (name: string): Observable<Msg, any> =>
    msgStream(name).thru(waitFor(notReady$)); // msgStreamSafe :: String -> Stream msg

  /*  Accounts */

  /* write */
  const removeAccount$ = msgStream('remove-account')
    .map(prop('id'))
    .filter((id) => id != getAccId(1))
    .thru<Observable<any, any>>(
      promiseStream((id) =>
        msgSomeWorker(pWorker, { type: 'removeAccount', id })
      )
    );
  const incomingAccounts$ = userInfo$
    .thru(
      promiseStream((x) =>
        msgSomeWorker(pWorker, { type: 'addAccount', res: x })
      )
    )
    .map(list2Obj('id_str'))
    .toProperty();
  const accountsUpdate$ = Kefir.merge([removeAccount$, incomingAccounts$]).thru(
    errorFilter('accountsUpdate$')
  ); // both these are returns from worker requests to the db that contain the currently active accounts (accs in the db)
  accountsUpdate$.log('[DEBUG] accountsUpdate$');
  /* read */
  const accounts$ = (await _makeStgObs('activeAccounts')).map(defaultTo([]));
  const accsShown$ = (accounts$.map(
    pipe(
      // it's a search filter
      values,
      filter(
        either(pipe(prop('showTweets'), isNil), propEq('showTweets', true))
      )
    )
  ) as unknown) as Observable<User[], any>;

  const filters$ = Kefir.merge([
    searchFilters$,
    accsShown$.map(map(prop('id_str'))),
  ]); //just for sampling other things
  //
  const initData$ = Kefir.merge([
    csStart$,
    ready$.bufferWhileBy(csNotReady$).flatten(),
    dataReset$,
  ])
    .thru(waitFor(notReady$))
    .throttle(1000); // initData$ ::  // second term exists bc if csStart arrives before ready, then event won't fire

  /* Twitter API */
  const hasTimeline$ = (await _makeStgObs('hasTimeline')).map(
    pipe(prop(getAccId(1)), defaultTo(false))
  );
  const missingTimeline$ = hasTimeline$.map(not); // just a flag

  /* Tweet API reqs from CS */
  const debugGetBookmarks$ = msgStreamSafe('get-bookmarks');
  const updateRecentTimeline$ = msgStreamSafe('update-tweets');
  const updateTimeline$ = msgStreamSafe('update-timeline');

  /*  Tweet API  reqs to be made */
  const reqUpdatedTweets$ = Kefir.merge([
    updateRecentTimeline$,
    initData$.filterBy(hasTimeline$),
  ]); // asks for update on explicit req and on initData
  const fetchedUpdate$ = userInfo$
    .map(prop('screen_name'))
    .combine(auth$, (screen_name, auth) => [screen_name, auth])
    .sampledBy(reqUpdatedTweets$)
    .map(inspect('fetchedUpdate$'))
    .thru(
      promiseStream(([screen_name, auth]) =>
        updateQuery(auth, screen_name, update_size)
      )
    )
    .thru(errorFilter('fetchedUpdate$')); // const fetchedUpdate$ = promiseStream(reqUpdatedTweets$, _ => updateQuery(getAuthInit, getUsername(), update_size)).thru(errorFilter('fetchedUpdate$'));

  const reqTimeline$ = Kefir.merge([
    updateTimeline$,
    initData$.filterBy(missingTimeline$),
  ]); // asks for update on explicit req and on initData
  const fetchedTimeline$ = Kefir.combine(
    [auth$, userInfo$],
    (auth, userInfo) => [auth, userInfo]
  )
    .sampledBy(reqTimeline$)
    .thru(promiseStream(([auth, userInfo]) => timelineQuery(auth, userInfo)))
    .map(inspect('fetchedTimeline$'))
    .thru(errorFilter('fetchedTimeline$'));

  const reqBookmarks$ = Kefir.merge([debugGetBookmarks$, initData$]); // asks for update on explicit req and on initData
  const fetchedBookmarks$ = auth$
    .sampledBy(reqBookmarks$)
    .thru(promiseStream((auth) => getBookmarks(auth)))
    .thru(errorFilter('fetchedBookmarks$'));

  const reqAddBookmark$ = msgStreamSafe('add-bookmark');
  const fetchedBookmark$ = reqAddBookmark$
    .map(pipe(prop('id'), (id) => [id]))
    .combine(auth$, (ids, auth) => [ids, auth])
    .thru(promiseStream(([ids, auth]) => tweetLookupQuery(auth, ids)))
    .thru(errorFilter('fetchedBookmark$'));

  const reqLookup$ = Kefir.merge([
    didRefreshIndex$.thru(
      promiseStream((_) => msgSomeWorker(pWorker, { type: 'getAllIds' }))
    ),
  ]);
  const fetchedLookup$ = reqLookup$
    .combine(auth$, (ids, auth) => [ids, auth])
    .thru(promiseStream(([ids, auth]) => tweetLookupQuery(auth, ids)))
    .thru(errorFilter('fetchedLookup$'));
  fetchedLookup$.log('fetchedLookup$');

  const anyAPIReq$ = Kefir.merge([
    reqUpdatedTweets$,
    reqTimeline$,
    reqBookmarks$,
    reqAddBookmark$,
    reqLookup$,
  ]).map((_) => true); // flag

  /* Tweet API promise returns */
  const fetchedAnyAPIReq$ = Kefir.merge([
    fetchedUpdate$,
    fetchedTimeline$,
    fetchedBookmarks$,
    fetchedBookmark$,
    fetchedLookup$,
  ]).thru(errorFilter('fetchedAnyAPIReq$'));

  /* User submitted tweets */
  const reqArchiveLoad$ = msgStreamSafe('temp-archive-stored'); // reqArchiveLoad$ :: msg

  const archiveLoadedTweets$ = reqArchiveLoad$
    .thru(
      promiseStream(pipe((_) => getStg('temp_archive'), andThen(patchArchive)))
    )
    .thru(errorFilter('archiveLoadedTweets$'));
  //
  // const curAccount = pipe(_ => userInfo$, curVal, prop('id_str'));
  const assocAccount = (x) => {
    const _x = assoc('account', getAccId(1), x);
    return _x;
  };
  const thUpdate$ = fetchedUpdate$
    .map(saferTweetMap(apiToTweet))
    .filter(pipe(isEmpty, not))
    .map(map(assocAccount));

  const archivePatched$ = archiveLoadedTweets$
    .combine(userInfo$, (tempArchive, userInfo) => [tempArchive, userInfo])
    .combine(auth$, ([tempArchive, userInfo], auth) => [
      auth,
      tempArchive,
      userInfo,
    ])
    .thru(
      promiseStream(([auth, tempArchive, userInfo]) =>
        patchArchive(auth, userInfo, tempArchive)
      )
    );

  const thTweets$ = Kefir.merge([
    thUpdate$, //fetchedUpdate$.map(saferTweetMap(apiToTweet)),
    fetchedTimeline$.map(saferTweetMap(apiToTweet)),
    fetchedBookmarks$.map(saferTweetMap(bookmarkToTweet)),
    fetchedBookmark$.map(saferTweetMap(apiBookmarkToTweet)),
    fetchedLookup$.map(saferTweetMap(apiToTweet)),
    archivePatched$.map(saferTweetMap(archToTweet)),
    // archiveLoadedTweets$
    //   .combine(userInfo$, (tweets, userInfo) => [tweets, userInfo])
    //   .map(inspect('archiveLoadedTweets$'))
    //   .map(([tweets, userInfo]) =>
    //     saferTweetMap(archToTweet(userInfo, tweets))
    //   ),
  ])
    .filter(pipe(isEmpty, not))
    .map(map(assocAccount));
  // thTweets$.log('[DEBUG] thTweets$');

  /*  Local Tweet Processing */
  const reqDeleteTweet$ = msgStreamSafe('delete-tweet'); // reqDeleteTweet$ :: msg
  const reqRemoveBookmark$ = msgStreamSafe('remove-bookmark'); // reqRemoveBookmark$ :: msg
  const idsToRemove$ = Kefir.merge([reqDeleteTweet$, reqRemoveBookmark$]).map(
    prop('id')
  ); // idsToRemove$ :: id

  /* Worker returns */
  const addedTweets$ = thTweets$
    .thru(
      promiseStream((res) => msgSomeWorker(pWorker, { type: 'addTweets', res }))
    )
    .thru(errorFilter('addedTweets$'));
  const removedTweet$ = idsToRemove$
    .thru(
      promiseStream((id) =>
        msgSomeWorker(pWorker, { type: 'removeTweets', res: [id] })
      )
    )
    .thru(errorFilter('removedTweet$'));
  const updatedTimeline$ = thUpdate$
    .thru(
      promiseStream((res) =>
        msgSomeWorker(pWorker, { type: 'updateTimeline', res })
      )
    )
    .thru(errorFilter('updatedTimeline$'));
  // thUpdate$ gets added once more separately because update is the way we find deleted recent tweets
  const anyTweetUpdate$ = Kefir.merge([
    updatedTimeline$,
    addedTweets$,
    removedTweet$,
    dataReset$,
    accountsUpdate$.thru(
      promiseStream((_) => msgSomeWorker(pWorker, { type: 'howManyTweetsDb' }))
    ),
  ]).toProperty();

  const lastUpdated$ = anyTweetUpdate$
    .map((_) => getDateFormatted())
    .toProperty(getDateFormatted); // keeps track of when the last update to the tweet db was
  const nTweets$ = anyTweetUpdate$.map(prop('nTweets'));
  //
  /*  Sync */
  const anyWorkerReq$ = Kefir.merge([
    fetchedUpdate$,
    fetchedBookmarks$,
    fetchedTimeline$,
    reqRemoveBookmark$,
    idsToRemove$,
    reqArchiveLoad$,
  ]); // like with anyAPIReq$, these should only be emitted as the worker request is sent but oh well\
  const makeFlag = curry((def, stream0, stream1) =>
    Kefir.merge([toVal(false, stream0), toVal(true, stream1)])
      .map(defaultTo(def))
      .toProperty(() => def)
  );
  const makeFlagT = makeFlag(true);
  const notArchLoading$ = makeFlagT(reqArchiveLoad$, archiveLoadedTweets$);
  const notFetchingAPI$ = makeFlagT(anyAPIReq$, fetchedAnyAPIReq$);
  const notMidWorkerReq$ = makeFlagT(anyWorkerReq$, anyTweetUpdate$);
  const syncLight$ = streamAnd([
    notArchLoading$,
    notFetchingAPI$,
    notMidWorkerReq$,
    ready$,
  ])
    .map(defaultTo(false))
    .toProperty(F);

  const filterResults = (
    filters: SearchFilters,
    accs: User[],
    results: TweetResult[]
  ) =>
    R.filter(
      pipe((result) => makeValidateTweet(filters, accs)(prop('tweet', result))),
      results
    );

  /* Search query */
  const isWordEnd = pipe(last, R.match(/[^a-zA-Z0-9]/g), isEmpty, not); // true if it's not in the middle of a word
  const searchQuery$ = msgStream('search')
    .map(prop('query'))
    .toProperty(() => '') as curProp<string>;
  // searchQuery$.log('searchQuery$');
  const emptyQuery$ = searchQuery$.map(trim).filter(isEmpty); //TODO: can't trim in cs bc I need the final space
  const wordSearchQuery$ = searchQuery$
    .filter(isWordEnd)
    .map(R.trim)
    .skipDuplicates();
  //
  /*  Search and default reqs */
  const searchWorkerMsg$ = Kefir.combine(
    [searchMode$, searchFilters$, accsShown$, searchQuery$],
    makeReqSearchMsg
  ) as Observable<ReqSearchMsg, Error>;
  // searchWorkerMsg$.log('searchWorkerMsg$');
  const reqFullTextSearch$ = Kefir.merge([
    searchWorkerMsg$.filter(pipe(prop('query'), isEmpty, not)),
    searchWorkerMsg$
      .sampledBy(anyTweetUpdate$)
      .filter(pipe(prop('query'), isEmpty, not)),
  ])
    .thru(waitFor(notReady$))
    .bufferWhileBy(searchMode$.map((mode) => !equals('fulltext', mode)))
    .map(last) as Observable<string, Error>;
  // reqFullTextSearch$.log('reqFullTextSearch$');
  const fullTextSearchRes$ = reqFullTextSearch$ //searchWorkerMsg$
    // .sampledBy(reqFullTextSearch$)
    .map(inspect('fullTextSearchRes 0 '))
    .thru<Observable<TweetResWorkerMsg, any>>(
      promiseStream((msg) => pWorker.postMessage(msg))
    )
    .map(inspect('fullTextSearchRes 1 '))
    .map(prop('res')); // searchResults$ :: [tweets]
  // fullTextSearchRes$.log(`fullTextSearchRes$ 2`);

  const reqSemanticSearch$ = wordSearchQuery$
    .thru(waitFor(notReady$))
    .bufferWhileBy(searchMode$.map((mode) => !equals('semantic', mode)))
    .map(last) as Observable<string, Error>;
  const semanticSearchRes$ = searchWorkerMsg$
    .sampledBy(reqSemanticSearch$)
    .thru<Observable<TweetResWorkerMsg, any>>(
      promiseStream((msg) => pWorker.postMessage(msg))
    )
    .map(prop('res')); // searchResults$ :: [tweets]
  const emptyResults$ = emptyQuery$.map((_): TweetResult[] => []);
  const searchResults$ = Kefir.merge([
    fullTextSearchRes$,
    semanticSearchRes$,
    emptyResults$,
  ]);
  // searchResults$.log('searchResults$');
  const filteredSearchResults$ = Kefir.combine(
    [searchFilters$, accsShown$, searchResults$],
    filterResults
  );
  // filteredSearchResults$.log('filteredSearchResults$');
  subObs({ filteredSearchResults$ }, setStg('search_results'));

  /* Defaults */
  const defaultsWorkerMsg$ = Kefir.combine<ReqDefaultTweetsMsg>(
    [searchFilters$, idleMode$, accsShown$],
    makeReqDefaultTweetsMsg
  );
  const reqDefaultTweets$ = Kefir.merge([
    defaultsWorkerMsg$,
    defaultsWorkerMsg$.sampledBy(anyTweetUpdate$),
  ])
    .thru(waitFor(notReady$))
    .bufferWhileBy(notReady$)
    .map(last);
  const gotDefaultTweets$ = reqDefaultTweets$ // Search worker returns
    .thru<Observable<TweetResWorkerMsg, any>>(
      promiseStream((msg) => pWorker.postMessage(msg))
    )
    .map(prop('res')); // gotDefaultTweets$ :: [tweets]
  const defaultTweets$ = Kefir.merge([
    gotDefaultTweets$,
    gotDefaultTweets$.sampledBy(filters$),
  ]);

  const filteredDefaultTweets$ = Kefir.combine<TweetResult[]>(
    [searchFilters$, accsShown$, defaultTweets$],
    filterResults
  );
  // filteredDefaultTweets$.log('filteredDefaultTweets$');
  /* api search */
  const apiQuery$ = msgStream('apiQuery')
    .map(prop('query'))
    .toProperty() as curProp<string>;

  var usernameFilterRegex = /(from|to):([a-zA-Z0-9_]*\s?[a-zA-Z0-9_]*)$/;
  const makeUserQuery = (userQuery) => {
    var usernameMatch = userQuery.match(usernameFilterRegex);
    return usernameMatch ? usernameMatch[2] : userQuery;
  };

  // (debouncedQuery.match(/^\/(?!from|to)/) && !debouncedQuery.match(/(from|to)/))
  const apiReqUsers$ = apiQuery$
    .filter(
      (q) =>
        !(isEmpty(q) || (q.match(/^\/(?!from|to)/) && !q.match(/(from|to)/)))
    )
    .map(makeUserQuery)
    .combine(auth$, (q, auth) => [q, auth])
    .thru(promiseStream(([q, auth]) => searchUsers(auth, q)))
    .map(prop('users'))
    .thru(errorFilter('apiReqUsers$'));

  const apiUserRes$ = Kefir.merge([
    apiQuery$
      .filter(
        (q) =>
          isEmpty(q) || (q.match(/^\/(?!from|to)/) && !q.match(/(from|to)/))
      )
      .map((_) => []),
    apiReqUsers$,
  ]);
  apiUserRes$.log('apiUserRes$');

  const apiReqRes$ = apiQuery$
    .filter((q) => !isEmpty(q))
    .combine(auth$, (q, auth) => [q, auth])
    .thru(promiseStream(([q, auth]) => searchAPI(auth, q)))
    .thru(errorFilter('apiReqRes$'));

  const apiRes$ = Kefir.merge([
    apiQuery$.filter(isEmpty).map((_) => []),
    apiReqRes$,
  ]);
  const thApiRes$ = apiRes$.map(saferTweetMap(apiSearchToTweet)).map(
    map((tweet) => {
      return { tweet };
    })
  );
  const logAuth$ = msgStream('log-auth');
  const getUserInfo$ = msgStream('get-user-info');

  const checkGotTimeline = (timeline: string | any[]) =>
    timeline.length > 3000 ||
    timeline.length >= getUserInfo(1).statuses_count - 1;

  /*  Effects from streams */

  /* Ready / sync */
  subObs({ accountsUpdate$ }, setStg('activeAccounts'));
  subObs(
    { csGaEvent$ },
    pipe(values, (x) => Event(...x))
  );
  subObs(
    { csGaException$ },
    pipe(values, (x) => Exception(...x))
  );
  subObs({ askWorkerReady$ }, (_) =>
    msgSomeWorker(pWorker, { type: 'isWorkerReady' })
  );
  subObs({ auth$ }, setStg('auth'));
  subObs({ lastUpdated$ }, setStg('lastUpdated'));
  subObs({ nTweets$ }, setStg('nTweets'));
  subObs({ syncLight$ }, setStg('sync'));
  subObs(
    { screenName$: userInfo$.map(prop('screen_name')) },
    setStg('currentScreenName')
  );

  /* Worker actions */
  //
  /* Import tweets */
  subObs({ fetchedBookmarks$ }, nullFn); // happens on requests to fetch all bookmarks
  subObs(
    { fetchedTimeline$ },
    pipe(
      when(checkGotTimeline, (_) =>
        setStgPath(['hasTimeline', getAccId()], true)
      )
    )
  );
  subObs({ idsToRemove$ }, nullFn); // happens on a request to remove a tweet from DB
  subObs({ reqAddBookmark$ }, nullFn); // happens on requests to add a bookmark
  subObs({ archiveLoadedTweets$ }, (_) => removeData(['temp_archive'])); // happens after tweets are updated by worker, should only happen after loading archive
  /* Search */
  subObs({ searchFilters$ }, nullFn);
  subObs({ reqDefaultTweets$ }, nullFn);
  subObs({ filteredDefaultTweets$ }, setStg('latest_tweets'));
  subObs({ thApiRes$ }, setStg('api_results'));
  subObs({ apiUserRes$ }, setStg('api_users'));
  /* bg search */
  /* DB */
  subObs({ reqReset$ }, nullFn);
  /* searchQuery */
  /* Debug */
  subObs({ logAuth$ }, () => console.log(curVal(auth$)));
  subObs({ getUserInfo$ }, () => console.log(curVal(userInfo$)));

  ready$.log('[INFO] READY');
  csStart$.log('[INFO] csStart');
  workerConsole$.onValue(({ type, log, baggage }) =>
    console.log('[INFO] workerConsole$: ' + log, JSON.parse(baggage))
  );
  userInfo$.log('[DEBUG] userInfo$');
  notReady$.log('[DEBUG] notReady$');
  initData$.log('[DEBUG] initData$');
  // reqDefaultTweets$.log('[DEBUG] reqDefaultTweets$');

  // idleMode$.log('[DEBUG] idleMode$');
  // reqUpdatedTweets$.log('[DEBUG] reqUpdatedTweets$');
  // reqTimeline$.log('[DEBUG] reqTimeline$');
  // reqBookmarks$.log('[DEBUG] reqBookmarks$');
  // anyAPIReq$.log('[DEBUG] anyAPIReq$');
  // fetchedAnyAPIReq$.log('[DEBUG] fetchedAnyAPIReq$');
  // reqArchiveLoad$.log('[DEBUG] reqArchiveLoad$');
  // archiveLoadedTweets$.log('[DEBUG] archiveLoadedTweets$');
  // thTweets$.log('[DEBUG] thTweets$');
  // idsToRemove$.log('[DEBUG] idsToRemove$');
  // addedTweets$.log('[DEBUG] addedTweets$');
  // removedTweet$.log('[DEBUG] removedTweet$');
  // updatedTimeline$.log('[DEBUG] updatedTimeline$');
  // anyTweetUpdate$.log('[DEBUG] anyTweetUpdate$');
  // notArchLoading$.log('[DEBUG] notArchLoading$');
  // notFetchingAPI$.log('[DEBUG] notFetchingAPI$');
  // notMidWorkerReq$.log('[DEBUG] notMidWorkerReq$');
  // syncLight$.log('[DEBUG] syncLight$');
  // csGaEvent$.log('[DEBUG] csGaEvent$');
  //   incomingAccounts$.log('[DEBUG] incomingAccounts$');
  //   accounts$.log('[DEBUG] accounts$');
  //   accsShown$.log('[DEBUG] accsShown$');
  //   searchResults$.log('[DEBUG] searchResults$');
  //   workerReady$.log('[DEBUG] workerReady$');
  //   searchQuery$.log('[DEBUG] searchQuery$');
  //   emptyQuery$.log('emptyQuery$');
  //   reqFullTextSearch$.log('reqFullTextSearch$');
  //   fullTextSearchRes$.log('[DEBUG] fullTextSearchRes$');
  //   reqSemanticSearch$.log('reqSemanticSearch$');
  //   semanticSearchRes$.log('[DEBUG] semanticSearch$');
  //   defaultsWorkerMsg$.log('[DEBUG] defaultsWorkerMsg$');
  //   gotDefaultTweets$.log('[DEBUG] gotDefaultTweets$');
  //   filteredDefaultTweets$.log('[DEBUG] filteredDefaultTweets$');
  //   searchWorkerMsg$.log('[DEBUG] searchWorkerMsg$');
  //   apiRes$.log('DEBUG] apiRes$');
}

const onUpdated = async (previousVersion) => {
  console.log(`[INFO] updated from version ${previousVersion}`);
  // add new stg fields from defaults
  if (!DEBUG) {
    chrome.tabs.create({
      url: 'https://www.notion.so/Patch-Notes-afab29148a0c49358df0e55131978d48',
    });
  }
  // msgSomeWorker(pWorker, { type: 'resetIndex' });
  updateStorage();
  // delete old stg fields that are not in default
  cleanOldStorage();
  // refresh idb tweets (lookup)
  setStg('doRefreshIdb', true);
  // remake index
};

const onFirstInstalled = async (resetData, previousVersion, id) => {
  console.log(`[INFO] first install. Welcome to TH! ${previousVersion}`);
  if (!DEBUG) {
    const welcomeUrl =
      'https://www.notion.so/Welcome-e7c1b2b8d8064a80bdf5600c329b370d';
    chrome.tabs.create({ url: welcomeUrl });
  }
  resetData();
};
//
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
    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //   chrome.declarativeContent.onPageChanged.addRules([
    //     {conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: { urlContains: "twitter.com" }})],
    //       actions: [new chrome.declarativeContent.ShowPageAction()]}]);});
    // chrome.pageAction.show(tabId);
    // chrome.pageAction.hide(tabId);
  }
);
// TODO emit to active tab
function onTabActivated(activeInfo: { tabId: any }) {
  chrome.tabs.get(activeInfo.tabId, function (tab: chrome.tabs.Tab) {
    if (tab.url != null) {
      try {
        if (tab.url.match(twitter_url)) {
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
}
// function onTabUpdated(tabId, change: {status: string; url: string;}, tab: {url: string; active: any; id: any;}) {
function onTabUpdated(
  tabId,
  change: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  try {
    // console.log(`[DEBUG] onTabUpdated`, {change, tab})
    if (change.status === 'complete' && tab.url.match(twitter_url)) {
      chrome.browserAction.disable(tabId);
    } else {
      chrome.browserAction.enable(tabId);
    }
  } catch (e) {
    chrome.browserAction.disable(tabId);
  }
  if (tab.active && change.url) {
    if (change.url.match(twitter_url)) {
      msgCS(tab.id, { type: 'tab-change-url', url: change.url, cs_id: tab.id });
    }
  }
}

const fetchBg = async ({ url, options }) => {
  return await thFetch(url, options);
};
const getAuth = async (_) => {
  return await getData('auth');
};
var rpcBgFns = {
  fetchBg,
  getAuth,
};
import 'chrome-extension-async';
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

  if (request.type != 'rpcBg') return;
  // if (R.includes(request.fnName, keys(rpcBgFns))) {
  //   try {
  //     sendResponse(rpcBgFns[request.fnName](request.args));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // } else {
  //   console.error(`bgRpc no function ${request.fnName}`);
  // }
  if (request.fnName == 'fetchBg') {
    const resP = thFetch(request.args.url, request.args.options);
    console.log({ resP });
    const res = await resP;
    sendResponse(res);
  }
  if (request.fnName == 'getAuth') {
    const auth = await getData('auth');
    console.log({ auth });
    sendResponse(auth);
  }
  return true;
});

// function logURL(requestDetails) {
//   console.log('Loading: ' + requestDetails.url);
// }
// chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: ['<all_urls>'] });

// Talking to cs RPC
// const fetchBg = async (url) => {
//   console.log('fetchBg in bg', { url });
//   return 'goodbye';
// };
// const bgOpts = {
//   // permitMessage: (payload, sender) => true,
//   // forTabId: 230,
// };
// const extTransport = new BrowserExtensionTransport(bgOpts);
// const bgRpc = new WranggleRpc({
//   transport: extTransport,
//   channel: 'bgFetch1',
//   debug: true,
// });
// bgRpc.addRequestHandler('fetchBg', fetchBg);

main();
//
var settingUrl = chrome.runtime.setUninstallURL(
  'https://docs.google.com/forms/d/e/1FAIpQLSf2s5y8tIFEQj4dIyk55QXS0DQmHQ_cmspmJmKNTslISOJ6oA/viewform'
);
