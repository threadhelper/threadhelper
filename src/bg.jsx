//using this temporarily but eventually probably should refactor away from classes
import "@babel/polyfill";
import * as browser from "webextension-polyfill";
import {getTwitterTabIds} from './utils/wutils.jsx'
import { flattenModule, inspect, toggleDebug, currentValue } from './utils/putils.jsx'
import * as R from 'ramda';
flattenModule(window,R)
import Kefir from 'kefir';
import {setStg, getData, setData, removeData, getOptions, getOption, defaultOptions, makeStorageObs, makeGotMsgObs, makeMsgStream} from './utils/dutils.jsx'
import {makeAuthObs} from './bg/auth.jsx'
import * as db from './bg/db.jsx'
import {initWorker} from './bg/workerBoss.jsx'
import {makeRoboRequest} from './bg/robo.jsx'
import {makeIndex, loadIndex, updateIndex, search} from './bg/nlp.jsx'
import {fetchUserInfo, updateQuery, tweetLookupQuery, timelineQuery, archToTweet, bookmarkToTweet, apiToTweet, getRandomSampleTweets, getLatestTweets, getBookmarks} from './bg/twitterScout.jsx'
// 
// Project business
var DEBUG = true;
toggleDebug(window, DEBUG)
Kefir.Property.prototype.currentValue = currentValue


// Stream clean up
const subscriptions = []
function rememberSub(sub){
  subscriptions.push(sub)
  return sub
}
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect}))

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
const makeMidSearchEvent = (_free) => {return new CustomEvent("midSearch", {detail: {free:_free}})} 
const emitMidSearch = (free) => {window.dispatchEvent(makeMidSearchEvent(free));}
// makeOptionsObs :: String -> a
const _makeOptionObs = curry (async (optionsChange$,itemName) => 
  optionsChange$.filter(x=>!isOptionSame(itemName,x))
  .map(path([['newVal'], itemName]))
  .map(pipe(
    defaultTo(prop(itemName,defaultOptions()))))
  .map(inspect(`make option obs ${itemName}`)).toProperty(await (async () => getOption(itemName)))
  )
