//using this temporarily but eventually probably should refactor away from classes
import "@babel/polyfill";
import * as browser from "webextension-polyfill";
import {inspect, setStg, getData, setData, removeData, getOptions, defaultOptions, makeStoragegObs, makeGotMsgObs, makeStorageStream, makeMsgStream} from './utils/dutils.jsx'
import {getTwitterTabIds} from './utils/wutils.jsx'
import { flattenModule } from './utils/putils.jsx'
import * as R from 'ramda';
flattenModule(window,R)
import Kefir from 'kefir';
import {makeAuthObs} from './bg/auth.jsx'
import * as db from './bg/db.jsx'
import {initWorker} from './bg/workerBoss.jsx'
import {makeRoboRequest} from './bg/robo.jsx'
import {makeIndex, loadIndex, updateIndex, search} from './bg/nlp.jsx'
import {getUserInfo, updateQuery, timelineQuery, archToTweet, bookmarkToTweet, apiToTweet, getLatestTweets, getBookmarks} from './bg/twitterScout.jsx'


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

  const workerReady$ = workerMsg$.filter(propEq('type', 'ready')).map( x=>{return isNil(x) ? false : true}).toProperty(()=>false)
  workerReady$.onValue(()=>worker.postMessage({type:'getIndex'}))
  
  const db_prom = db.open(  )
  const _db = await db_prom
  const dbReady$ = Kefir.fromPromise(db_prom).map( x=>{return isNil(x) ? false : true}).toProperty(()=>false).ignoreEnd()

  const db_get = db.get(_db)
  const db_put = db.put(_db)
  const db_del = db.del(_db)
  const db_clear = () => db.clear(_db)

  // handles the return of a getIndex action from worker
  const getIndex$ = workerMsg$.filter(propEq('type','getIndex')).map(pipe(
    prop('index_json'),
    )).toProperty()
    
  // handles the return of a updateTweets action from worker
  const updateTweets$ = workerMsg$.filter(propEq('type','updateTweets')).map(pipe(
    prop('index_json'),
  )).toProperty()
  updateTweets$.onValue(_=>removeData(["temp_archive"]))

  const getDateFormatted = () => (new Date()).toLocaleString()
  const whenUpdated$ = updateTweets$.map(_=>getDateFormatted()).toProperty(getDateFormatted)

  // const index$ = Kefir.merge([getIndex$, updateTweets$]).map(loadIndex).toProperty(()=>_index)
  const index$ = Kefir.merge([getIndex$, updateTweets$]).map(loadIndex).toProperty()
  const getIndex = ()=>index$.currentValue()
  
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
  // userInfo$.skipDuplicates((a,b)=>a.id===b.id)//.log("user info")
  const getUsername = () => userInfo$.currentValue().screen_name

  // ready$ :: user_info -> Bool
  const ready$ = Kefir.combine([
    workerReady$,
    dbReady$,
    index$.map( x=>{return isNil(x) ? false : true}),
    userInfo$.map( x=>{return isNil(x.id) ? false : true}),
  ], (...args)=>reduce(and, true, args)).toProperty(()=>false)
  
  ready$.log('READY')
  const notReady$ = ready$.map(not)

  const howManyTweetsDb = async ()=> (await _db.getAllKeys('tweets')).length
  const whenLastUpdate = ()=>whenUpdated$.currentValue()
  const makeSyncDisplayMsg = async ()=>{
    const username = getUsername()
    const n_tweets = await howManyTweetsDb()
    const dateTime = await whenLastUpdate()
    return `Hi ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`
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
  
  // IMPURE  
  const cachedOptions = {oldVal:null, newVal:await getOptions()}

  // optionsChange$ :: change -> change
  const optionsChange$ = storageChange$.filter(x=>x.itemName=='options').toProperty(()=>cachedOptions)
  optionsChange$.log('options')

  // const isOptionSame = x=>(isNil(x.oldVal) && isNil(x.newVal)) || (x.oldVal[itemName] == x.newVal[itemName])
  const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )
  
  // makeOptionsObs :: String -> a
  const makeOptionObs = curry (itemName => 
    optionsChange$.filter(x=>!isOptionSame(itemName,x))
    .map(path([['newVal'], itemName]))
    .map(pipe(
      defaultTo(prop(itemName,defaultOptions()))))
    .map(inspect(`make option obs ${itemName}`))/*.toProperty()*/)

  // getRT$ :: () -> Bool
  const getRT$ = makeOptionObs('getRTs')
  // 
  // useBookmarks$ :: () -> Bool
  const useBookmarks$ = makeOptionObs('useBookmarks')
  // useReplies$ :: () -> Bool
  const useReplies$ = makeOptionObs('useReplies')
  
  const listSearchFilters = pipe(prop('newVal'), values, filter(propEq('type', 'searchFilter')), map(prop('name')), R.map(makeOptionObs),inspect('listsearchfilters'))
  const combineOptions = (...args) => pipe(inspect('combineopt'), reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)
  const filters = listSearchFilters(optionsChange$.currentValue())
  console.log('filters', {filters})
  // const searchFilters$ = Kefir.combine(
  //   filters,
  //   combineOptions
  //   ).toProperty()
  const searchFilters$ = Kefir.combine([getRT$, useBookmarks$, useReplies$],
    combineOptions
    ).toProperty()
  searchFilters$.log('search filters')
  // msg$ :: () -> msg
  // msg :: {type,...}
  // Listens to chrome runtime onMessage
  const msg$ = makeGotMsgObs().map(x=>x.m)
  msg$.log("bg message")



  const update_size = 200
  // reqUpdateTweets$ :: msg -> msg
  const reqUpdateTweets$ = msg$.filter(m => ['update-tweets', "new-tweet"].includes(m.type)).bufferWhileBy(notReady$).flatten()
  // IMPURE
  const fetchedUpdate$ = reqUpdateTweets$.flatMapLatest(_=>Kefir.fromPromise(updateQuery(getAuthInit, getUsername(), update_size)))

  // reqTimeline$ :: msg -> msg
  const reqTimeline$ = msg$.filter(m => ["update-timeline"].includes(m.type)).bufferWhileBy(notReady$).flatten()
  // IMPURE
  const fetchedTimeline$ = reqTimeline$.flatMapLatest(_=>Kefir.fromPromise(timelineQuery(getAuthInit, userInfo$.currentValue())))
  
  const archToTweets = map(archToTweet(userInfo$.currentValue()))

  const fetchedTweets$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$])//.map(toTweets)
  
  const reqSaveTweets = res=>{worker.postMessage({type:'updateTweets', index_json:getIndex().toJSON(), res:res})}

  fetchedTweets$.onValue(pipe(
    defaultTo([]),
    inspect('before totweets'),
    map(apiToTweet),
    inspect('after totweets'),
    reqSaveTweets,
  ))

  const reqArchiveLoad$ = msg$.filter(propSatisfies(x=>["temp-archive-stored", "load-archive"].includes(x), 'type'))
  const archiveLoadedTweets$ = reqArchiveLoad$.flatMapLatest(_=>Kefir.fromPromise(getData("temp_archive")))
  archiveLoadedTweets$.log('archive tweets')
  archiveLoadedTweets$.onValue(pipe(
    defaultTo([]),
    archToTweets,
    reqSaveTweets
  ))

  const notLoading$ = Kefir.combine([
    reqArchiveLoad$.map(_=>true), archiveLoadedTweets$.map(_=>false),
  ], (...args)=>reduce(and, true, args)).toProperty(()=>true)

  const syncLight$ = Kefir.combine([notLoading$, ready$], (...args)=>reduce(and, true, args)).toProperty(()=>false)
  syncLight$.onValue(setStg('sync'))

  const n_tweets_results = 20

  // getTweetsFromDbById :: [id] -> [tweets]
  const getTweetsFromDbById = async (ids) => await pipe(
    map(db_get('tweets')), 
    filter(x=>not(isNil(x))),
    (arr)=>Promise.all(arr),
  )(ids)

  const searchTweets = (query)=>search(searchFilters$.currentValue(), getUsername(), n_tweets_results, getIndex(), query)

  const searchQuery$ = msg$.filter(x=>x.type === "search").map(prop('query')).toProperty(()=>'')
  searchQuery$.log('searchQuery$')
  const reqSearch$ = Kefir.merge([ 
    searchQuery$,
    searchFilters$.map(()=>searchQuery$.currentValue()),
    ]).bufferWhileBy(notReady$).flatten()

  const makeMidSearchEvent = (_free) => {
    return new CustomEvent("midSearch", {detail: {free:_free}})
  }
  const emitMidSearch = (free) => {
    window.dispatchEvent(makeMidSearchEvent(free));
  }
  const isMidSearch$ = Kefir.fromEvents(window, 'midSearch').map(path(['detail', 'free'])).toProperty(()=>false)
  isMidSearch$.log('midSearch')

  // const searchResult$ = reqSearch$.skipUntilBy(query=>Kefir.fromPromise(searchTweets(query)))
  // TODO buffer and process last query
  const searchResult$ = reqSearch$.bufferWhileBy(isMidSearch$).map(last).flatMapFirst(query => {
    console.log(`searching for ${query}`); 
    emitMidSearch(true); 
    return Kefir.fromPromise(searchTweets(query))
  })
    
  searchResult$.onValue(
    pipe(
      getTweetsFromDbById,
      inspect('search res tweets'),
      andThen(pipe(
        setStg('search_results'),
        andThen(x=>{emitMidSearch(false); return x;})
        )),
    )
  )
  // 
  const getLatest = async _=>getLatestTweets(
    n_tweets_results, 
    searchFilters$.currentValue(), 
    db_get, 
    getUsername(), 
    await _db.getAllKeys('tweets')
  )
  // this exists for tests
  const latestTweets$ = Kefir.merge([
    searchFilters$,
    msg$.filter(propEq('type', "get-latest")),
    fetchedTweets$.delay(100), // TODO: this makes us set the latest tweets a little after every tweets update, but we should be doing it based on db updates instead.
  ]).bufferWhileBy(notReady$).flatten()
 
  latestTweets$.onValue(pipe(
    getLatest,
    andThen(
      setStg('latest_tweets'),
      )
    )
  )

  const reqRoboQuery$ = msg$.filter(x=>!isNil(x)).filter(propEq('type', 'robo-tweet')).bufferWhileBy(notReady$).flatten()
  reqRoboQuery$.log('robo query')
  reqRoboQuery$.onValue(m=>{
    setData({'roboSync':false});
    makeRoboRequest(getAuthInit,m).then(roboTweet=>
      setData({'roboTweet':roboTweet, 'roboSync':true})
      )
  })

  const reqBookmarks$ = msg$.filter(propEq('type','get-bookmarks')).bufferWhileBy(notReady$).flatten()
  const fetchedBookmarks$ = reqBookmarks$.flatMapLatest(_=>Kefir.fromPromise(getBookmarks(getAuthInit)))
  fetchedBookmarks$.log('bookmarks')
  const reqThread$ = null

  fetchedBookmarks$.onValue(pipe(
    defaultTo([]),
    map(bookmarkToTweet),
    reqSaveTweets,
  ))

  const stg_clear = ()=>chrome.storage.local.clear(()=>{
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
  })

  const reqClear$ = msg$.filter(m => m.type === "clear").bufferWhileBy(dbReady$.map(not)).flatten()
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
// 
main()