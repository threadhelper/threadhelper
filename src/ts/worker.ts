import '@babel/polyfill';
import * as elasticlunr from 'elasticlunr';
import Kefir, { Subscription } from 'kefir';
import {
  andThen,
  apply,
  assoc,
  both,
  curry,
  filter,
  ifElse,
  includes,
  isEmpty,
  isNil,
  keys,
  last,
  map,
  not,
  path,
  pathEq,
  pipe,
  Pred,
  prop,
  propEq,
  propSatisfies,
  reduce,
  tap,
  tryCatch,
  type,
  __,
} from 'ramda'; // Function
import { User } from 'twitter-d';
import { findInnerDiff } from './bg/tweetImporter';
import {
  IndexSearchResult,
  ReqDefaultTweetsMsg,
  ReqSearchMsg,
  SearchResult,
  TweetResWorkerMsg,
  WorkerMsg,
  WriteAccMsg,
} from './types/msgTypes';
import { SearchFilters } from './types/stgTypes';
import { IndexTweet, thTweet, TweetId } from './types/tweetTypes';
import {
  currentValue,
  isExist,
  nullFn,
  wInspect,
  inspect,
  wTimeFn,
} from './utils/putils';
import * as db from './worker/idb_wrapper';
import { loadIndex, makeIndex, search, updateIndex } from './worker/nlp';
import { onWorkerPromise } from './worker/promise-stream-worker';
import { getLatestTweets, getRandomSampleTweets } from './worker/search';
import { doSemanticSearch, reqSemIndexTweets } from './worker/semantic';

const wSelf: Worker = self as any;
// Project business
// var DEBUG = process.env.NODE_ENV != 'production';
// toggleDebug(null, DEBUG);
// toggleDebug(wSelf, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;
// Stream clean up
const subscriptions: Subscription[] = [];
const rememberSub = (sub) => {
  subscriptions.push(sub);
  return sub;
};
const subObs = (obs, effect: (arg0: any) => void) =>
  rememberSub(obs.observe({ value: effect })); // subscribe to an observer
const subReq = (obs, effect) => subObs(obs, onWorkerPromise(effect)); // subscribe to an observer and return the result of the function to main as a promise
// Utils
const msgBG = function (msg: WorkerMsg) {
  return wSelf.postMessage(JSON.stringify(msg));
}; // different from cs's msgBG
const consoleLog = curry((log: string, baggage: any): void =>
  msgBG({
    type: 'console',
    log,
    baggage: JSON.stringify(type(baggage) == 'Object' ? baggage : { baggage }),
  })
);
const timeFn = wTimeFn(consoleLog);
// const inspect = wInspect(consoleLog);
const makeMidSearchEvent = (_busy: boolean) => {
  return new CustomEvent('midSearch', { detail: { busy: _busy } });
};
const emitMidSearch = (busy: boolean) => {
  wSelf.dispatchEvent(makeMidSearchEvent(busy));
  return busy;
};
// // Sync
const dbDel = (
  _getDb: (arg0: number) => any,
  storeName: string,
  deleted_ids: any[]
) => {
  db.dbDelMany(_getDb(1))(storeName, deleted_ids);
};
// Functions, potential imports
const updateSomeDB = curry(
  async (_getDb: (arg0: number) => any, new_tweets, deleted_ids) => {
    const storeName = 'tweets';
    isExist(deleted_ids) ? dbDel(_getDb, storeName, deleted_ids) : null;
    isExist(new_tweets) ? db.dbPutMany(_getDb(1))(storeName, new_tweets) : null;
    return new_tweets;
  }
);
const initIndex = async () =>
  pipe(
    (_) => getDb(1).getAll('tweets'),
    andThen(updateIndex(makeIndex(), __, []))
  )(1);
