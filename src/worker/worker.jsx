
import "@babel/polyfill";
import * as db from '../bg/db.jsx'
import * as elasticlunr from 'elasticlunr'
import {makeIndex, updateIndex, search, loadIndex} from '../bg/nlp.jsx'
import {findDeletedIds, getRandomSampleTweets} from '../bg/twitterScout.jsx'
import { flattenModule, inspect, toggleDebug, currentValue } from '../utils/putils.jsx'
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
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect}))

// Utils 
const msgBG = function(msg){return self.postMessage(msg)} // different from cs's msgBG
const makeMidSearchEvent = (_busy) => {return new CustomEvent("midSearch", {detail: {busy:_busy}})} 
const emitMidSearch = (busy) => {self.dispatchEvent(makeMidSearchEvent(busy));}

// Functions, potential imports
const updateSomeDB = curry(async (_getDb, new_tweets, deleted_ids)=>{ // IMPURE, updates idb // updateDB :: [a] -> [a] // returns only tweets new to idb
  console.log('updating store', { new_tweets, deleted_ids})
  const storeName = 'tweets'
  isEmpty(deleted_ids) ? null : db.del(_getDb())(storeName, deleted_ids)
  isEmpty(new_tweets) ? null : db.put(_getDb())(storeName, new_tweets)
  return new_tweets
})


const initIndex = () => { //IMPURE, saves to db
  console.log('initing index')
  const newIndex = makeIndex()
  setIndex(newIndex.toJSON())
  return newIndex
}

// Streams
  // Db init
const db$ = Kefir.fromPromise(db.open()).ignoreEnd().toProperty()
const noDb$ = db$.map(isNil)
  // index init
const index$ = db$.flatMapFirst(_=>
  Kefir.fromPromise(db.get(getDb(), 'misc', 'index')).map(ifElse(isNil,_=>makeIndex(),loadIndex))).ignoreEnd().toProperty()
  // Kefir.fromPromise(db.get(getDb(), 'misc', 'index'))).map(when(isNil,_=>initIndex().toJSON())).ignoreEnd().toProperty()
const noIndex$ = index$.map(isNil)
index$.log('index$')
  // Messages
const receivedMsg$ = Kefir.fromEvents(self,'message')
const msg$ = receivedMsg$.map(prop('data'))//.bufferWhile(dbReady$).flatten()
const makeMsgStream = (typeName) => msg$.filter(propEq('type',typeName)).bufferWhileBy(noDb$).flatten() // Function
  // DB
const dbClear$ = makeMsgStream('dbClear')
  // Index Updating
// const getIndex$ = makeMsgStream('getIndex')
// const setIndex$ = makeMsgStream('setIndex')
const updateTweets$ = makeMsgStream('updateTweets')
const addTweets$ = makeMsgStream('addTweets')
const removeTweets$ = makeMsgStream('removeTweets')
  // Index reading
const isMidSearch$ = Kefir.fromEvents(self, 'midSearch').map(path(['detail', 'busy'])).toProperty(()=>false)
isMidSearch$.log('isMidSearch$')
const _searchIndex$ = makeMsgStream('searchIndex').bufferWhileBy(noIndex$).flatten()
_searchIndex$.log('_searchIndex$')
const searchIndex$ = _searchIndex$.bufferWhileBy(isMidSearch$).map(last)
searchIndex$.log('searchIndex$')
const getDefaultTweets$ = makeMsgStream('getDefaultTweets')



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
  const new_ids = difference(res.map(prop('id')), old_ids)
  const new_tweets = pipe(filter(pipe(prop('id'), includes(__,new_ids))))(res)
  
  updateDB(new_tweets, deleted_ids)
  // let _index = loadIndex(index_json)
  let _index = getIndex()
  _index = await updateIndex(_index, new_tweets, deleted_ids)
  const index_json = _index.toJSON()
  console.log('putting db', {index_json})
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}

// const addTweets = async (index_json, res) => {
const addTweets = async (res) => {
  const tweet_ids = await getDb().getAllKeys('tweets')
  const new_ids = difference(res.map(prop('id')), tweet_ids)
  const new_tweets = filter(x=>includes(x.id, new_ids), res)
  console.log('adding tweets',new_tweets)
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
const dbClear = async () => {
   await db.clear(getDb());
   getIndex();
  }


// const getIndexReq = pipe(
//   _=>db.get(getDb(), 'misc', 'index'),
//   andThen(pipe(
//     defaultTo(makeIndex().toJSON()),
//     // inspect('getting index'),
//     assoc('index_json', __, {type:`getIndex`}),
//     msgBG,
//     ))
//     )
const setIndex = pipe(
  x=>getDb().put('misc', x, 'index')
  )

const indexUpdate = (typeName, updateFn)=>{return pipe(
  // props(['index_json', 'res']), 
  props(['res']),
  args=>updateFn(...args), 
  andThen(pipe(
    // assoc('index_json', __, {type:typeName})  ,
    _=>{return {type:typeName}},
    msgBG )))}
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
  tap(_=>emitMidSearch(true)),
  msg2Search(getIndex),
  andThen(pipe(
    getTweetsFromDbById,
    andThen(pipe(
      tap(_=>emitMidSearch(false)),
      assoc('res', __ , {type:'searchIndex',}),
      msgBG
      )))))
const defaultTweetsFn = getRandomSampleTweets
const msg2SampleArgs = m=>[m.n_tweets, m.filters, db.get(getDb()), m.screen_name, ()=>getDb().getAllKeys('tweets')]
const getDefaultTweets = pipe(
  msg2SampleArgs,
  inspect('getDefault args'),
  args=>defaultTweetsFn(...args),
  andThen(pipe(
    inspect('gottDefault'),
    assoc('res', __ , {type:'getDefaultTweets',}),
    msgBG)))


// subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))

// Effects
// receivedMsg$.log('worker got message:')
// subObs(db$, ()=>msgBG({type:'ready'}))
subObs(index$, ()=>msgBG({type:'ready'}))
subObs(dbClear$, dbClear)
// subObs(getIndex$, getIndexReq)
// subObs(setIndex$, setIndex)
subObs(searchIndex$, searchIndex)
subObs(getDefaultTweets$, getDefaultTweets)
subObs(updateTweets$, onUpdateTweets)
subObs(addTweets$, onAddTweets)
subObs(removeTweets$, onRemoveTweets)


