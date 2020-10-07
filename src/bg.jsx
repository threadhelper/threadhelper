//using this temporarily but eventually probably should refactor away from classes
import "@babel/polyfill";
import * as browser from "webextension-polyfill";
import {getTwitterTabIds} from './utils/wutils.jsx'
import { flattenModule, inspect, toggleDebug, currentValue, nullFn } from './utils/putils.jsx'
import * as R from 'ramda';
flattenModule(window,R)
import Kefir from 'kefir';
import {msgCS, setStg, getData, setData, removeData, getOptions, getOption, defaultOptions, makeStorageObs, makeGotMsgObs, makeMsgStream} from './utils/dutils.jsx'
import {makeAuthObs} from './bg/auth.jsx'
import * as db from './bg/db.jsx'
import {initWorker} from './bg/workerBoss.jsx'
import {makeRoboRequest} from './bg/robo.jsx'
import {makeIndex, loadIndex, updateIndex, search} from './bg/nlp.jsx'
import {fetchUserInfo, updateQuery, tweetLookupQuery, timelineQuery, archToTweet, bookmarkToTweet, apiToTweet, getRandomSampleTweets, getLatestTweets, getBookmarks} from './bg/twitterScout.jsx'

// Project business
var DEBUG = true;
toggleDebug(window, DEBUG)
Kefir.Property.prototype.currentValue = currentValue


// Stream clean up
const subscriptions = []
const rememberSub = (sub) => {subscriptions.push(sub); return sub}
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect}))
// 
// Extension business
const twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

// Potential imports
  // misc
const update_size = 200
const n_tweets_results = 20
const getDateFormatted = () => (new Date()).toLocaleString()
const isExist = x=>!(isNil(x) || isEmpty(x))
  // auth
const makeInit = (auth)=>{
  return {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
}
const compareAuths = (a,b)=>{return a.authorization == b.authorization && a.csrfToken == b.csrfToken}
const validateAuth = x=>(x.authorization != null && x.csrfToken != null)
  // db
const howManyTweetsDb = async (_db)=> (await _db.getAllKeys('tweets')).length
  //chrome storage
const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )
const stg_clear = ()=>chrome.storage.local.clear(()=>{
  var error = chrome.runtime.lastError;
  if (error) {
      console.error(error);
  }
})
  // events
// const makeMidSearchEvent = (_busy) => {return new CustomEvent("midSearch", {detail: {busy:_busy}})} 
// const emitMidSearch = (busy) => {window.dispatchEvent(makeMidSearchEvent(busy));}
// makeOptionsObs :: String -> a
const _makeOptionObs = curry (async (optionsChange$,itemName) => {
  const initVal = await getOption(itemName)
  return optionsChange$.filter(x=>!isOptionSame(itemName,x))
  .map(path([['newVal'], itemName]))
  .map(pipe(
    defaultTo(prop(itemName,defaultOptions()))))
  .map(inspect(`make option obs ${itemName}`)).toProperty(()=>initVal)
})
const combineOptions = (...args) => pipe(reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)
  // stream utils
const streamAnd = streams => Kefir.combine(streams, (...args)=>reduce(and, true, args))
const toVal = (val,stream) => stream.map(()=>val).toProperty(()=>val)

