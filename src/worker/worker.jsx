
import "@babel/polyfill";
import {onWorkerPromise} from './promise-stream-worker.jsx'
import * as db from '../bg/db.jsx'
import * as elasticlunr from 'elasticlunr'
import {makeIndex, updateIndex, search, loadIndex} from '../bg/nlp.jsx'
import {getRandomSampleTweets, getLatestTweets} from '../bg/search.jsx'
import { findInnerDiff } from '../bg/tweetImporter.jsx'
import { flattenModule, inspect, toggleDebug, currentValue, isExist, timeFn } from '../utils/putils.jsx'
import * as R from 'ramda';''
flattenModule(global,R)
import Kefir from 'kefir';

// Project business
var DEBUG = true;
toggleDebug(null, DEBUG)
Kefir.Property.prototype.currentValue = currentValue

// Stream clean up
const subscriptions = []
const rememberSub = (sub) => {subscriptions.push(sub); return sub}
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect})) // subscribe to an observer
const subReq = (obs, effect) => subObs(obs, onWorkerPromise(effect)) // subscribe to an observer and return the result of the function to main as a promise 
// Utils 
const msgBG = function(msg){return self.postMessage(msg)} // different from cs's msgBG
const makeMidSearchEvent = (_busy) => {return new CustomEvent("midSearch", {detail: {busy:_busy}})} 
const emitMidSearch = (busy) => {self.dispatchEvent(makeMidSearchEvent(busy));}

// // Sync
// let count = 0
// const pendingReqs = []
// const makeReqToken = ()=>count+1;
// const sendSync = val=>msgBG({type:'sync', value:val})
// const addReq = req => {pendingReqs.push(makeReqToken()); return pendingReqs}
// const removeReq = req => {pendingReqs.push(req); return pendingReqs}

const dbDel = (_getDb, storeName, deleted_ids) => {
  db.delMany(_getDb())(storeName, deleted_ids)
}

// Functions, potential imports
const updateSomeDB = curry(async (_getDb, new_tweets, deleted_ids)=>{ // IMPURE, updates idb // updateDB :: [a] -> [a] // returns only tweets new to idb
  console.log('updating store', { new_tweets, deleted_ids})
  const storeName = 'tweets'
  isExist(deleted_ids) ? dbDel(_getDb, storeName, deleted_ids) : null
  isExist(new_tweets) ? db.putMany(_getDb())(storeName, new_tweets) : null
  return new_tweets
})
// const initIndex = async () => { //IMPURE, saves to db
//   console.log('initing index')
//   const newIndex = makeIndex()
//   await updateIndex(newIndex, await getDb().getAll('tweets'), [])
//   console.log('initing index')
//   // setIndex(newIndex.toJSON())
//   return newIndex
// }

const initIndex = async() => pipe(_=>getDb().getAll('tweets'), andThen(updateIndex(makeIndex(), __, [])), inspect('initIndex'))(1)

// const getIndexFromDb = () => db.get(getDb(), 'misc', 'index')
const getIndexFromDb = () => getDb().get('misc', 'index')
// 
// Streams
  // Db init
const db$ = Kefir.fromPromise(db.open()).ignoreEnd().toProperty()
const noDb$ = db$.map(isNil)
  // Messages
const msg$ = Kefir.fromEvents(self,'message')
const makeMsgStream = (typeName) => msg$.filter(pathEq(['data',1,'type'],typeName)).bufferWhileBy(noDb$).flatten()//.map(prop('data')) // Function
  // index init
const resetIndex$ = makeMsgStream('resetIndex')
const index$ = Kefir.merge([db$, resetIndex$]).flatMapFirst(_=>
  Kefir.fromPromise(pipe(getIndexFromDb, andThen(ifElse(isNil,_=>initIndex(),loadIndex)))(1))).ignoreEnd().toProperty()
  // Kefir.fromPromise(db.get(getDb(), 'misc', 'index'))).map(when(isNil,_=>initIndex().toJSON())).ignoreEnd().toProperty()
const noIndex$ = index$.map(isNil)
// 
  // DB
const dbClear$ = makeMsgStream('dbClear')
const howManyTweetsDb$ = makeMsgStream('howManyTweetsDb')
  // Account updating
const addAccount$ = makeMsgStream('addAccount')//.map(prop('res'))
addAccount$.log('addAccount$')
const removeAccount$ = makeMsgStream('removeAccount')//.map(prop('res'))
  // User updating