const getIndexFromDb = () => getDb(1).get('misc', 'index');
//
consoleLog('worker hi! 0', '');
// throw Error('[DEBUG] [ERROR] worker debug error')
// Streams
// Db init
const db$ = Kefir.fromPromise(db.dbOpen()).ignoreEnd().toProperty();
const noDb$ = db$.map(isNil);
// Messages
const msg$ = Kefir.fromEvents(wSelf, 'message');
msg$.map(prop('data')).log('msg$');
const makeMsgStream = (typeName: string) =>
  msg$
    .filter(pathEq(['data', 1, 'type'], typeName))
    .bufferWhileBy(noDb$)
    .flatten(); //.map(prop('data')) // Function
// index init
const resetIndex$ = makeMsgStream('resetIndex');
resetIndex$.onValue(consoleLog('resetIndex$'));
const index$ = Kefir.merge([db$, resetIndex$])
  .flatMapFirst((_) =>
    Kefir.fromPromise(
      pipe(
        getIndexFromDb,
        andThen(ifElse(isNil, (_) => initIndex(), loadIndex))
      )(1)
    )
  )
  .ignoreEnd()
  .toProperty();
const noIndex$ = index$.map(isNil);
//
// DB
const dbClear$ = makeMsgStream('dbClear');
const howManyTweetsDb$ = makeMsgStream('howManyTweetsDb');
// Account updating
const addAccount$ = makeMsgStream('addAccount'); //.map(prop('res'))
// addAccount$.log('addAccount$');
const removeAccount$ = makeMsgStream('removeAccount'); //.map(prop('res'))
// User updating
const addUser$ = makeMsgStream('addUser');
const removeUser$ = makeMsgStream('removeUser');
// Index Updating
const updateTimeline$ = makeMsgStream('updateTimeline');
const addTweets$ = makeMsgStream('addTweets');
const removeTweets$ = makeMsgStream('removeTweets');
// Index reading
const makeSearchStream = (mode: string) =>
  msg$
    .filter(pathEq(['data', 1, 'searchMode'], mode))
    .bufferWhileBy(noDb$, { flushOnChange: true })
    .flatten() //.map(prop('data')) // Function
    .filter((x) => !isNil(x));
const isMidSearch$ = Kefir.fromEvents(wSelf, 'midSearch')
  .map(
    path<boolean>(['detail', 'busy'])
  )
  .toProperty(() => false);
isMidSearch$.log('isMidSearch$');
const _searchReq$ = makeMsgStream('searchIndex')
  .bufferWhileBy(isMidSearch$)
  .flatten();
const searchReq$ = _searchReq$.bufferWhileBy(noIndex$).map(last);
const ftSearchReq$ = makeSearchStream('fulltext')
  .bufferWhileBy(isMidSearch$, { flushOnChange: true })
  .flatten()
  .bufferWhileBy(noIndex$, { flushOnChange: true })
  .map(last)
  .filter((x) => !isNil(x));
ftSearchReq$.log('ftSearchReq$');
// const semSearchReq$ = searchReq$.filter(pathEq(['data', 1, 'searchMode'], 'semantic'))
const semSearchReq$ = makeSearchStream('semantic')
  .bufferWhileBy(isMidSearch$, { flushOnChange: true })
  .flatten()
  .bufferWhileBy(noIndex$, { flushOnChange: true })
  .map(last)
  .filter((x) => !isNil(x));
const getDefaultTweets$ = makeMsgStream('getDefaultTweets');
// Sync
const ready$ = Kefir.merge([
  index$.filter(pipe(isNil, not)),
  makeMsgStream('isWorkerReady'),
]).map((_) => true);
// Functions, potential imports
const curVal = (stream) => stream.currentValue();
const getDb = (_: any) => curVal(db$);
const updateDB = updateSomeDB(getDb);
const getIndex = () => curVal(index$);
const getAllIds = async (storeName: string) =>
  await getDb(1).getAllKeys(storeName); // getAllIds :: () -> [ids]
