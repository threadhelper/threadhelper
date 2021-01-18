import "@babel/polyfill";
// import "core-js/stable";
// import "regenerator-runtime/runtime";
import { onWorkerPromise } from './worker/promise-stream-worker';
import { IndexSearchResult, Msg, SearchResult, WorkerLog, ReqDefaultTweetsMsg, WorkerMsg, TweetResWorkerMsg, Msg2Worker, WriteAccMsg } from './types/msgTypes'
import * as db from './worker/db';
import * as elasticlunr from 'elasticlunr';
import { makeIndex, updateIndex, search, loadIndex } from './worker/nlp';
import { getRandomSampleTweets, getLatestTweets } from './worker/search';
import { doSemanticSearch, reqSemIndexTweets } from './worker/semantic';
import { findInnerDiff } from './bg/tweetImporter';
import { flattenModule, wInspect, toggleDebug, currentValue, isExist, wTimeFn } from './utils/putils';
import * as R from 'ramda';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math
import Kefir, { Subscription } from 'kefir';
import { IndexTweet, thTweet, TweetId } from "types/tweetTypes";
import { User } from "twitter-d";
import { IdleMode, SearchFilters } from "./types/stgTypes";

const wSelf:Worker = self as any
// Project business
// var DEBUG = process.env.NODE_ENV != 'production';
// toggleDebug(null, DEBUG);
// toggleDebug(wSelf, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;
// Stream clean up
const subscriptions: Subscription[] = [];
const rememberSub = (sub) => { subscriptions.push(sub); return sub; };
const subObs = (obs, effect: (arg0:any) => void) => rememberSub(obs.observe({ value: effect })); // subscribe to an observer
const subReq = (obs, effect) => subObs(obs, onWorkerPromise(effect)); // subscribe to an observer and return the result of the function to main as a promise 
// Utils 
const msgBG = function (msg: WorkerMsg) { return wSelf.postMessage(JSON.stringify(msg)); }; // different from cs's msgBG
const consoleLog = curry((log:string, baggage:Object): void => msgBG({type:'console', log, baggage:JSON.stringify(baggage)}))
const timeFn = wTimeFn(consoleLog)
const inspect = wInspect(consoleLog)
const makeMidSearchEvent = (_busy: boolean) => { return new CustomEvent("midSearch", { detail: { busy: _busy } }); };
const emitMidSearch = (busy: boolean) => { wSelf.dispatchEvent(makeMidSearchEvent(busy));  return busy};
// // Sync
// let count = 0
// const pendingReqs = []
// const makeReqToken = ()=>count+1;
// const sendSync = val=>msgBG({type:'sync', value:val})
// const addReq = req => {pendingReqs.push(makeReqToken()); return pendingReqs}
// const removeReq = req => {pendingReqs.push(req); return pendingReqs}
const dbDel = (_getDb: (arg0: number) => any, storeName: string, deleted_ids: any[]) => {
    db.delMany(_getDb(1))(storeName, deleted_ids);
};
// Functions, potential imports
const updateSomeDB = curry(async (_getDb: (arg0: number) => any, new_tweets, deleted_ids) => {
    // console.log('updating store', { new_tweets, deleted_ids });
    const storeName = 'tweets';
    isExist(deleted_ids) ? dbDel(_getDb, storeName, deleted_ids) : null;
    isExist(new_tweets) ? db.putMany(_getDb(1))(storeName, new_tweets) : null;
    return new_tweets;
});
const initIndex = async () => pipe(_ => getDb(1).getAll('tweets'), andThen(updateIndex(makeIndex(), __, [])))(1);
const getIndexFromDb = () => getDb(1).get('misc', 'index');
// 
consoleLog('worker hi! 0', '')
// throw Error('[DEBUG] [ERROR] worker debug error')
// Streams
// Db init
const db$ = Kefir.fromPromise(db.open()).ignoreEnd().toProperty();
const noDb$ = db$.map(isNil);
// Messages
const msg$ = Kefir.fromEvents(wSelf, 'message');
const makeMsgStream = (typeName: string) => msg$.filter(pathEq(['data', 1, 'type'], typeName)).bufferWhileBy(noDb$).flatten(); //.map(prop('data')) // Function
// index init
const resetIndex$ = makeMsgStream('resetIndex');
resetIndex$.onValue(consoleLog('resetIndex$'))
// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
const index$ = Kefir.merge([db$, resetIndex$]).flatMapFirst(_ => Kefir.fromPromise(pipe(getIndexFromDb, andThen(ifElse(isNil, _ => initIndex(), loadIndex)))(1))).ignoreEnd().toProperty();
index$.onValue(consoleLog('index$'))
// Kefir.fromPromise(db.get(getDb(1), 'misc', 'index'))).map(when(isNil,_=>initIndex().toJSON())).ignoreEnd().toProperty()
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
const makeSearchStream = (mode: string) => msg$.filter(pathEq(['data', 1, 'searchMode'], mode)).bufferWhileBy(noDb$).flatten(); //.map(prop('data')) // Function
const isMidSearch$ = Kefir.fromEvents(wSelf, 'midSearch').map(path<boolean>(['detail', 'busy'])).toProperty(() => false);
const _searchReq$ = makeMsgStream('searchIndex').bufferWhileBy(isMidSearch$).flatten();
const searchReq$ = _searchReq$.bufferWhileBy(noIndex$).map(last);
const ftSearchReq$ = makeSearchStream('fulltext').bufferWhileBy(isMidSearch$).flatten().bufferWhileBy(noIndex$).map(last);
// const semSearchReq$ = searchReq$.filter(pathEq(['data', 1, 'searchMode'], 'semantic'))
const semSearchReq$ = makeSearchStream('semantic').bufferWhileBy(isMidSearch$).flatten().bufferWhileBy(noIndex$).map(last);
const getDefaultTweets$ = makeMsgStream('getDefaultTweets');
// Sync
const ready$ = Kefir.merge([
    index$.filter(pipe(isNil, not)),
    makeMsgStream('isWorkerReady')
]).map(_ => true);
ready$.onValue(consoleLog('ready$'))
// Functions, potential imports
const curVal = stream => stream.currentValue();
const getDb = (_: any) => curVal(db$);
const updateDB = updateSomeDB(getDb);
const getIndex = () => curVal(index$);
const getAllIds = async (storeName: string) => (await getDb(1).getAllKeys(storeName)); // getAllIds :: () -> [ids]
const howManyTweetsDb = async (_) => (await getAllIds('tweets')).length;
const getAllAccounts = async (_: Promise<any>) => getDb(1).getAll('accounts');
const addAccount = async (user_info: User): Promise<any> => getDb(1).put('accounts', user_info);
const onAddAccount = pipe<WriteAccMsg, User, Promise<any>, Promise<User[]>>(
    prop('res'), 
    addAccount, 
    andThen(_ => getAllAccounts(_)),);
