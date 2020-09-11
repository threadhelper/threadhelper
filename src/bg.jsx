//using this temporarily but eventually probably should refactor away from classes
import "@babel/polyfill";
import * as browser from "webextension-polyfill";
import {inspect, setStg, getData, setData, removeData, updateOption, defaultOptions, makeStoragegObs, makeGotMsgObs} from './utils/dutils.jsx'
import {getTwitterTabIds} from './utils/wutils.jsx'
import { isNil, defaultTo, curry, filter, includes, difference, prop, props, path, propEq, pathEq, pipe, andThen, map, reduce, and, not, propSatisfies } from 'ramda'
import Kefir from 'kefir';
import {makeAuthObs} from './bg/auth.jsx'
import {makeOptionsObs} from './bg/options.jsx'
import * as db from './bg/db.jsx'
import {initWorker} from './bg/workerBoss.jsx'
import {Robo} from './bg/robo.js'
import {makeIndex, loadIndex, updateIndex, search} from './bg/nlp.jsx'
import {getUserInfo, updateQuery, timelineQuery, archToTweet, toTweet, getLatestTweets} from './bg/twitterScout.jsx'
import * as idb from 'idb'
import * as elasticlunr from 'elasticlunr'


var DEBUG = true;
if(!DEBUG){
    console.log("CANCELING CONSOLE")
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "trace", "time", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}



Kefir.Property.prototype.currentValue = function() {
  var result;
  var save = function(x) {
    result = x;
  };
  this.onValue(save);
  this.offValue(save);
  return result;
};




const twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
const makeInit = (auth)=>{
  return {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
}
// 
export async function main(){  
  chrome.runtime.onInstalled.addListener(onInstalled);
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.tabs.onUpdated.addListener(onTabUpdated);

  const activeTab$ = null

  

  const worker = initWorker()
  console.log('worker initialized', worker)
  const workerMsg$ = Kefir.fromEvents(worker,'message').map(prop('data'))
  workerMsg$.log('worker message:')
// 
  
  const db_prom = db.open(  )
  const _db = await db_prom
  const dbReady$ = Kefir.fromPromise(db_prom).toProperty(()=>null).ignoreEnd()

  const db_get = db.get(_db)
  const db_put = db.put(_db)
  const db_del = db.del(_db)
  const db_clear = () => db.clear(_db)
  // console.log("db opened", _db)


  const workerReady$ = workerMsg$.filter(propEq('type', 'ready'))
  workerReady$.onValue(()=>worker.postMessage({type:'getIndex'}))
  
  // const loadedIndexJson = await db_get('misc', 'index')
  // const loadIndex = (loadedIndexJson) => isNil(loadedIndexJson) ?  makeIndex() : elasticlunr.Index.load(loadedIndexJson)
  // let _index = loadIndex(loadedIndexJson)
  
  const getIndex$ = workerMsg$.filter(propEq('type','getIndex')).map(pipe(
    prop('index_json'),
    // defaultTo(makeIndex().toJSON()),
  )).toProperty()

  
  const updateTweets$ = workerMsg$.filter(propEq('type','updateTweets')).map(pipe(
    prop('index_json'),
  )).toProperty()
  updateTweets$.onValue(_=>removeData(["temp_archive"]))

  const getDateFormatted = () => (new Date()).toLocaleString()
  const whenUpdated$ = updateTweets$.map(_=>getDateFormatted()).toProperty(getDateFormatted)

  // const index$ = Kefir.merge([getIndex$, updateTweets$]).map(loadIndex).toProperty(()=>_index)
  const index$ = Kefir.merge([getIndex$, updateTweets$]).map(loadIndex).toProperty()
  
  const getIndex = ()=>index$.currentValue()

  // console.log('have index', _index)
  // const makeIndex$ = msg$.filter(m => m.type === 'make-index')
  // makeIndex$.onValue(()=>console.log(makeIndex()))
  /* 
  auth$ :: () -> {auth, csrf} 
  listens to headers from webrequests for auths 
      ({
        name: "credentials",
        authorization,
        csrfToken,
      })
  */
  const auth$ = makeAuthObs()
  
  // unique_auth$ :: auth -> auth
  const unique_auth$ = auth$
    .skipDuplicates((a,b)=>{return a.authorization == b.authorization && a.csrfToken == b.csrfToken})
    .filter(x=>(x.authorization != null && x.csrfToken != null))
    .toProperty()
  // unique_auth$.log("NEW BG auth")
  
    
  const getAuthInit = ()=>{ 
    const auth = unique_auth$.currentValue()
    return makeInit(auth)
  }

  // IMPURE
  // userInfo$ :: auth -> user_info
  const userInfo$ = unique_auth$.flatMap(_=>Kefir.fromPromise(getUserInfo(getAuthInit))).filter(x=>x.id!=null).toProperty(()=>{return {id:null}})
  userInfo$.skipDuplicates((a,b)=>a.id===b.id)//.log("user info")
  const getUsername = () => userInfo$.currentValue().screen_name

  // dbReady$.log("db ready")
  // index$.log("index")
  // userInfo$.log("user info")
  
  // ready$ :: user_info -> Bool
  const ready$ = Kefir.combine([
    dbReady$.map( x=>{return isNil(x) ? false : true}),
    index$.map( x=>{return isNil(x) ? false : true}),
    userInfo$.map( x=>{return isNil(x.id) ? false : true}),
  ], (...args)=>reduce(and, true, args)).toProperty(()=>false)
  ready$.onValue(setStg('sync'))
  ready$.log('READY')
  const notReady$ = ready$.map(not)

  const howManyTweetsDb = async ()=> (await _db.getAllKeys('tweets')).length
  const whenLastUpdate = ()=>whenUpdated$.currentValue()
  const makeSyncDisplayMsg = async ()=>{
    const username = getUsername()
    const n_tweets = await howManyTweetsDb()
    const dateTime = await whenLastUpdate()
    return `Hello ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`
  }
  const syncDisplay$ = Kefir.merge([
    ready$,
    updateTweets$,
  ])
  syncDisplay$.onValue(pipe(
    _=>makeSyncDisplayMsg(),
    andThen(pipe(
      inspect('syncDisplay'),
      setStg('syncDisplay')
      ))
  ))

  // storageChange$ :: () -> change
  // change :: {itemName, oldVal, newVal}
  // Listens to changes in chrome.storage
  const storageChange$ = makeStoragegObs()
  // storageChange$.log("STORAGE CHANGE")
  
  // options$ :: change -> change
  const optionsChange$ = storageChange$.filter(x=>x.itemName=='options')

  // IMPURE
  // const initOptions = ()=>{
  //   const init = {name:'options', getRTs: true}
  //   setData({options: init})
  //   return init 
  // }
  const loadedOptions = await getData('options')
  const cachedOptions = isNil(loadedOptions) ? defaultOptions() : loadedOptions

  // const isOptionSame = x=>(isNil(x.oldVal) && isNil(x.newVal)) || (x.oldVal[itemName] == x.newVal[itemName])
  const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (x.oldVal[name] == x.newVal[name])) )
  
  // makeOptionsObs :: String -> a
  const makeOptionObs = (itemName) => optionsChange$.filter(isOptionSame(name)).map(path(['newVal', itemName])).toProperty(()=>cachedOptions[itemName])

  // getRT$ :: () -> Bool
  const getRT$ = makeOptionObs('getRTs')
  // getRT$.onValue()
  getRT$.log('getRT option')
  
  // msg$ :: () -> msg
  // msg :: {type,...}
  // Listens to chrome runtime onMessage
  const msg$ = makeGotMsgObs().map(x=>x.m)
  msg$.log("bg message")
  // const gotMsg$ = makeGotMsgObs().map(x=>x.m)
  // const msg$ = gotMsg$.map(x=>x.m)
  // msg$.log("NEW BG message")


  
  // IMPURE, updates idb
  // updateDB :: [a] -> [a]
  // returns only tweets new to idb
  // const updateDB = async (new_tweets, deleted_ids)=>{
  //   const storeName = 'tweets'
  //   db_del(storeName, deleted_ids)
  //   db_put(storeName, new_tweets)
  //   return new_tweets
  // }

  // const updateTweets = async (res) => {
  //   const tweet_ids = await _db.getAllKeys('tweets')
  //   // const deleted_ids = difference(tweet_ids, res.map(prop('id_str')))
  //   const deleted_ids = difference(tweet_ids, res.map(prop('id')))
    
  //   const new_ids = difference(res.map(prop('id_str')), tweet_ids)
  //   const new_tweets = filter(x=>includes(x.id_str, new_ids), res)
    
  //   // console.log('updating tweets', {new_tweets, deleted_ids})
  //   updateDB(new_tweets, deleted_ids)
  //   _index = await updateIndex(_index, new_tweets, deleted_ids)
  //   _db.put('misc', _index.toJSON(), 'index'); //re-store index
  //   // console.log('updated index', _index)
  // }

  const update_size = 200
  // reqUpdateTweets$ :: msg -> msg
  const reqUpdateTweets$ = msg$.filter(m => ['update-tweets', "new-tweet"].includes(m.type)).bufferWhileBy(notReady$)
  // IMPURE
  const fetchedUpdate$ = reqUpdateTweets$.flatMapLatest(_=>Kefir.fromPromise(updateQuery(getAuthInit, getUsername(), update_size)))

  // IMPURE, fetches tweets from Twitter API, maps them to our format, updates database
  // reqUpdateTweets$.onValue(pipe(
  //   _=>updateQuery(getAuthInit, getUsername(), update_size), //impure
  //   andThen(pipe(
  //     // x=>{console.log(x); return x},
  //     map(toTweet(userInfo$.currentValue())),
  //     updateDB,
  //     )),
  //   ))
    // 
  // reqTimeline$ :: msg -> msg
  const reqTimeline$ = msg$.filter(m => ["update-timeline"].includes(m.type)).bufferWhileBy(notReady$)
  // IMPURE
  const fetchedTimeline$ = reqTimeline$.flatMapLatest(_=>Kefir.fromPromise(timelineQuery(getAuthInit, userInfo$.currentValue())))
  
  const toTweets = map(toTweet(userInfo$.currentValue()))
  const archToTweets = map(archToTweet(userInfo$.currentValue()))

  const fetchedTweets$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$])//.map(toTweets)
  // fetchedTweets$.onValue(updateTweets)
  
  const reqSaveTweets = res=>{worker.postMessage({type:'updateTweets', index_json:getIndex().toJSON(), res:res})}

  fetchedTweets$.onValue(pipe(
    defaultTo([]),
    toTweets,
    reqSaveTweets,
  ))
  // fetchedTweets$.onValue(res=>{worker.postMessage({type:'updateTweets', index_json:getIndex().toJSON(), res:res})})