const howManyTweetsDb = async (_) => (await getAllIds('tweets')).length;
const onHowManyTweetsDb = async (_) => {
  return { type: 'nTweets', nTweets: await howManyTweetsDb() };
};
const getAllAccounts = async (_: Promise<any>) => getDb(1).getAll('accounts');
const addAccount = async (user_info: User): Promise<any> =>
  getDb(1).put('accounts', user_info);
const onAddAccount = pipe<WriteAccMsg, User, Promise<any>, Promise<User[]>>(
  prop('res'),
  addAccount,
  andThen((_) => getAllAccounts(_))
);
const removeAccount = async (id_str: string): Promise<any> =>
  getDb(1).delete('accounts', id_str);
const onRemoveAccount = async (id: string) =>
  pipe(
    () => id,
    tap(removeAccount),
    inspect('OnRemoveAccount 0'),
    (id) => db.dbFilter(getDb(1), 'tweets', propEq('account', id)),
    andThen(inspect('OnRemoveAccount 1')),
    andThen(map(prop('id'))),
    andThen(inspect('OnRemoveAccount 2')),
    andThen((ids) => updateDB([], ids)),
    andThen(inspect('OnRemoveAccount 3')),
    andThen((_) => getAllAccounts(_))
  )();
const onAddUser = async (user_info) => getDb(1).put('users', user_info);
const onRemoveUser = async (id_str) => getDb(1).delete('users', id_str);

const updateSemanticIndex = async (olds, new_tweets) =>
  pipe<thTweet[], Promise<thTweet[]>, Promise<any>, Promise<any>>(
    () => new_tweets,
    findNewTweets(olds),
    andThen(
      ifElse(
        isEmpty,
        () => {
          info: 'no new tweets';
        },
        reqSemIndexTweets
      )
    ),
    andThen(inspect('[INFO] reqSemIndexTweets'))
  )();

const updateIndexAndStore = async (index, new_tweets, deleted_ids) =>
  pipe(
    (index, tweets_to_add, ids_to_remove) =>
      updateIndex(index, tweets_to_add, ids_to_remove),
    andThen((index) => index.toJSON()),
    andThen((index_json) => getDb(1).put('misc', index_json, 'index'))
  )(index, new_tweets, deleted_ids);

const _updateIndex = async (
  index: elasticlunr.Index<IndexTweet>,
  new_tweets: thTweet[],
  deleted_ids: string[]
) => {
  const olds = await getAllIds('tweets');
  updateSemanticIndex(olds, new_tweets);
  const newIndex = await updateIndexAndStore(index, new_tweets, deleted_ids);
  return newIndex;
};
const isBookmark = (res) => path([0, 'is_bookmark'], res); // checks whether the first is a bookmark to judge whether they're all bookmarks
const curAccount = (res) => path([0, 'account'], res); // checks whether the first is a bookmark to judge whether they're all bookmarks
const filterCondition = (res: readonly Record<'id', unknown>[]) =>
  both(
    propEq('is_bookmark', path([0, 'is_bookmark'], res)),
    propEq('account', path([0, 'account'], res))
  );
const findDeletedIds = async (oldIds, res: thTweet[]): Promise<any> => {
  const onErrorFindingDeletedIds = (e) => {
    console.log('ERROR [findDeletedIds]', { e, oldIds, res });
    return [];
  };
  return pipe(
    map(prop('id')),
    tryCatch(findInnerDiff(oldIds), onErrorFindingDeletedIds)
  )(res);
};
const findNewTweets = curry(
  async (oldIds: string[], res: thTweet[]): Promise<thTweet[]> =>
    pipe(
      // map(prop('id')),
      // difference(__, oldIds),
      filter(propSatisfies((id) => !includes(id, oldIds), 'id'))
    )(res)
);

const getRelevantOldIds = async (filterFn: Pred): Promise<string[]> =>
  pipe(
    () => db.dbFilter(getDb(1), 'tweets', filterFn),
    andThen(map(prop('id')))
  )();