const removeAccount = async (id_str: string): Promise<any> => getDb(1).delete('accounts', id_str);
// const onRemoveAccount = async id_str => pipe(
const onRemoveAccount = async (id: string) => pipe(
    tap(removeAccount), 
    db.filterDb(getDb(1), 'tweets', propEq('account', __)), 
    andThen(map(prop('id'))), 
    andThen(ids => updateDB([], ids)),
    // andThen(id => updateDB([], [id])),
    andThen(_ => getAllAccounts(_)))(id);
const onAddUser = async (user_info) => getDb(1).put('users', user_info);
const onRemoveUser = async (id_str) => getDb(1).delete('users', id_str);
const _updateIndex = async (index:elasticlunr.Index<IndexTweet>, new_tweets: thTweet[], deleted_ids: string[]) => {
    const olds = await getAllIds('tweets')
    pipe<thTweet[], Promise<thTweet[]>, Promise<any>, Promise<any>>(
        findNewTweets(olds),
        andThen(ifElse(isEmpty,()=>{info:'no new tweets'},reqSemIndexTweets)),
        andThen(inspect('[INFO] reqSemIndexTweets')))(new_tweets)
    return pipe(
        (index, tweets_to_add, ids_to_remove) => updateIndex(index, tweets_to_add, ids_to_remove), 
        andThen(index => index.toJSON()), 
        andThen(index_json => getDb(1).put('misc', index_json, 'index')))(index, new_tweets, deleted_ids);
    }
const isBookmark = res => path([0, 'is_bookmark'], res); // checks whether the first is a bookmark to judge whether they're all bookmarks
const curAccount = res => path([0, 'account'], res); // checks whether the first is a bookmark to judge whether they're all bookmarks
const filterCondition = (res: readonly Record<"id", unknown>[]) => both(propEq('is_bookmark', path([0, 'is_bookmark'], res)), propEq('account', path([0, 'account'], res)));
const findDeletedIds = async (oldIds, res: thTweet[]): Promise<any> => {
    const onErrorFindingDeletedIds = e => { console.log('ERROR [findDeletedIds]', { e, oldIds, res }); return []; }
    return pipe(
        map(prop('id')), 
        tryCatch(
            findInnerDiff(oldIds), 
            onErrorFindingDeletedIds))(res)};