// 
  const reqArchiveLoad$ = msg$.filter(propSatisfies(x=>["temp-archive-stored", "load-archive"].includes(x), 'type'))
  const archiveLoadedTweets$ = reqArchiveLoad$.flatMapLatest(_=>Kefir.fromPromise(getData("temp_archive")))
  archiveLoadedTweets$.log('archive tweets')
  archiveLoadedTweets$.onValue(pipe(
    defaultTo([]),
    archToTweets,
    reqSaveTweets
  ))

  // const archiveLoad$ = msg$.filter(m => m.type === "temp-archive-stored")
    // .map(m.query_type)
  const n_tweets_results = 20

  

  // getTweetsFromDbById :: [id] -> [tweets]
  const getTweetsFromDbById = async (ids) => await pipe(
    map(db_get('tweets')), 
    (arr)=>Promise.all(arr),
  )(ids)

  const searchTweets = (query)=>search(getRT$.currentValue(), getUsername(), n_tweets_results, getIndex(), query)

  const searchQuery$ = msg$.filter(x=>x.type === "search").map(prop('query')).toProperty(()=>'')
  searchQuery$.log('searchQuery$')
  const reqSearch$ = Kefir.merge([ 
    searchQuery$,
    getRT$.map(()=>searchQuery$.currentValue()),
    ]).bufferWhileBy(notReady$)
  // reqSearch$.log('reqSearch')                  
  // const commitSearch$ = reqSearch$.take(1).(skipUntilBy())