const combineOptions = (...args) => pipe(reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)



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

    // Worker
  const worker = initWorker()
  const workerMsg$ = Kefir.fromEvents(worker,'message').map(prop('data'))
  const workerReady$ = workerMsg$.filter(propEq('type', 'ready')).map( x=>{return isNil(x) ? false : true}).toProperty(()=>false)
  const updateTweets$ = workerMsg$.filter(propEq('type','updateTweets'))    // handles the return of a updateTweets action from worker
  const removedTweet$ = workerMsg$.filter(propEq('type','removeTweets'))
  const addedTweet$ = workerMsg$.filter(propEq('type','addTweets'))
  const anyTweetUpdate$ = Kefir.merge([updateTweets$, addedTweet$, removedTweet$]).map(prop('index_json')).toProperty()
  const whenUpdated$ = anyTweetUpdate$.map(_=>getDateFormatted()).toProperty(getDateFormatted)
    // DB
  const db_prom = db.open(  ) // Promise, IMPURE
  const dbReady$ = Kefir.fromPromise(db_prom).map(pipe(isNil,not)).toProperty(()=>false).ignoreEnd()
    // Index
  const getIndex$ = workerMsg$.filter(propEq('type','getIndex')).map(prop('index_json'),).toProperty() // handles the return of a getIndex action from worker
  const index$ = Kefir.merge([getIndex$, anyTweetUpdate$]).map(loadIndex).toProperty()
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
    index$.map( x=>{return isNil(x) ? false : true}),
    userInfo$.map( x=>{return isNil(x.id) ? false : true}),
  ], (...args)=>reduce(and, true, args)).toProperty(()=>false) 
  const notReady$ = ready$.map(not)
  const syncDisplay$ = Kefir.merge([ready$, anyTweetUpdate$,]) // triggers sync display update// ready$ :: user_info -> Bool
    // Tweet API
  const reqUpdateTweets$ = msg$.filter(m => ['update-tweets', "new-tweet"].includes(m.type)).bufferWhileBy(notReady$).flatten() // reqUpdateTweets$ :: msg -> msg
  const reqTimeline$ = Kefir.merge([ msg$.filter(m => ["update-timeline"].includes(m.type)), csStart$,]).bufferWhileBy(notReady$).flatten()  // reqTimeline$ :: msg -> msg
  const reqBookmarks$ = Kefir.merge([msg$.filter(propEq('type','get-bookmarks')), csStart$]).bufferWhileBy(notReady$).flatten()
  const fetchedUpdate$ = reqUpdateTweets$.flatMapLatest(_=>Kefir.fromPromise(updateQuery(getAuthInit, getUsername(), update_size))) // IMPURE
  const fetchedTimeline$ = reqTimeline$.flatMapLatest(_=>Kefir.fromPromise(timelineQuery(getAuthInit, userInfo$.currentValue()))) // IMPURE
  const fetchedBookmarks$ = reqBookmarks$.flatMapLatest(_=>Kefir.fromPromise(getBookmarks(getAuthInit)))
  const fetchedTweets$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$])//.map(toTweets)
  const addBookmark$ = msg$.filter(propEq('type','add-bookmark')).bufferWhileBy(notReady$).flatten()
  // Local Tweet Processing
  const deleteTweet$ = msg$.filter(propEq('type','delete-tweet')).bufferWhileBy(notReady$).flatten()
  const removeBookmark$ = msg$.filter(propEq('type','remove-bookmark')).bufferWhileBy(notReady$).flatten()
  const reqRemoveTweet$ = Kefir.merge([deleteTweet$, removeBookmark$]).map(prop('id'))
  const reqArchiveLoad$ = msg$.filter(propSatisfies(x=>["temp-archive-stored", "load-archive"].includes(x), 'type')).bufferWhileBy(notReady$).flatten()
  const archiveLoadedTweets$ = reqArchiveLoad$.flatMapLatest(_=>Kefir.fromPromise(getData("temp_archive")))
    // Sync
  const notLoading$ = Kefir.combine([reqArchiveLoad$.map(_=>true), archiveLoadedTweets$.map(_=>false),], 
  (...args)=>reduce(and, true, args)).map(defaultTo(true)).toProperty(()=>true)
  const syncLight$ = Kefir.combine([notLoading$, ready$], (...args)=>reduce(and, true, args)).map(defaultTo(false)).toProperty(()=>false)
  const isMidSearch$ = Kefir.fromEvents(window, 'midSearch').map(path(['detail', 'free'])).toProperty(()=>false)
  // CS messages
  const searchQuery$ = msg$.filter(x=>x.type === "search").map(prop('query')).toProperty(()=>'')
  const reqRoboQuery$ = msg$.filter(x=>!isNil(x)).filter(propEq('type', 'robo-tweet')).bufferWhileBy(notReady$).flatten()
  const reqClear$ = msg$.filter(m => m.type === "clear").bufferWhileBy(dbReady$.map(not)).flatten()
  const logAuth$ = msg$.filter(m => m.type === 'log-auth')
  const getUserInfo$ = msg$.filter(m => m.type === 'get-user-info')
    // Search
  const reqSearch$ = Kefir.merge([ 
    searchQuery$,
    searchFilters$,//.filter(()=>searchQueryExists()).map(_=>searchQuery$.currentValue()),
    anyTweetUpdate$,//.filter(()=>searchQueryExists()).map(_=>searchQuery$.currentValue()),
    ]).bufferWhileBy(notReady$).flatten()
  const searchResult$ = reqSearch$.bufferWhileBy(isMidSearch$).map(last).flatMapFirst(query => {emitMidSearch(true); return Kefir.fromPromise(searchTweets(query))}) // IMPURE
  const getDefaultTweets$ = Kefir.merge([ // triggers getting and pushing default tweets
    searchFilters$.filter(_=>!searchQueryExists()),
    anyTweetUpdate$.filter(_=>!searchQueryExists()),
    msg$.filter(propEq('type', "get-latest")),
    fetchedTweets$.delay(100), // TODO: this makes us set the latest tweets a little after every tweets update, but we should be doing it based on db updates instead.
  ]).bufferWhileBy(notReady$).flatten()

  // Potential functions to import
    // Worker requests
  const reqSaveTweets = res=>{worker.postMessage({type:'updateTweets', index_json:getIndex().toJSON(), res:res})}
  const reqAddTweets = res=>{worker.postMessage({type:'addTweets', index_json:getIndex().toJSON(), res:res})}
  const reqRemoveTweets = ids=>{worker.postMessage({type:'removeTweets', index_json:getIndex().toJSON(), res:ids})}
    // DB functions
  const _db = await db_prom // idb object
  const db_get = db.get(_db)
  const db_put = db.put(_db)
  const db_del = db.del(_db)
  const db_clear = () => db.clear(_db)
    // chrome storage
  const clearTempArchive = _=>removeData(["temp_archive"])
  
  // Stream value getters
  const getIndex = ()=>index$.currentValue()
  const getAuthInit = ()=>makeInit(unique_auth$.currentValue())
  const getUserInfo = () => userInfo$.currentValue()
  const getUsername = () => userInfo$.currentValue().screen_name
  const whenLastUpdate = ()=>whenUpdated$.currentValue()
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
  const getTweetsFromDbById = async (ids) => await pipe( // getTweetsFromDbById :: [id] -> [tweets]
    map(db_get('tweets')), 
    filter(x=>not(isNil(x))),
    (arr)=>Promise.all(arr),
  )(ids)
  const searchTweets = (query)=>search(searchFilters$.currentValue(), getUsername(), n_tweets_results, getIndex(), query) // IMPURE, searchTweets :: String -> [tweet]
  const defaultTweetsFn = getRandomSampleTweets
  const getDefaultTweets = async _=>defaultTweetsFn( // IMPURE, getDefaultTweets :: -> [tweet]
    n_tweets_results, 
    searchFilters$.currentValue(), 
    db_get, 
    getUsername(), 
    await _db.getAllKeys('tweets')
  )
  const pushDefault = pipe(
    setStg('latest_tweets'),
    andThen(inspect('set latest'))
    )
  const reqRoboQueryEffects = m=>{setData({'roboSync':false}); makeRoboRequest(getAuthInit,m).then(roboTweet=> setData({'roboTweet':roboTweet, 'roboSync':true}))}
  
  // Effects from streams
    // Worker
  ready$.log('READY')
  csStart$.log('csStart')

  

  subObs(workerReady$, ()=>worker.postMessage({type:'getIndex'}))
  subObs(updateTweets$, clearTempArchive)
  subObs(addedTweet$, clearTempArchive)
  subObs(syncDisplay$, pipe(_=>makeSyncDisplayMsg(), andThen(setStg('syncDisplay'))))
  subObs(fetchedTweets$, storeApiTweets)
  subObs(addBookmark$, addBookmark)
  subObs(reqRemoveTweet$, id=>reqRemoveTweets([id]))
  subObs(archiveLoadedTweets$, pipe(defaultTo([]), map(archToTweet(getUserInfo)), reqAddTweets))
  subObs(syncLight$, setStg('sync'))
  subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))
  subObs(getDefaultTweets$, pipe(getDefaultTweets, andThen(pushDefault)) )
  subObs(reqRoboQuery$, reqRoboQueryEffects)
  subObs(fetchedBookmarks$, pipe(defaultTo([]), map(bookmarkToTweet), reqSaveTweets,), )
  subObs(reqClear$, ()=>{db_clear(); stg_clear();})
  subObs(logAuth$, ()=>console.log(getAuthInit()))  
  subObs(getUserInfo$, ()=>getUserInfo(getAuthInit))

  
  

  // const _sub_workerReady = workerReady$.observe({ value: ()=>worker.postMessage({type:'getIndex'}), }); rememberSub(_sub_workerReady);
  // const _sub_updateTweets = updateTweets$.observe({ value: clearTempArchive, }); rememberSub(_sub_updateTweets);  // TODO: I shold specify this for archive loading
  // const _sub_addedTweet = addedTweet$.observe({ value: clearTempArchive, }); rememberSub(_sub_addedTweet);
  // const _sub_syncDisplay = syncDisplay$.observe({ value: pipe(_=>makeSyncDisplayMsg(), andThen(setStg('syncDisplay'))), }); rememberSub(_sub_syncDisplay); // this could be made a promise in the stream definition
  //   // Tweets
  // const _sub_fetchedTweets = fetchedTweets$.observe({ value: storeApiTweets, }); rememberSub(_sub_fetchedTweets);
  // const _sub_addBookmark = addBookmark$.observe({ value: addBookmark, }); rememberSub(_sub_addBookmark);
  // const _sub_reqRemoveTweet = reqRemoveTweet$.observe({value: id=>reqRemoveTweets([id])}); rememberSub(_sub_reqRemoveTweet)
  // const _sub_archiveLoadedTweets = archiveLoadedTweets$.observe({ value: pipe(defaultTo([]), map(archToTweet(getUserInfo)), reqAddTweets), }); rememberSub(_sub_archiveLoadedTweets);
  // const _sub_syncLight = syncLight$.observe({ value: setStg('sync'), }); rememberSub(_sub_syncLight);
  // const _sub_searchResult = searchResult$.observe({ value: pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;}))))}); rememberSub(_sub_searchResult);
  // const _sub_getDefaultTweets = getDefaultTweets$.observe({ value: pipe(getDefaultTweets, andThen(pushDefault)) }); rememberSub(_sub_getDefaultTweets);
  // const _sub_reqRoboQuery = reqRoboQuery$.observe({ value: reqRoboQueryEffects, }); rememberSub(_sub_reqRoboQuery);
  // const _sub_fetchedBookmarks = fetchedBookmarks$.observe({ value: pipe(defaultTo([]), map(bookmarkToTweet), reqSaveTweets,), }); rememberSub(_sub_fetchedBookmarks);
  // const _sub_reqClear = reqClear$.observe({ value: ()=>{db_clear(); stg_clear();}, }); rememberSub(_sub_reqClear);
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