// const _findNewTweets = async (oldIds, res) => pipe(
//   map(prop('id')),
//   difference(__, oldIds),
//   newIds => filter(propSatisfies('id', includes(__, newIds)), res),
// )(res)
const findNewTweets = curry( async (oldIds: string[], res: thTweet[]): Promise<thTweet[]> => pipe(
// map(prop('id')),
// difference(__, oldIds),
filter(propSatisfies(id => !includes(id, oldIds), 'id')))(res))

const getRelevantOldIds = (filterFn: R.Pred) => pipe(db.filterDb(getDb(1), 'tweets', filterFn), andThen(map(prop('id'))));
const updateTimeline = async (res: thTweet[]) => {
    // console.log('[DEBUG] updateTimeline');
    const oldIds = getRelevantOldIds(filterCondition(res));
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '<T>() => Promise<T[]>' is not as.. Remove this comment to see the full error message
    const newTweets = await findNewTweets(oldIds, res);
    const deletedIds = await findDeletedIds(oldIds, res);
    updateDB(newTweets, deletedIds);
    return _updateIndex(getIndex(), newTweets, deletedIds);
};

const addTweets = async (res) => {
    const newTweets = await findNewTweets(await getAllIds('tweets'), res);
    updateDB(newTweets, []);
    return _updateIndex(getIndex(), newTweets, []);
};
const removeTweets = async (ids: string[]) => {
    // console.log('[DEBUG] removeTweets', { ids });
    updateDB([], ids);
    return _updateIndex(getIndex(), [], ids);
};
// need to leave open db and empty index
const dbClear = pipe(pipe(_ => getAllIds('tweets'), andThen(removeTweets)), pipe(_ => getAllIds('accounts'), andThen(onRemoveAccount)), pipe(_ => getAllIds('users'), andThen(onRemoveUser)), andThen(_ => { return { type: 'dbClear' }; }));
const setIndex = pipe(x => getDb(1).put('misc', x, 'index'));
// indexUpdate :: String -> 
const indexUpdate = (opName: string, updateFn) => {
    return pipe(
        prop('res'), updateFn, 
        // args=>updateFn(...args), 
        andThen(_ => { return { type: opName }; })
        );
};
const onUpdateTimeline = indexUpdate('updateTimeline', updateTimeline);
const onAddTweets = indexUpdate('addTweets', addTweets);
const onRemoveTweets = indexUpdate('removeTweets', removeTweets);
const getTweetByID = id=>db.get(getDb(1), 'tweets', id)
const getTweetsFromDbById = async (ids: string[]): Promise<thTweet[]>  => await pipe(
    // ids => db.getMany(getDb(1), 'tweets', ids), andThen(filter(x => not(isNil(x)))))(ids);
    map(getTweetByID), 
    andThen(filter(x => not(isNil(x))))
)(ids);

// searchFromMsg :: msg search -> Promise [tweet]
const ftSearchFromMsg = curry((_getIndex: () => any, m: {filters: any; accsShown: any; n_results: any; query: any;}): Promise<IndexSearchResult[]> => 
    { const index = _getIndex(); return search(m.filters, m.accsShown, m.n_results, _getIndex(), m.query); });
// const searchIndex = pipe(tap(_ => emitMidSearch(true)), searchFromMsg(getIndex), andThen(pipe(getTweetsFromDbById, andThen(pipe(tap(_ => emitMidSearch(false)), assoc('res', __, { type: 'searchIndex', }))))));
// const fulltextSearch = pipe<any, boolean, Promise<string[]>, Promise<thTweet[]>, Promise<any>>(
//     tap(_ => emitMidSearch(true)), 
//     ftSearchFromMsg(getIndex), 
//     andThen<string[], thTweet[]>(getTweetsFromDbById), 
//     andThen(pipe(
//         tap(_ => emitMidSearch(false)), 
//         assoc('res', __, { type: 'searchIndex', })
//         ))
//     );

