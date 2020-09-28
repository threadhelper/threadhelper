
import "@babel/polyfill";
import * as db from '../bg/db.jsx'
import * as elasticlunr from 'elasticlunr'
import {makeIndex, updateIndex, search, loadIndex} from '../bg/nlp.jsx'
import {findDeletedIds} from '../bg/twitterScout.jsx'
import { flattenModule } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)
import Kefir from 'kefir';


{var DEBUG = true;
if(!DEBUG){
    console.log("WORKER CANCELING CONSOLE")
    var methods = ["log", "debug", "warn", "trace", "time", "timeEnd", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}
}

const inspect = curry ((prepend, x)=>{console.log(prepend, x); return x;})

Kefir.Property.prototype.currentValue = function() {
  var result;
  var save = function(x) {
    result = x;
  };
  this.onValue(save);
  this.offValue(save);
  return result;
};

const msgBG = function(msg){return self.postMessage(msg)}

const db$ = Kefir.fromPromise(db.open()).ignoreEnd().toProperty()
db$.onValue(()=>msgBG({type:'ready'}))
const getDb = ()=>db$.currentValue()
const noDb$ = db$.map(isNil)

const receivedMsg$ = Kefir.fromEvents(self,'message')
const msg$ = receivedMsg$.map(prop('data'))//.bufferWhile(dbReady$).flatten()
receivedMsg$.log('worker got message:')

const getIndex$ = msg$.filter(propEq('type','getIndex')).bufferWhileBy(noDb$).flatten()
const getIndex = pipe(
  _=>db.get(getDb(), 'misc', 'index'),
  andThen(pipe(
    defaultTo(makeIndex().toJSON()),
    assoc('index_json', __, {type:`getIndex`}),
    msgBG,
    ))
  )

getIndex$.onValue(getIndex)


const setIndex$ = msg$.filter(propEq('type','setIndex')).map(prop('index_json')).bufferWhileBy(noDb$).flatten()
const setIndex = pipe(
  x=>getDb().put('misc', x, 'index'),
  andThen(
    _=>msgBG({type:`setIndex`}),
    )
  )
setIndex$.onValue(setIndex)

const updateTweets$ = msg$.filter(propEq('type','updateTweets')).bufferWhileBy(noDb$).flatten()
updateTweets$.log('updateTweets')
const onUpdateTweets = pipe(
  props(['index_json', 'res']), 
  args=>updateTweets(...args), 
  andThen(pipe(
    assoc('index_json', __, {type:`updateTweets`}),
    msgBG )))
updateTweets$.onValue(onUpdateTweets)
// updateTweets$.onValue(console.log)

const addTweets$ = msg$.filter(propEq('type','addTweets')).bufferWhileBy(noDb$).flatten()
addTweets$.log('addTweets')
const onAddTweets = pipe(
  props(['index_json', 'res']), 
  args=>addTweets(...args), 
  andThen(pipe(
    assoc('index_json', __, {type:`addTweets`}),
    msgBG )))
addTweets$.onValue(onAddTweets)

const removeTweets$ = msg$.filter(propEq('type','removeTweets')).bufferWhileBy(noDb$).flatten()
removeTweets$.log('removeTweets')
const onRemoveTweets = pipe(
  props(['index_json', 'res']), 
  args=>removeTweets(...args), 
  andThen(pipe(
    assoc('index_json', __, {type:`removeTweets`}),
    msgBG )))
removeTweets$.onValue(onRemoveTweets)


// IMPURE, updates idb
// updateDB :: [a] -> [a]
// returns only tweets new to idb
const updateDB = async (new_tweets, deleted_ids)=>{
  const storeName = 'tweets'
  db.del(getDb())(storeName, deleted_ids)
  db.put(getDb())(storeName, new_tweets)
  return new_tweets
}


const updateTweets = async (index_json, res) => {
  // console.log("inside updateTweets",{index_json, res})
  const isBookmark = path([0,'is_bookmark'],res)

  console.log('filtering db from worker', {res, isBookmark})
  const filteredRes = await db.filterDb(getDb(), 'tweets', propEq('is_bookmark', isBookmark))
  console.log('filtered db from worker', filteredRes)
  // const tweet_ids = await getDb().getAllKeys('tweets')
  const tweet_ids = map(prop('id'),filteredRes)
  const deleted_ids = findDeletedIds(tweet_ids, res.map(prop('id')))
  
  const new_ids = difference(res.map(prop('id_str')), tweet_ids)
  const new_tweets = filter(x=>includes(x.id_str, new_ids), res)
  
  updateDB(new_tweets, deleted_ids)

  let _index = loadIndex(index_json)
  _index = await updateIndex(_index, new_tweets, deleted_ids)
  index_json = _index.toJSON()
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}

const addTweets = async (index_json, res) => {
  const tweet_ids = await getDb().getAllKeys('tweets')
  
  const new_ids = difference(res.map(prop('id_str')), tweet_ids)
  const new_tweets = filter(x=>includes(x.id_str, new_ids), res)
  console.log('adding tweets',new_tweets)
  updateDB(new_tweets, [])

  let _index = loadIndex(index_json)
  _index = await updateIndex(_index, new_tweets, []) //this should have an empty list wtf
  index_json = _index.toJSON()
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}

const removeTweets = async (index_json, ids) => {
  updateDB([], ids)

  let _index = loadIndex(index_json)
  _index = await updateIndex(_index, [], ids)
  index_json = _index.toJSON()
  getDb().put('misc', index_json, 'index'); //re-store index
  return index_json
}