export async function main(){  
  // Extension business
  chrome.runtime.onInstalled.addListener(onInstalled);
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.tabs.onUpdated.addListener(onTabUpdated);

  // Define streams
    // Extension observers
      // Messages
  const msg$ = makeGotMsgObs().map(x=>x.m) // msg$ :: () -> msg // msg :: {type,...} // Listens to chrome runtime onMessage
  const csStart$ = msg$.filter(propEq('type','cs-created'))
  const csNotReady$ = toVal(false, csStart$).toProperty(()=>true)
      // Storage
  const storageChange$ = makeStorageObs() // storageChange$ :: () -> change  // change :: {itemName, oldVal, newVal} // Listens to changes in chrome.storage
  const optionsChange$ = storageChange$.filter(x=>x.itemName=='options') // optionsChange$ :: change -> change //.toProperty(await (async ()=>{return {oldVal:null, newVal:await getOptions()}}))
  const makeOptionObs = _makeOptionObs(optionsChange$) // Function
        // Search filters
  const getRT$ = await makeOptionObs('getRTs') // getRT$ :: () -> Bool
  const useBookmarks$ = await makeOptionObs('useBookmarks') // useBookmarks$ :: () -> Bool
  const useReplies$ = await makeOptionObs('useReplies') // useReplies$ :: () -> Bool
  const searchFilters$ = Kefir.combine([getRT$, useBookmarks$, useReplies$], combineOptions).toProperty()
  // ! IMPORTANT ! Generalized for filters, untested:
  /*
  const listSearchFilters = pipe(prop('newVal'), values, filter(propEq('type', 'searchFilter')), map(prop('name')), R.map(await makeOptionObs),inspect('listsearchfilters'))
  const filters = listSearchFilters(optionsChange$.currentValue())
  const searchFilters$ = Kefir.combine(
    filters,
    combineOptions
    ).toProperty()
  */
  // 
    // Worker
  const worker = initWorker()
  const workerMsg$ = Kefir.fromEvents(worker,'message').map(prop('data'))
  const workerReady$ = workerMsg$.filter(propEq('type', 'ready')).map( x=>{return isNil(x) ? false : true}).toProperty(()=>false)
  const updatedTweets$ = workerMsg$.filter(propEq('type','updateTweets'))    // handles the return of a updateTweets action from worker
  const removedTweet$ = workerMsg$.filter(propEq('type','removeTweets'))
  const addedTweet$ = workerMsg$.filter(propEq('type','addTweets'))
  const searchedIndex$ = workerMsg$.filter(propEq('type','searchIndex'))
  const gotDefaultTweets$ = workerMsg$.filter(propEq('type','getDefaultTweets'))
  // const anyTweetUpdate$ = Kefir.merge([updatedTweets$, addedTweet$, removedTweet$]).map(prop('index_json')).toProperty()
  const anyTweetUpdate$ = Kefir.merge([updatedTweets$, addedTweet$, removedTweet$]).toProperty()
  const whenUpdated$ = anyTweetUpdate$.map(_=>getDateFormatted()).toProperty(getDateFormatted) // keeps track of when the last update to the tweet db was

    // DB
  const db_prom = db.open(  ) // Promise, IMPURE
  const dbReady$ = Kefir.fromPromise(db_prom).map(pipe(isNil,not)).toProperty(()=>false).ignoreEnd()
    // Index
  // const getIndex$ = workerMsg$.filter(propEq('type','getIndex')).map(prop('index_json'),).toProperty() // handles the return of a getIndex action from worker
  // const index$ = Kefir.merge([getIndex$, anyTweetUpdate$]).map(loadIndex).toProperty()
    // Auth
  const auth$ = makeAuthObs()
  const unique_auth$ = auth$ // unique_auth$ :: auth -> auth
  .skipDuplicates(compareAuths)
  .filter(validateAuth)
  .toProperty()
  const userInfo$ = unique_auth$.flatMap(_=>Kefir.fromPromise(fetchUserInfo(getAuthInit))).filter(x=>x.id!=null).toProperty(()=>{return {id:null}}) // IMPURE userInfo$ :: auth -> user_info
    // Ready, Sync
  const ready$ = Kefir.combine([ // ready$ :: user_info -> Bool
    workerReady$,
    dbReady$,
    // index$.map( x=>{return isNil(x) ? false : true}),
    userInfo$.map( x=>{return isNil(x.id) ? false : true}),
  ], (...args)=>reduce(and, true, args)).toProperty(()=>false) 
  const notReady$ = ready$.map(not) 
  const initData$ = Kefir.merge([csStart$, ready$.bufferWhileBy(csNotReady$)]) // second term exists bc if csStart arrives before ready, then event won't fire
  const syncDisplay$ = Kefir.merge([ready$, anyTweetUpdate$,]) // triggers sync display update// ready$ :: user_info -> Bool
    // Tweet API
  const debugGetBookmarks$ = msg$.filter(propEq('type','get-bookmarks'))
  const reqUpdatedTweets$ = msg$.filter(m => ['update-tweets', "new-tweet"].includes(m.type)).bufferWhileBy(notReady$).flatten() // reqUpdatedTweets$ :: msg -> msg
  const reqTimeline$ = Kefir.merge([ msg$.filter(m => ["update-timeline"].includes(m.type)), initData$]).bufferWhileBy(notReady$).flatten()  // reqTimeline$ :: msg -> msg
  reqTimeline$.log('reqTimeline$')
  const reqBookmarks$ = Kefir.merge([debugGetBookmarks$, initData$]).bufferWhileBy(notReady$).flatten()
  reqBookmarks$.log('reqBookmarks$')
  const fetchedUpdate$ = reqUpdatedTweets$.flatMapLatest(_=>Kefir.fromPromise(updateQuery(getAuthInit, getUsername(), update_size))) // IMPURE
  const fetchedTimeline$ = reqTimeline$.flatMapLatest(_=>Kefir.fromPromise(timelineQuery(getAuthInit, userInfo$.currentValue()))) // IMPURE
  const fetchedBookmarks$ = reqBookmarks$.flatMapLatest(_=>Kefir.fromPromise(getBookmarks(getAuthInit)))
  const fetchedTweets$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$])//.map(toTweets)
  const addBookmark$ = msg$.filter(propEq('type','add-bookmark')).bufferWhileBy(notReady$).flatten()
  const anyAPIReq$ = Kefir.merge([reqUpdatedTweets$, reqBookmarks$, reqTimeline$, addBookmark$,]) //this leaving early, should leave at the same time the request leaves
  const fetchedAnyAPIReq$ = Kefir.merge([fetchedUpdate$, fetchedBookmarks$, fetchedTimeline$,])
  // Local Tweet Processing
  const deleteTweet$ = msg$.filter(propEq('type','delete-tweet')).bufferWhileBy(notReady$).flatten()
  const removeBookmark$ = msg$.filter(propEq('type','remove-bookmark')).bufferWhileBy(notReady$).flatten()
  const reqRemoveTweet$ = Kefir.merge([deleteTweet$, removeBookmark$]).map(prop('id'))
  const reqArchiveLoad$ = msg$.filter(propSatisfies(x=>["temp-archive-stored", "load-archive"].includes(x), 'type')).bufferWhileBy(notReady$).flatten()
  const archiveLoadedTweets$ = reqArchiveLoad$.flatMapLatest(_=>Kefir.fromPromise(getData("temp_archive")))
    // Sync
  const anyWorkerReq$ = Kefir.merge([fetchedUpdate$, fetchedBookmarks$, fetchedTimeline$, removeBookmark$, reqRemoveTweet$, reqArchiveLoad$]) // like with anyAPIReq$, these should only be emitted as the worker request is sent but oh well
  const notArchLoading$ = Kefir.merge([toVal(false, reqArchiveLoad$), toVal(true, archiveLoadedTweets$)]).map(defaultTo(true)).toProperty(()=>true)
  const notFetchingAPI$ = Kefir.merge([toVal(false, anyAPIReq$), toVal(true, fetchedAnyAPIReq$)]).map(defaultTo(true)).toProperty(()=>true)
  const notMidWorkerReq$ = Kefir.merge([toVal(false, anyWorkerReq$), toVal(true, anyTweetUpdate$)]).map(defaultTo(true)).toProperty(()=>true)
  const syncLight$ = streamAnd([notArchLoading$, notFetchingAPI$, notMidWorkerReq$, ready$]).map(defaultTo(false)).toProperty(()=>false)
  // CS messages
  const searchQuery$ = msg$.filter(x=>x.type === "search").map(prop('query')).toProperty(()=>'')
  const reqRoboQuery$ = msg$.filter(x=>!isNil(x)).filter(propEq('type', 'robo-tweet')).bufferWhileBy(notReady$).flatten()
  const reqClear$ = msg$.filter(m => m.type === "clear").bufferWhileBy(dbReady$.map(not)).flatten()
  const logAuth$ = msg$.filter(m => m.type === 'log-auth')
  const getUserInfo$ = msg$.filter(m => m.type === 'get-user-info')
    // Search
  const reqSearch$ = Kefir.merge([ 
    searchQuery$,
    searchFilters$.map(_=>searchQuery$.currentValue()),//.filter(()=>searchQueryExists()).map(_=>searchQuery$.currentValue()),
    anyTweetUpdate$.map(_=>searchQuery$.currentValue()),//.filter(()=>searchQueryExists()).map(_=>searchQuery$.currentValue()),
    ]).bufferWhileBy(notReady$).flatten()
  // const searchResult$ = reqSearch$.bufferWhileBy(isMidSearch$).map(last).flatMapFirst(makeQueryObs) // IMPURE
  const getDefaultTweets$ = Kefir.merge([ // triggers getting and pushing default tweets
    searchFilters$.filter(_=>!searchQueryExists()),
    anyTweetUpdate$.filter(_=>!searchQueryExists()),
    msg$.filter(propEq('type', "get-latest")),
    fetchedTweets$.delay(100), // TODO: this makes us set the latest tweets a little after every tweets update, but we should be doing it based on db updates instead.
  ]).throttle(1000).bufferWhileBy(notReady$).flatten()
