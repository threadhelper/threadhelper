
import "@babel/polyfill";
import {onWorkerPromise} from './promise-stream-worker.jsx'
import * as db from '../bg/db.jsx'
import * as elasticlunr from 'elasticlunr'
import {makeIndex, updateIndex, search, loadIndex} from '../bg/nlp.jsx'
import {findDeletedIds, getRandomSampleTweets} from '../bg/twitterScout.jsx'
import { flattenModule, inspect, toggleDebug, currentValue, isExist } from '../utils/putils.jsx'
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
  db.del(_getDb())(storeName, deleted_ids)
}
// Functions, potential imports
const updateSomeDB = curry(async (_getDb, new_tweets, deleted_ids)=>{ // IMPURE, updates idb // updateDB :: [a] -> [a] // returns only tweets new to idb
  console.log('updating store', { new_tweets, deleted_ids})
  const storeName = 'tweets'
  // isExist(deleted_ids) ? db.del(_getDb())(storeName, deleted_ids) : null
  isExist(deleted_ids) ? dbDel(_getDb, storeName, deleted_ids) : null
  isExist(new_tweets) ? db.put(_getDb())(storeName, new_tweets) : null
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

const getIndexFromDb = () => db.get(getDb(), 'misc', 'index')
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

  // DB
const dbClear$ = makeMsgStream('dbClear')
const howManyTweetsDb$ = makeMsgStream('howManyTweetsDb')
  // Index Updating
const updateTweets$ = makeMsgStream('updateTweets')
const addTweets$ = makeMsgStream('addTweets')
const removeTweets$ = makeMsgStream('removeTweets')
  // Index reading
const isMidSearch$ = Kefir.fromEvents(self, 'midSearch').map(path(['detail', 'busy'])).toProperty(()=>false)
const _searchIndex$ = makeMsgStream('searchIndex').bufferWhileBy(noIndex$).flatten()
const searchIndex$ = _searchIndex$.bufferWhileBy(isMidSearch$).map(last)
const getDefaultTweets$ = makeMsgStream('getDefaultTweets')
  // Sync
const ready$ = index$.filter(pipe(isNil, not)).map(_ => true) // index$ follows db$

// Functions, potential imports
const getDb = ()=>db$.currentValue()
const updateDB = updateSomeDB(getDb)
const getIndex = ()=>index$.currentValue()


// const updateTweets = async (index_json, res) => {
const updateTweets = async (res) => {
  const isBookmark = path([0,'is_bookmark'],res) // checks whether the first is a bookmark to judge whether they're all bookmarks
  const filteredRes = await db.filterDb(getDb(), 'tweets', propEq('is_bookmark', isBookmark))
  const old_ids = map(prop('id'),filteredRes)
  const deleted_ids = findDeletedIds(old_ids, res.map(prop('id')))
  const new_ids = difference(map(prop('id'), res), old_ids)
  const new_tweets = pipe(filter(pipe(prop('id'), includes(__,new_ids))))(res)
  updateDB(new_tweets, deleted_ids)
  let _index = getIndex()
  _index = await updateIndex(_index, new_tweets, deleted_ids)
  const index_json = _index.toJSON()
  console.log('putting db', {index_json})
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}

// const addTweets = async (index_json, res) => {
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

const getAllIds = async ()=> (await getDb().getAllKeys('tweets')) // getAllIds :: () -> [ids]

// need to leave open db and empty index
const dbClear = pipe(_=>getAllIds(), andThen(removeTweets), andThen(_=>{return {type:'dbClear'}}))

const howManyTweetsDb = async () => (await getDb().getAllKeys('tweets')).length

const setIndex = pipe(
  x=>getDb().put('misc', x, 'index')
  )
// indexUpdate :: String -> 
const indexUpdate = (opName, updateFn) => {return pipe(
  inspect('indexUpdate'),
  prop('res'),
  updateFn, 
  // args=>updateFn(...args), 
  andThen(_=>{return {type:opName}}))}
const onUpdateTweets = indexUpdate('updateTweets', updateTweets)
const onAddTweets = indexUpdate('addTweets', addTweets)
const onRemoveTweets = indexUpdate('removeTweets', removeTweets)

const getTweetsFromDbById = async (ids) => await pipe( // getTweetsFromDbById :: [id] -> [tweets]
  db.getMany(getDb(), 'tweets'), 
  andThen(filter(x=>not(isNil(x)))),
)(ids)

// msg2Search :: msg search -> Promise [tweet]
const msg2Search = curry((_getIndex, m) => {const index = _getIndex(); console.log({index,m}); return search(m.filters, m.username, m.n_results, _getIndex(), m.query)})
const searchIndex = pipe( // async
  // inspect('search'),
  tap(_=>emitMidSearch(true)),
  msg2Search(getIndex),
  andThen(pipe(
    getTweetsFromDbById,
    andThen(pipe(
      tap(_=>emitMidSearch(false)),
      assoc('res', __ , {type:'searchIndex',}),
      )))))
const defaultTweetsFn = getRandomSampleTweets
const msg2SampleArgs = m=>[m.n_tweets, m.filters, db.get(getDb()), m.screen_name, ()=>getDb().getAllKeys('tweets')]
const getDefaultTweets = pipe(
  msg2SampleArgs,
  args=>defaultTweetsFn(...args),
  andThen(pipe(
    assoc('res', __ , {type:'getDefaultTweets',}),
    )))


// subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))

// Effects
// receivedMsg$.log('worker got message:')
// subObs(db$, ()=>msgBG({type:'ready'}))
subObs(ready$, ()=>msgBG({type:'ready'}))
subReq(dbClear$, dbClear)
subReq(updateTweets$, onUpdateTweets)
subReq(addTweets$, onAddTweets)
subReq(removeTweets$, onRemoveTweets)
subReq(getDefaultTweets$, getDefaultTweets)
subReq(searchIndex$, searchIndex)
subReq(howManyTweetsDb$, howManyTweetsDb)