const renameKeys = R.curry((keysMap, obj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
);

const makeTweetResponse = async (res:IndexSearchResult): Promise<SearchResult>=>{
    const tweet = await getTweetByID(res.ref)
    return {tweet, score: res.score}
}

const makeSearchResponse = async (results:IndexSearchResult[]): Promise<SearchResult[]>=>{
    const _response = await Promise.all(map(makeTweetResponse, results))
    const missing = filter(pipe(prop('tweet'), isNil), _response)
    const response = filter(pipe(prop('tweet'), isNil, not), _response)
    return response
}

// pipe<IndexSearchResult, SearchResult>(
//     R.over(lensProp('ref'), pipe(id => getTweetByID(id), andThen(inspect('makeSearchResponse 1')))),  
//     andThen(renameKeys({ref: 'tweet'})))


const fulltextSearch = pipe<any, any, Promise<IndexSearchResult[]>, Promise<SearchResult[]>, Promise<TweetResWorkerMsg>>(
    tap(_ => emitMidSearch(true)), 
    ftSearchFromMsg(getIndex), 
    andThen(makeSearchResponse), 
    andThen(pipe(
        tap(_ => emitMidSearch(false)), 
        assoc('res', __, { type: 'searchIndex', source:'fulltext'})
        ))
    );

const semSearchFromMsg = curry((m: {query: string;}) => 
    // { const index = _getIndex(); return semanticSearch(m.filters, m.accsShown, m.n_results, _getIndex(), m.query); });
    {return doSemanticSearch(m.query); });

// const semanticSearch = pipe(
//     tap(_ => emitMidSearch(true)), 
//     semSearchFromMsg, 
//     andThen(getTweetsFromDbById), 
//     andThen(pipe(
//         tap(_ => emitMidSearch(false)), 
//         assoc('res', __, { type: 'searchIndex', source:'semantic', score: })
//         ))
//     );



const semanticSearch = pipe<any, any, Promise<IndexSearchResult[]>, Promise<SearchResult[]>, Promise<TweetResWorkerMsg>>(
    tap(_ => emitMidSearch(true)), 
    semSearchFromMsg, 
    andThen(makeSearchResponse), 
    andThen(pipe<any,any,any>(
        tap(_ => emitMidSearch(false)), 
        assoc('res', __, { type: 'searchIndex', source:'semantic'})
        ))
    );
// const doSemanticSearch = pipe<string, object, object, object[], string[]>(semanticSearch, prop('res'), values, map(pipe<object, string[], string>(values, nth(0))))

type DbGet =  (storeName: string) => (id: TweetId) => Promise<thTweet>
const idleFns = { random: getRandomSampleTweets, timeline: getLatestTweets };
// const msg2SampleArgs = m => [m.n_tweets, m.filters, curry((store, key)=>getDb(1).get(store, key)), m.screen_name, ()=>getDb(1).getAllKeys('tweets')]
const msg2SampleArgs = (m: ReqDefaultTweetsMsg): [n_tweets: number, filters: SearchFilters, db_get: DbGet, accsShown: User[], getKeys: () => Promise<TweetId[]>] => [m.n_tweets, m.filters, db.get(getDb(1)), m.accsShown, () => getDb(1).getAllKeys('tweets')];
const callGetIdleTweets = (m: ReqDefaultTweetsMsg):Promise<thTweet[]> => pipe<any,any, any>(()=>m, msg2SampleArgs, apply(idleFns[m.idle_mode]))();
const getDefaultTweets = async (m: ReqDefaultTweetsMsg): Promise<TweetResWorkerMsg> =>{
    return pipe<any,any,any,any>(
        ()=>m,
        callGetIdleTweets, 
        andThen(map(tweet=>{return {tweet}})),
        andThen(assoc('res', __, { type: 'getDefaultTweets', 'msg': m })),
    )();
}

// subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))
// Effects
// receivedMsg$.log('worker got message:')
// subObs(db$, ()=>msgBG({type:'ready'}))
subObs(ready$, () => msgBG({ type: 'ready' }));
// subReq(ready$, async () => msgBG({ type: 'ready' }));
subReq(dbClear$, dbClear);
// subReq(addAccount$, timeFn('addAccount', onAddAccount));
subReq(addAccount$, onAddAccount);
subReq(removeAccount$, pipe(prop('id'), onRemoveAccount));
subReq(addUser$, onAddUser);
subReq(removeUser$, onRemoveUser);
subReq(updateTimeline$, timeFn('onUpdateTimeline', onUpdateTimeline));
subReq(addTweets$, timeFn('onAddTweets', onAddTweets));
subReq(removeTweets$, onRemoveTweets);
subReq(getDefaultTweets$, timeFn('getDefaultTweets', getDefaultTweets));
subReq(ftSearchReq$, timeFn('ftSearchReq', fulltextSearch));
subReq(semSearchReq$, timeFn('semSearchReq', semanticSearch));
subReq(howManyTweetsDb$, howManyTweetsDb);