const updateTimeline = async (res: thTweet[]) => {
  consoleLog('updateTimeline 0', { res });
  const oldIds = await getRelevantOldIds(filterCondition(res));
  consoleLog('updateTimeline 0', { oldIds });
  const newTweets = await findNewTweets(oldIds, res);
  consoleLog('updateTimeline 2', { newTweets });
  const deletedIds = await findDeletedIds(oldIds, res);
  consoleLog('updateTimeline 3', { deletedIds });
  updateDB(newTweets, deletedIds);
  return await _updateIndex(getIndex(), newTweets, deletedIds);
};

const addTweets = async (res) => {
  const newTweets = await findNewTweets(await getAllIds('tweets'), res);
  updateDB(newTweets, []);
  return await _updateIndex(getIndex(), newTweets, []);
};
const removeTweets = async (ids: string[]) => {
  updateDB([], ids);
  return await _updateIndex(getIndex(), [], ids);
};
// need to leave open db and empty index
const dbClear = pipe(
  pipe((_) => getAllIds('tweets'), andThen(removeTweets)),
  pipe((_) => getAllIds('accounts'), andThen(onRemoveAccount)),
  pipe((_) => getAllIds('users'), andThen(onRemoveUser)),
  andThen((_) => {
    return { type: 'dbClear' };
  })
);
const setIndex = pipe((x) => getDb(1).put('misc', x, 'index'));
// indexUpdate :: String ->
const indexUpdate = (opName: string, updateFn) => {
  return pipe(
    inspect('indexUpdate 0 ' + opName),
    prop('res'),
    inspect('indexUpdate 1 ' + opName),
    updateFn,
    andThen(inspect('indexUpdate 2 ' + opName)),
    andThen((_) => howManyTweetsDb()),
    andThen((nTweets) => {
      return { type: opName, nTweets };
    })
  );
};
const onUpdateTimeline = indexUpdate('updateTimeline', updateTimeline);
const onAddTweets = indexUpdate('addTweets', addTweets);
const onRemoveTweets = indexUpdate('removeTweets', removeTweets);
const getTweetByID = (id: string): Promise<thTweet> =>
  db.dbGet(getDb(1), 'tweets', id);
const getTweetsFromDbById = async (ids: string[]): Promise<thTweet[]> =>
  await pipe<string[], Promise<thTweet>[], Promise<thTweet[]>>(
    () => ids,
    // ids => db.getMany(getDb(1), 'tweets', ids), andThen(filter(x => not(isNil(x)))))(ids);
    map(getTweetByID),
    andThen(filter((x) => not(isNil(x))))
  )();

// searchFromMsg :: msg search -> Promise [tweet]
const ftSearchFromMsg = curry(
  (
    _getIndex: () => any,
    m: { filters: any; accsShown: any; n_results: any; query: any }
  ): Promise<IndexSearchResult[]> => {
    const index = _getIndex();
    return search(m.filters, m.accsShown, m.n_results, _getIndex(), m.query);
  }
);

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

const makeTweetResponse = async (
  res: IndexSearchResult
): Promise<SearchResult> => {
  const tweet = await getTweetByID(res.ref);
  return { tweet, score: res.score };
};

const makeSearchResponse = async (
  results: IndexSearchResult[]
): Promise<SearchResult[]> => {
  const _response = await Promise.all(map(makeTweetResponse, results));
  const missing = filter(pipe(prop('tweet'), isNil), _response);
  const response = filter(pipe(prop('tweet'), isNil, not), _response);
  return response;
};

const fulltextSearch = async (m: ReqSearchMsg): Promise<TweetResWorkerMsg> => {
  return pipe<
    any,
    any,
    Promise<IndexSearchResult[]>,
    Promise<SearchResult[]>,
    Promise<SearchResult[]>,
    Promise<any>,
    Promise<TweetResWorkerMsg>
  >(
    () => m,
    tap((_) => emitMidSearch(true)),
    ftSearchFromMsg(getIndex),
    andThen(makeSearchResponse),
    andThen(tap((_) => emitMidSearch(false))),
    andThen(assoc('res', __, { type: 'searchIndex', msg: m }))
  )();
};