// 
  // Potential functions to import
    // Worker requests
  // const reqSaveTweets = res=>{worker.postMessage({type:'updateTweets', index_json:getIndex().toJSON(), res:res})}
  // const reqAddTweets = res=>{worker.postMessage({type:'addTweets', index_json:getIndex().toJSON(), res:res})}
  // const reqRemoveTweets = ids=>{worker.postMessage({type:'removeTweets', index_json:getIndex().toJSON(), res:ids})}
  const reqSaveTweets = res=>{worker.postMessage({type:'updateTweets', res:res})}
  const reqAddTweets = res=>{worker.postMessage({type:'addTweets', res:res})}
  const reqRemoveTweets = ids=>{worker.postMessage({type:'removeTweets', res:ids})}
  const reqDbClear = ids=>{worker.postMessage({type:'dbClear'})}
  // const reqDbGet = ids=>{worker.postMessage({type:'dbGet', ids:ids})}
  const makeReqSearchMsg = (query)=>{return {
    type:'searchIndex', 
    filters:getFilters(),
    username: getUsername(),
    n_results: n_tweets_results,
    query: query,
  }}
  const reqSearch = query=>{worker.postMessage(makeReqSearchMsg(query));}
  const makeReqDefaultTweetsMsg = () =>{return{
    type:'getDefaultTweets',
    n_tweets: n_tweets_results, 
    filters: getFilters(), 
    // db_get, //send from worker 
    screen_name: getUsername(),
    // keys //send frm worker
  }}
  const reqGetDefaultTweets = ids=>{worker.postMessage(makeReqDefaultTweetsMsg())}

    // DB functions
  const _db = await db_prom // idb object
    // chrome storage
  const clearTempArchive = _=>removeData(["temp_archive"])
  // 
  // Stream value getters
  // const getIndex = ()=>index$.currentValue()
  const getAuthInit = ()=>makeInit(unique_auth$.currentValue())
  const getUserInfo = () => userInfo$.currentValue()
  const getUsername = () => userInfo$.currentValue().screen_name
  const whenLastUpdate = ()=>whenUpdated$.currentValue()
  const getFilters = ()=>searchFilters$.currentValue()

  const makeSyncDisplayMsg = async ()=>{  // Potential import
    const username = getUsername()
    const n_tweets = await howManyTweetsDb(_db)
    const dateTime = await whenLastUpdate()
    return `Hi ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`
  }
  const searchQueryExists = ()=>isExist(searchQuery$.currentValue())
  // Aux functions 
  // Effect functions
  const storeApiTweets = pipe(defaultTo([]), map(apiToTweet), reqSaveTweets,)
  const storeBookmarks = pipe(map(apiToTweet), map(assoc('is_bookmark', true)), reqAddTweets)
  const addBookmark = pipe( prop('id'), x=>[x], tweetLookupQuery(getAuthInit), andThen(storeBookmarks) )
  // const getTweetsFromDbById = async (ids) => await pipe( // getTweetsFromDbById :: [id] -> [tweets]
  //   map(db_get('tweets')), 
  //   filter(x=>not(isNil(x))),
  //   (arr)=>Promise.all(arr),
  // )(ids)
  // const searchTweets = query=>search(getFilters(), getUsername(), n_tweets_results, getIndex(), query) // IMPURE, searchTweets :: String -> [tweet]
  // const makeQueryObs = query => {emitMidSearch(true); return Kefir.fromPromise(searchTweets(query))} // IMPURE, emits "midSearch" event, makeQueryObs:: String -> Observer
  // const defaultTweetsFn = getRandomSampleTweets
  // const getDefaultTweets = async _=>defaultTweetsFn( // IMPURE, getDefaultTweets :: -> [tweet]
  //   n_tweets_results, 
  //   getFilters(), 
  //   db_get, 
  //   getUsername(), 
  //   await _db.getAllKeys('tweets')
  // )
  // const pushDefault = pipe(
  //   setStg('latest_tweets'),
  //   andThen(inspect('set latest'))
  //   )
  const reqRoboQueryEffects = m=>{setData({'roboSync':false}); makeRoboRequest(getAuthInit,m).then(roboTweet=> setData({'roboTweet':roboTweet, 'roboSync':true}))}
  
  // Effects from streams
    // Ready / sync
  ready$.log('READY')

  csStart$.log('csStart')
  workerReady$.log('workerReady')
  // workerMsg$.log('workerMsg$')
  // msg$.log('msg$')
  syncLight$.log('syncLight')
  // subObs(workerReady$, ()=>worker.postMessage({type:'getIndex'}))
  subObs(syncDisplay$, pipe(_=>makeSyncDisplayMsg(), andThen(setStg('syncDisplay')))) // update sync display
  subObs(syncLight$, setStg('sync'))
    // Worker actions
      // Import tweets
  subObs(fetchedTweets$, storeApiTweets) // happens after fetching tweets from twitter API
  subObs(reqRemoveTweet$, id=>reqRemoveTweets([id])) // happens on a request to remove a tweet from DB
  subObs(archiveLoadedTweets$, pipe(defaultTo([]), map(archToTweet(getUserInfo)), reqAddTweets)) // happens after loading temp_archive from stg, from file. Action imports it
  subObs(addBookmark$, addBookmark) // happens on requests to add a bookmark
  subObs(fetchedBookmarks$, pipe(defaultTo([]), map(bookmarkToTweet), reqSaveTweets,), )  // happens on requests to fetch all bookmarks
  subObs(updatedTweets$, clearTempArchive) // happens after tweets are updated by worker
  subObs(addedTweet$, clearTempArchive) // happens after tweets are added by worker
      // Search
  subObs(reqSearch$, reqSearch)
  subObs(searchedIndex$, pipe(prop('res'), setStg('search_results')))
  subObs(getDefaultTweets$, reqGetDefaultTweets)
  subObs(gotDefaultTweets$, pipe(prop('res'), setStg('latest_tweets')))
  // bg search
  // subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))
  // subObs(getDefaultTweets$, pipe(getDefaultTweets, andThen(setStg('latest_tweets'))) )
    // DB
  subObs(reqClear$, ()=>{reqDbClear(); stg_clear();})
  // subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))
  // subObs(getDefaultTweets$, pipe(getDefaultTweets, andThen(pushDefault)) )
  // searchQuery
    // Robo
  subObs(reqRoboQuery$, reqRoboQueryEffects)
    // Debug
  subObs(logAuth$, ()=>console.log(getAuthInit()))  
  subObs(getUserInfo$, ()=>getUserInfo(getAuthInit))
  // subObs(searchQuery$, nullFn)
  // searchQuery$.log('searchQuery$')
  searchFilters$.log('searchFilters$')
}

 



function onInstalled() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: { urlContains: "twitter.com" }})],
        actions: [new chrome.declarativeContent.ShowPageAction()]}]);});}

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
      msgCS(tab.id,{type:"tab-change-url", url:change.url, cs_id: tab.id})
    }
  }
}    
// 
main()