const addUser$ = makeMsgStream('addUser')
const removeUser$ = makeMsgStream('removeUser')
  // Index Updating
const updateTimeline$ = makeMsgStream('updateTimeline')
const addTweets$ = makeMsgStream('addTweets')
const removeTweets$ = makeMsgStream('removeTweets')
  // Index reading
const isMidSearch$ = Kefir.fromEvents(self, 'midSearch').map(path(['detail', 'busy'])).toProperty(()=>false)
const _searchIndex$ = makeMsgStream('searchIndex').bufferWhileBy(noIndex$).flatten()
const searchIndex$ = _searchIndex$.bufferWhileBy(isMidSearch$).map(last)
searchIndex$.log('searchIndex$')
const getDefaultTweets$ = makeMsgStream('getDefaultTweets')
// getDefaultTweets$.log('getDefaultTweets$')
  // Sync
const ready$ = Kefir.merge([
  index$.filter(pipe(isNil, not)), // index$ follows db$
  makeMsgStream('isWorkerReady')
  ]).map(_ => true)

// Functions, potential imports
const curVal = stream => stream.currentValue()
const getDb = _ => curVal(db$)
const updateDB = updateSomeDB(getDb)
const getIndex = () => curVal(index$)
const getAllIds = async storeName => (await getDb().getAllKeys(storeName)) // getAllIds :: () -> [ids]
const howManyTweetsDb = async _=> (await getAllIds('tweets')).length
const getAllAccounts = async _ => getDb().getAll('accounts')


const onAddAccount = async user_info => getDb().put('accounts', user_info)
const removeAccount = async id_str => getDb().delete('accounts', id_str)
// const onRemoveAccount = async id_str => pipe(
const onRemoveAccount = async id=>pipe(
  tap(removeAccount),
  db.filterDb(getDb(), 'tweets', propEq('account', __)),
  andThen(map(prop('id'))),
  updateDB([])
  )(id)


const onAddUser = async user_info => getDb().put('users', user_info)
const onRemoveUser = async id_str => getDb().delete('users', id_str)


const _updateIndex = async (index, new_tweets, deleted_ids) => pipe(
    updateIndex,
    andThen(index => index.toJSON()),
    index_json => getDb().put('misc', index_json, 'index'),
  )(index, new_tweets, deleted_ids)


const isBookmark = res=>path([0,'is_bookmark'],res) // checks whether the first is a bookmark to judge whether they're all bookmarks
const curAccount = res=>path([0,'account'],res) // checks whether the first is a bookmark to judge whether they're all bookmarks
const filterCondition = res => both(propEq('is_bookmark', path([0,'is_bookmark'],res)), propEq('account', path([0,'account'],res)))

const findDeletedIds = async (oldIds, res) => pipe(
  map(prop('id')),
  tryCatch(
    findInnerDiff(oldIds),
    e=>{console.log('ERROR [findDeletedIds]', {e, oldIds, res}); return []}
    ))(res)

const findNewTweets = async (oldIds, res) => pipe(
  map(prop('id')),
  difference(__, oldIds),
  newIds => filter(propSatifies('id', includes(__, newIds)), res),
)(res)

// getRelevantOldIds :: fn => [id]
const getRelevantOldIds = filterFn => pipe(db.filterDb(getDb(), 'tweets', filterFn),  andThen(map(prop('id'))))

const updateTimeline = async res => {
  const oldIds = getRelevantOldIds(filterCondition(res))
  const newTweets = findNewTweets(oldIds, res)
  const deletedIds = findDeletedIds(oldIds, res)
  updateDB(new_tweets, deleted_ids)
  return _updateIndex(getIndex(), new_tweets, deleted_ids)
}

const _updateTimeline = async (res) => {
  const filteredRes = await db.filterDb(getDb(), 'tweets', filterCondition(res))
  const old_ids = map(prop('id'), filteredRes)
  let deleted_ids = []
  try{deleted_ids = findInnerDiff(old_ids, res.map(prop('id')))}
  catch(e){console.log('ERROR [findDeletedIds]', {e, old_ids, res})}

  const new_ids = difference(map(prop('id'), res), old_ids)
  const new_tweets = filter(propSatisfies('id', includes(__,new_ids)),res)
  updateDB(new_tweets, deleted_ids)
  // let _index = getIndex()
  // _index = await updateIndex(_index, new_tweets, deleted_ids)
  // const index_json = _index.toJSON()
  // console.log('putting db', {index_json})
  // getDb().put('misc', index_json, 'index'); //re-store index
  // return index_json
  return _updateIndex(getIndex(), new_tweets, deleted_ids)
}