const semSearchFromMsg = curry((m: { query: string }) =>
  // { const index = _getIndex(); return semanticSearch(m.filters, m.accsShown, m.n_results, _getIndex(), m.query); });
  {
    return doSemanticSearch(m.query);
  }
);

// const semanticSearch = pipe(
//     tap(_ => emitMidSearch(true)),
//     semSearchFromMsg,
//     andThen(getTweetsFromDbById),
//     andThen(pipe(
//         tap(_ => emitMidSearch(false)),
//         assoc('res', __, { type: 'searchIndex', source:'semantic', score: })
//         ))
//     );

const semanticSearch = async (m: ReqSearchMsg): Promise<TweetResWorkerMsg> => {
  return pipe<
    any,
    any,
    Promise<IndexSearchResult[]>,
    Promise<SearchResult[]>,
    Promise<TweetResWorkerMsg>
  >(
    () => m,
    tap((_) => emitMidSearch(true)),
    semSearchFromMsg,
    andThen(makeSearchResponse),
    andThen(
      pipe<any, any, any>(
        tap((_) => emitMidSearch(false)),
        assoc('res', __, { type: 'searchIndex', msg: m })
      )
    )
  )();
};
// const doSemanticSearch = pipe<string, object, object, object[], string[]>(semanticSearch, prop('res'), values, map(pipe<object, string[], string>(values, nth(0))))

type DbGet = (storeName: string) => (id: TweetId) => Promise<thTweet>;
const idleFns = { random: getRandomSampleTweets, timeline: getLatestTweets };
// const msg2SampleArgs = m => [m.n_tweets, m.filters, curry((store, key)=>getDb(1).get(store, key)), m.screen_name, ()=>getDb(1).getAllKeys('tweets')]
const msg2SampleArgs = (
  m: ReqDefaultTweetsMsg
): [
  n_tweets: number,
  filters: SearchFilters,
  db_get: DbGet,
  accsShown: User[],
  getKeys: () => Promise<TweetId[]>
] => [
  m.n_tweets,
  m.filters,
  db.dbGet(getDb(1)),
  m.accsShown,
  () => getDb(1).getAllKeys('tweets'),
];
const callGetIdleTweets = (m: ReqDefaultTweetsMsg): Promise<thTweet[]> =>
  pipe<any, any, any>(() => m, msg2SampleArgs, apply(idleFns[m.idle_mode]))();
const getDefaultTweets = async (
  m: ReqDefaultTweetsMsg
): Promise<TweetResWorkerMsg> => {
  return pipe(
    () => m,
    inspect('getDefaultTweets 0'),
    callGetIdleTweets,
    andThen(inspect('getDefaultTweets 1')),
    andThen(
      map((tweet) => {
        return { tweet };
      })
    ),
    andThen(assoc('res', __, { type: 'getDefaultTweets', msg: m }))
  )();
};

// Effects
isMidSearch$.onValue(nullFn);
subObs(ready$, () => msgBG({ type: 'ready' }));
subReq(dbClear$, dbClear);
subReq(addAccount$, onAddAccount);
subReq(removeAccount$, pipe(prop('id'), onRemoveAccount));
subReq(addUser$, onAddUser);
subReq(removeUser$, onRemoveUser);
subReq(updateTimeline$, onUpdateTimeline);
subReq(addTweets$, onAddTweets);
subReq(removeTweets$, onRemoveTweets);
subReq(getDefaultTweets$, getDefaultTweets);
subReq(
  ftSearchReq$,
  pipe(
    inspect('fulltextSearch 0'),
    fulltextSearch,
    andThen(inspect('fulltextSearch 1'))
  )
);
subReq(semSearchReq$, semanticSearch);
subReq(howManyTweetsDb$, onHowManyTweetsDb);