// 
  let searchFree = true
  const isSearchFree = () => searchFree
  // const setSearchFree = (val) => {searchFree = val; console.log('set search free', val)}

  // const searchResult$ = reqSearch$.skipUntilBy(query=>Kefir.fromPromise(searchTweets(query)))
  // TODO buffer and process last query
  const searchResult$ = reqSearch$.filter(isSearchFree).flatMapFirst(query => {
    // console.log(`searching for ${query} bc searchFree is ${searchFree}`); 
    // setSearchFree(false); 
    return Kefir.fromPromise(searchTweets(query))} )
    
  searchResult$.onValue(
    pipe(
      inspect('search res ids'),
      getTweetsFromDbById,
      inspect('search res tweets'),
      andThen(pipe(
        setStg('search_results'),
        // x=>{setSearchFree(true); return x;},
        )),
    )
  )
  
  const getLatest = async _=>getLatestTweets(
    n_tweets_results, 
    getRT$.currentValue(), 
    db_get, 
    getUsername(), 
    await _db.getAllKeys('tweets')
  )
  // this exists for tests
  const latestTweets$ = Kefir.merge([
    getRT$,
    msg$.filter(propEq('type', "get-latest")),
    fetchedTweets$.delay(100), // TODO: this makes us set the latest tweets a little after every tweets update, but we should be doing it based on db updates instead.
  ]).bufferWhileBy(notReady$)

  latestTweets$.onValue(pipe(
    getLatest,
    andThen(
      setStg('latest_tweets'),
      )
    )
  )

  const loadArchive$ = msg$.filter(propEq('type', 'load-archive'))
  const reqRoboQuery$ = null
  const reqBookmarks$ = null
  const reqThread$ = null

  const stg_clear = ()=>chrome.storage.local.clear(()=>{
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
  })

  const reqClear$ = msg$.filter(m => m.type === "clear")
  reqClear$.onValue(()=>{db_clear(); stg_clear();})
  const logAuth$ = msg$.filter(m => m.type === 'log-auth')
  // logAuth$.onValue(()=>console.log(getAuthInit()))
  const getUserInfo$ = msg$.filter(m => m.type === 'get-user-info')
  getUserInfo$.onValue(()=>getUserInfo(getAuthInit))

  

}

 



function onInstalled() {
  console.log("On Installed!")
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "twitter.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
  // getTwitterTabIds().then(tids=>{console.log(`twitter tabIds`, tids); tids.forEach(x=>chrome.tabs.reload(x))})
}

// TODO emit to active tab
function onTabActivated(activeInfo){
  chrome.tabs.get(activeInfo.tabId, function(tab){
    if(tab.url != null){
      try{
        let url = tab.url;
        if (url.match(twitter_url)) {
          // console.log("tab activated", tab)
          // utils.tabId = tab.id
          // utils.msgCS({type:"tab-activate", url:url, cs_id: tab.id})
        }
      }catch(e){
        console.log(e)
      }
    }
  });
}

function onTabUpdated(tabId, change, tab){
  if (tab.active && change.url) {
    if (change.url.match(twitter_url)){
      // console.log(`url changed: ${change.url}`)
      // utils.tabId = tab.id
      // utils.msgCS({type:"tab-change-url", url:change.url, cs_id: tab.id})
    }
  }
}    

main()