const addTweets = async (res) => {
  console.log('in [addTweets]',{res})
  const tweet_ids = await getDb().getAllKeys('tweets')
  const new_ids = difference(res.map(prop('id')), tweet_ids)
  const new_tweets = filter(x=>includes(x.id, new_ids), res)
  console.log('adding tweets',{new_ids, new_tweets})
  updateDB(new_tweets, [])
  let _index = getIndex()
  _index = await updateIndex(_index, new_tweets, []) //this should have an empty list wtf
  const index_json = _index.toJSON()
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}

// const removeTweets = async (index_json, ids) => {
const removeTweets = async (ids) => {
  console.log('remove', {ids})
  updateDB([], ids)
  let _index = getIndex()
  _index = await updateIndex(_index, [], ids)
  const index_json = _index.toJSON()
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}

// need to leave open db and empty index
const dbClear = pipe(
    pipe(
      _=>getAllIds('tweets'), 
      andThen(removeTweets)),
    pipe(
      _=>getAllIds('accounts'), 
      andThen(onRemoveAccount)),
    pipe(
      _=>getAllIds('users'), 
      andThen(onRemoveUser)),
    andThen(_=>{return {type:'dbClear'}}))

const setIndex = pipe(x=>getDb().put('misc', x, 'index'))

// indexUpdate :: String -> 
const indexUpdate = (opName, updateFn) => {return pipe(
  inspect('indexUpdate'),
  prop('res'),
  updateFn, 
  // args=>updateFn(...args), 
  andThen(_=>{return {type:opName}}))}
const onUpdateTimeline = indexUpdate('updateTimeline', updateTimeline)
const onAddTweets = indexUpdate('addTweets', addTweets)
const onRemoveTweets = indexUpdate('removeTweets', removeTweets)

const getTweetsFromDbById = async (ids) => await pipe( // getTweetsFromDbById :: [id] -> [tweets]
  db.getMany(getDb(), 'tweets'), 
  andThen(filter(x=>not(isNil(x)))),
)(ids)

// msg2Search :: msg search -> Promise [tweet]
const msg2Search = curry((_getIndex, m) => {const index = _getIndex(); return search(m.filters, m.accsShown, m.n_results, _getIndex(), m.query)})
const searchIndex = pipe( // async
  tap(_=>emitMidSearch(true)),
  msg2Search(getIndex),
  andThen(pipe(
    getTweetsFromDbById,
    andThen(pipe(
      tap(_=>emitMidSearch(false)),
      assoc('res', __ , {type:'searchIndex',}),
      )))))

const idleFns = {random: getRandomSampleTweets, timeline: getLatestTweets}
// const msg2SampleArgs = m => [m.n_tweets, m.filters, curry((store, key)=>getDb().get(store, key)), m.screen_name, ()=>getDb().getAllKeys('tweets')]
const msg2SampleArgs = m => [m.n_tweets, m.filters, db.get(getDb()), m.accsShown, ()=>getDb().getAllKeys('tweets')]
const callGetIdleTweets = m => pipe(msg2SampleArgs, apply(idleFns[m.idle_mode]))(m)
const getDefaultTweets = pipe(
    callGetIdleTweets,
    inspect('worker getDefaultTweets'),
    andThen(assoc('res', __ , {type:'getDefaultTweets',})))


// subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))

// Effects
// receivedMsg$.log('worker got message:')
// subObs(db$, ()=>msgBG({type:'ready'}))
subObs(ready$, ()=>msgBG({type:'ready'}))
subReq(dbClear$, dbClear)
const addAccount = pipe(inspect('subReq(addAccount$)'), prop('res'), onAddAccount, _=>getAllAccounts())
subReq(addAccount$, timeFn('addAccount', addAccount))
subReq(removeAccount$, pipe(prop('id'), onRemoveAccount, _=>getAllAccounts()))
subReq(addUser$, onAddUser)
subReq(removeUser$, onRemoveUser)
subReq(updateTimeline$, timeFn('onUpdateTimeline', onUpdateTimeline))
subReq(addTweets$, timeFn('onAddTweets', onAddTweets))
subReq(removeTweets$, onRemoveTweets)
subReq(getDefaultTweets$, timeFn('getDefaultTweets', getDefaultTweets))
subReq(searchIndex$, timeFn('searchIndex', searchIndex))
subReq(howManyTweetsDb$, howManyTweetsDb)
