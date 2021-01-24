import '@babel/polyfill';
import Kefir, { Observable } from 'kefir';
import PromiseWorker from 'promise-worker';
import * as R from 'ramda';
import {
  and,
  andThen,
  any,
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
import { User } from 'twitter-d';
import { makeAuthObs } from './bg/auth';
import { apiToTweet, archToTweet, bookmarkToTweet } from './bg/tweetImporter';
import {
  fetchUserInfo,
  getBookmarks,
  searchAPI,
  timelineQuery,
  tweetLookupQuery,
  updateQuery,
} from './bg/twitterScout';
import { initWorker } from './bg/workerBoss';
import * as window from './global';
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
import { curProp } from './types/types';
import {
  apiBookmarkToTweet,
  clearTempArchive,
  combineOptions,
  compareAuths,
  getDateFormatted,
  makeInit,
  makeReqDefaultTweetsMsg,
  makeReqSearchMsg,
  msgSomeWorker,
  resetData,
  saferTweetMap,
  twitter_url,
  _makeOptionObs,
  _makeStgObs,
} from './utils/bgUtils';
import {
  getData,
  makeGotMsgObs,
  makeStorageChangeObs as makeStorageChangeObs,
  msgCS,
  removeData,
  setStg,
  updateStgPath,
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
toggleDebug(window, DEBUG);
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

// Potential functions to import

// Message builders
const makeSyncDisplayMsg = async (
  pWorker: PromiseWorker,
  getUsername: (arg0: any) => string,
  whenUpdated$
) => {
  const username = getUsername(1);
  // const n_tweets = await howManyTweetsDb(_db)
  const n_tweets = await msgSomeWorker(pWorker, { type: 'howManyTweetsDb' });
  const dateTime = await curVal(whenUpdated$);
  return `Hi ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`;
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
  const getUserInfo = (_: any): User => curVal(userInfo$);
  const getUsername = (_: any): string =>
    prop('screen_name', curVal(userInfo$));
  const getAccId = (_: any): string => prop('id_str', curVal(userInfo$));

  /* Define streams */

  /* Extension observers */
  /* Messages */
  const msg$ = makeGotMsgObs().map(prop('m')); // msg$ :: () -> msg // msg :: {type,...} // Listens to chrome runtime onMessage
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
  const accountsUpdate$ = Kefir.merge([removeAccount$, incomingAccounts$]); // both these are returns from worker requests to the db that contain the currently active accounts (accs in the db)

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
  const reqAddBookmark$ = msgStreamSafe('add-bookmark');

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
    .map(inspect('fetchedTimeline$'))
    .thru(promiseStream(([auth, userInfo]) => timelineQuery(auth, userInfo)))
    .thru(errorFilter('fetchedTimeline$'));

  const reqBookmarks$ = Kefir.merge([debugGetBookmarks$, initData$]); // asks for update on explicit req and on initData
  const fetchedBookmarks$ = auth$
    .sampledBy(reqBookmarks$)
    .thru(promiseStream((auth) => getBookmarks(auth)))
    .thru(errorFilter('fetchedBookmarks$'));

  const reqBookmarkId$ = reqAddBookmark$.map(pipe(prop('id'), (id) => [id]));
  const fetchedBookmark$ = reqBookmarkId$
    .combine(auth$, (ids, auth) => [ids, auth])
    .map(inspect('fetchedBookmark$'))
    .thru(promiseStream(([ids, auth]) => tweetLookupQuery(auth, ids)))
    .thru(errorFilter('fetchedBookmark$'));

  const anyAPIReq$ = Kefir.merge([
    reqUpdatedTweets$,
    reqBookmarks$,
    reqTimeline$,
    reqAddBookmark$,
  ]).map((_) => true); // flag

  /* Tweet API promise returns */
  const fetchedAnyAPIReq$ = Kefir.merge([
    fetchedUpdate$,
    fetchedTimeline$,
    fetchedBookmarks$,
    fetchedBookmark$,
  ]).thru(errorFilter('fetchedAnyAPIReq$'));

  /* User submitted tweets */
  const reqArchiveLoad$ = msgStreamSafe('temp-archive-stored'); // reqArchiveLoad$ :: msg
  const extractTweetPropIfNeeded = ifElse(
    prop('tweet'),
    prop('tweet'),
    (x) => x
  );
  const archiveLoadedTweets$ = reqArchiveLoad$
    .thru(
      promiseStream(
        pipe(
          (_) => getData('temp_archive'),
          andThen(map(extractTweetPropIfNeeded))
        )
      )
    )
    .thru(errorFilter('archiveLoadedTweets$'));
  const thUpdate$ = fetchedUpdate$.map(saferTweetMap(apiToTweet));
  //
  // const curAccount = pipe(_ => userInfo$, curVal, prop('id_str'));
  const assocAccount = (x) => pipe(assoc('account', getAccId(1)))(x);
  const thTweets$ = Kefir.merge([
    thUpdate$, //fetchedUpdate$.map(saferTweetMap(apiToTweet)),
    fetchedTimeline$.map(saferTweetMap(apiToTweet)),
    fetchedBookmarks$.map(saferTweetMap(bookmarkToTweet)),
    fetchedBookmark$.map(saferTweetMap(apiBookmarkToTweet)),
    archiveLoadedTweets$
      .combine(userInfo$, (tweets, userInfo) => [tweets, userInfo])
      .map(inspect('archiveLoadedTweets$'))
      .map(([tweets, userInfo]) =>
        saferTweetMap(archToTweet(userInfo, tweets))
      ),
  ])
    .filter(pipe(isEmpty, not))
    .map(map(assocAccount));

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
  ]).toProperty();
  const whenUpdated$ = anyTweetUpdate$
    .map((_) => getDateFormatted())
    .toProperty(getDateFormatted); // keeps track of when the last update to the tweet db was
  const updateSyncDisplay$ = Kefir.merge([ready$, anyTweetUpdate$]).map(
    (_) => true
  ); // triggers sync display update

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
    .toProperty() as curProp<string>; // const searchQuery$ = msgStream("search").map(prop('query')).toProperty(() => '');
  const emptyQuery$ = searchQuery$.map(trim).filter(isEmpty); //TODO: can't trim in cs bc I need the final space
  const wordSearchQuery$ = searchQuery$
    .filter(isWordEnd)
    .map(R.trim)
    .skipDuplicates();

  /*  Search and default reqs */
  const searchWorkerMsg$ = Kefir.combine(
    [searchMode$, searchFilters$, accsShown$, searchQuery$],
    makeReqSearchMsg
  ) as Observable<ReqSearchMsg, Error>;
  const reqFullTextSearch$ = Kefir.merge([
    searchWorkerMsg$.filter(pipe(prop('query'), isEmpty, not)),
    searchWorkerMsg$
      .sampledBy(anyTweetUpdate$)
      .filter(pipe(prop('query'), isEmpty, not)),
  ])
    .thru(waitFor(notReady$))
    .bufferWhileBy(searchMode$.map((mode) => !equals('fulltext', mode)))
    .map(last) as Observable<string, Error>;
  const reqSemanticSearch$ = wordSearchQuery$
    .thru(waitFor(notReady$))
    .bufferWhileBy(searchMode$.map((mode) => !equals('semantic', mode)))
    .map(last) as Observable<string, Error>;
  const fullTextSearchRes$ = searchWorkerMsg$
    .sampledBy(reqFullTextSearch$)
    .thru<Observable<TweetResWorkerMsg, any>>(
      promiseStream((msg) => pWorker.postMessage(msg))
    )
    .map(prop('res')); // searchResults$ :: [tweets]
  const semanticSearchRes$ = searchWorkerMsg$
    .sampledBy(reqSemanticSearch$)
    .thru<Observable<TweetResWorkerMsg, any>>(
      promiseStream((msg) => pWorker.postMessage(msg))
    )
    .map(prop('res')); // searchResults$ :: [tweets]
  // const searchResults$ = searchWorkerMsg$.sampledBy(reqSearch$).thru(promiseStream(msg => pWorker.postMessage(msg))).map(prop('res')); // searchResults$ :: [tweets]
  const emptyResults$ = emptyQuery$.map((_): TweetResult[] => []);
  const searchResults$ = Kefir.merge([
    fullTextSearchRes$,
    semanticSearchRes$,
    emptyResults$,
  ]);
  const filteredSearchResults$ = Kefir.combine(
    [searchFilters$, accsShown$, searchResults$],
    filterResults
  );

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
    .map(last); //.delay(100); //.last()
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
  ); // const filteredDefaultTweets$ = Kefir.merge([gotDefaultTweets$, gotDefaultTweets$.sampledBy(filters$)]).map(filter(x => validateSidebarTweet(getFilters(), getAccsShown())));

  /* api search */
  const apiQuery$ = msgStream('apiQuery')
    .map(prop('query'))
    .toProperty() as curProp<string>;
  // const apiQuery$ = makeStgItemObs('apiQuery') // const storageChange$ = makeStorageChangeObs();

  const apiReqRes$ = apiQuery$
    .filter((q) => !isEmpty(q))
    .map(inspect('apiReqRes$ 0'))
    .combine(auth$, (q, auth) => [q, auth])
    .map(inspect('apiReqRes$ 1'))
    .thru(promiseStream(([q, auth]) => searchAPI(auth, q)))
    .thru(errorFilter('fetchedUpdate$'));
  const apiRes$ = Kefir.merge([
    apiQuery$.filter(isEmpty).map((_) => []),
    apiReqRes$,
  ]);
  const thApiRes$ = apiRes$.map(saferTweetMap(apiToTweet)).map(
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
  subObs(
    { updateSyncDisplay$ },
    pipe(
      (_) => makeSyncDisplayMsg(pWorker, getUsername, whenUpdated$),
      andThen(setStg('syncDisplay'))
    )
  ); // update sync display
  subObs({ syncLight$ }, setStg('sync'));

  /* Worker actions */

  /* Import tweets */
  subObs({ fetchedBookmarks$ }, nullFn); // happens on requests to fetch all bookmarks
  subObs(
    { fetchedTimeline$ },
    pipe(
      when(checkGotTimeline, (_) =>
        updateStgPath(['hasTimeline', getAccId()], true)
      )
    )
  );
  subObs({ idsToRemove$ }, nullFn); // happens on a request to remove a tweet from DB
  subObs({ reqAddBookmark$ }, nullFn); // happens on requests to add a bookmark
  subObs({ archiveLoadedTweets$ }, (_) => removeData(['temp_archive'])); // happens after tweets are updated by worker, should only happen after loading archive
  /* Search */
  subObs({ searchFilters$ }, nullFn);
  subObs({ reqDefaultTweets$ }, nullFn);
  subObs({ filteredSearchResults$ }, pipe(setStg('search_results')));
  subObs({ filteredDefaultTweets$ }, pipe(setStg('latest_tweets')));
  subObs({ thApiRes$ }, pipe(setStg('api_results')));
  /* bg search */
  /* DB */
  subObs({ reqReset$ }, nullFn);
  /* searchQuery */
  /* Debug */
  subObs({ logAuth$ }, () => console.log(curVal(auth$)));
  subObs({ getUserInfo$ }, () => console.log(curVal(userInfo$)));

  ready$.log('[INFO] READY');
  csStart$.log('[INFO] csStart');
  msg$.log('[DEBUG] msg$');
  workerMsg$.log('[DEBUG] workerMsg$');
  workerConsole$.log('[INFO] workerConsole$');
  userInfo$.log('[DEBUG] userInfo$');
  userInfo$.log('[DEBUG] uniqueUserInfo$');
  notReady$.log('[DEBUG] notReady$');
  initData$.log('[DEBUG] initData$');
  idleMode$.log('[DEBUG] idleMode$');
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
  // updateSyncDisplay$.log('[DEBUG] updateSyncDisplay$');
  // notArchLoading$.log('[DEBUG] notArchLoading$');
  // notFetchingAPI$.log('[DEBUG] notFetchingAPI$');
  // notMidWorkerReq$.log('[DEBUG] notMidWorkerReq$');
  syncLight$.log('[DEBUG] syncLight$');
  reqDefaultTweets$.log('[DEBUG] reqDefaultTweets$');
  // csGaEvent$.log('[DEBUG] csGaEvent$');
  incomingAccounts$.log('[DEBUG] incomingAccounts$');
  // accounts$.log('[DEBUG] accounts$');
  // accsShown$.log('[DEBUG] accsShown$');
  // searchResults$.log('[DEBUG] searchResults$')
  // wMsgEvent$.log('wMsgEvent$')
  // workerMsg$.log('workerMsg$')
  workerReady$.log('[DEBUG] workerReady$');
  askWorkerReady$.log('askWorkerReady$');
  // searchQuery$.log('[DEBUG] searchQuery$')
  // emptyQuery$.log('emptyQuery$')
  // wordSearchQuery$.log('[DEBUG] wordSearchQuery$')
  // reqFullTextSearch$.log('reqFullTextSearch$')
  // reqSemanticSearch$.log('reqSemanticSearch$')
  // defaultsWorkerMsg$.log('[DEBUG] defaultsWorkerMsg$')
  // gotDefaultTweets$.log('[DEBUG] gotDefaultTweets$')
  // filteredDefaultTweets$.log('[DEBUG] filteredDefaultTweets$');
  // searchWorkerMsg$.log('[DEBUG] searchWorkerMsg$')
  // fullTextSearchRes$.log('[DEBUG] fullTextSearchRes$')
  // semanticSearchRes$.log('[DEBUG] semanticSearch$')
  apiQuery$.log('DEBUG] apiQuery$');
  // apiRes$.log('DEBUG] apiRes$');
  // thApiRes$.log('DEBUG] thApiRes$');
}

const onUpdated = (previousVersion) => {
  console.log(`[INFO] updated from version ${previousVersion}`);
};

const onFirstInstalled = (resetData, previousVersion, id) => {
  console.log(`[INFO] first install. Welcome to TH! ${previousVersion}`);
  resetData();
};

const onInstalled = curry(
  (resetData: () => void, reason: string, previousVersion: string, id) => {
    console.log('[DEBUG] onInstalled', { reason, previousVersion, id });
    switch (
      reason // "install", "update", "chrome_update", or "shared_module_update"
    ) {
      case 'update':
        onUpdated(previousVersion);
      case 'install':
        onFirstInstalled(resetData, previousVersion, id);
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
main();
//
