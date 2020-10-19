//using this temporarily but eventually probably should refactor away from classes
import "@babel/polyfill";
import * as browser from "webextension-polyfill";
import ReactGA from 'react-ga';
import { initGA, Event, Exception, PageView } from './utils/ga.jsx'
import PromiseWorker from 'promise-worker'
// import { getTwitterTabIds} from './utils/wutils.jsx'
import { flattenModule, inspect, toggleDebug, currentValue, nullFn, isExist } from './utils/putils.jsx'
import * as R from 'ramda';
flattenModule(window,R) 
import Kefir from 'kefir';
import { msgCS, setStg, getData, removeData, getOptions, getOption, makeStorageObs, makeStgItemObs, makeOptionObs, makeGotMsgObs, resetStorage} from './utils/dutils.jsx'
import { defaultOptions } from './utils/defaultStg.jsx'
import { makeAuthObs} from './bg/auth.jsx'
import * as db from './bg/db.jsx'
import { initWorker} from './bg/workerBoss.jsx'
// import { makeRoboRequest} from './bg/robo.jsx'
import { makeIndex, loadIndex, updateIndex, search} from './bg/nlp.jsx'
import { fetchUserInfo, updateQuery, tweetLookupQuery, timelineQuery, getRandomSampleTweets, getLatestTweets, getBookmarks, } from './bg/twitterScout.jsx'
import { validateTweet, archToTweet, bookmarkToTweet, apiToTweet} from './bg/tweetImporter.jsx'
// import { includes, isEmpty } from "lodash";


(function initAnalytics() {
  initGA();
})();
PageView('/background.html')

// Project business
var DEBUG = true;
toggleDebug(window, DEBUG)
Kefir.Property.prototype.currentValue = currentValue

// Stream clean up
const subscriptions = []
const rememberSub = (sub) => {subscriptions.push(sub); return sub}
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect}))

// Extension business
const twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
const makeOnInstalledEvent = (_busy) => {return new CustomEvent("midSearch", {detail: {busy:_busy}})} 
const emitOnInstalled = (busy) => {self.dispatchEvent(makeMidSearchEvent(busy));}


// Potential imports
  // misc
const update_size = 200
const n_tweets_results = 20
const getDateFormatted = () => (new Date()).toLocaleString()
const apiBookmarkToTweet = pipe(apiToTweet, assoc('is_bookmark', true))

const saferMap = fn => pipe( // saferMap :: [x] -> [x]
  defaultTo([]), 
  filter(pipe(isNil, not)), 
  filter(validateTweet), 
  inspect('about to map in saferMap'),
  map(fn)) // fn -> ([x] -> [fn(x)])
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
  // worker
const msgSomeWorker = curry( async (worker, msg) => worker.postMessage(msg)) // msgWorker :: worker -> msg -> Promise

  // db

  //chrome storage
const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )

  // events
// const makeMidSearchEvent = (_busy) => {return new CustomEvent("midSearch", {detail: {busy:_busy}})} 
// const emitMidSearch = (busy) => {window.dispatchEvent(makeMidSearchEvent(busy));}
// makeOptionsObs :: String -> a
const _makeOptionObs = curry (async (optionsChange$,itemName) => {
  const initVal = await getOption(itemName)
  return makeOptionObs(optionsChange$,itemName).toProperty(()=>initVal)
})
// makeStgObs :: String -> a
const _makeStgObs = curry (async (itemName) => {
  const initVal = await getData(itemName)
  return makeStgItemObs(itemName).toProperty(()=>initVal)
})
const combineOptions = (...args) => pipe(reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)
  // stream utils
const streamAnd = streams => Kefir.combine(streams, (...args)=>reduce(and, true, args))
const toVal = (val,stream) => stream.map(()=>val).toProperty(()=>val)
const promiseStream = (stream, promise_fn) => stream.flatMapLatest(x=>Kefir.fromPromise(promise_fn(x)))

export async function main(){  
  // Extension business
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.runtime.onInstalled.addListener(onInstalled);
  chrome.tabs.onUpdated.addListener(onTabUpdated);

  const worker = initWorker()
  const promiseWorker = new PromiseWorker(worker)

// Potential functions to import
  // Message builders
  const makeReqSearchMsg = (query)=>{return { // MakeReqSearchMsg :: Strnig -> msg
    type:'searchIndex', 
    filters:getFilters(),
    username: getUsername(),
    n_results: n_tweets_results,
    query: query,
  }}
  const makeReqDefaultTweetsMsg = () =>{return{ // makeReqDefaultTweetsMsg :: -> msg
    type:'getDefaultTweets',
    n_tweets: n_tweets_results, 
    filters: getFilters(), 
    // db_get, //send from worker 
    screen_name: getUsername(),
    // keys //send frm worker
  }}
    // Worker requests
  // const msgWorker = msgSomeWorker(worker)  // msgWorker :: msg -> Promise
  const msgPromiseWorker = msgSomeWorker(promiseWorker)
  const howManyTweetsDb = async _ => msgPromiseWorker({type:'howManyTweetsDb'}) // howManyTweetsDb :: () -> Promise int
  const updateTweets = async res => msgPromiseWorker({type:'updateTweets', res:res}) // updateTweets :: IMPURE [id] -> Promise ()
  const addTweets = async res => msgPromiseWorker({type:'addTweets', res:res}) // addTweets :: IMPURE [id] -> Promise ()
  const removeTweets = async ids => msgPromiseWorker({type:'removeTweets', res:ids}) // removeTweets :: IMPURE [id] -> Promise()
  const removeTweet = async id => removeTweets([id])
  const dbClear =  async () => msgPromiseWorker({type:'dbClear'}) // dbClear :: IMPURE () -> Promise ()
  const resetIndex =  async () => msgPromiseWorker({type:'resetIndex'}) // resetIndex :: IMPURE () -> Promise ()
  const resetData = _ => {console.log('[INFO] Resetting storage'); return Promise.all([resetStorage(), dbClear()]) }
  // const reqDbGet = ids =>{ msgPromiseWorker({type:'dbGet', ids:ids})} // reqDbGet :: IMPURE [id] -> Promise [tweet]
  const doSearch = async query => msgPromiseWorker(makeReqSearchMsg(query)); // doSearch :: IMPURE String -> Promise [tweet]
  const getDefaultTweets = async () => msgPromiseWorker(makeReqDefaultTweetsMsg())// getDefaultTweets :: IMPURE () -> Promise [tweet]
 
    // DB functions
    // chrome storage
  const clearTempArchive = _=>removeData(["temp_archive"])
  
  chrome.runtime.onInstalled.addListener(resetData);
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
    // const n_tweets = await howManyTweetsDb(_db)
    const n_tweets = await howManyTweetsDb()
    const dateTime = await whenLastUpdate()
    return `Hi ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`
  }


  // Define streams
    // Extension observers
      // Messages
  const msg$ = makeGotMsgObs().map(x=>x.m) // msg$ :: () -> msg // msg :: {type,...} // Listens to chrome runtime onMessage
  msg$.log('[DEBUG] msg$')
  const makeMsgStream = name => msg$.filter(propEq('type', name))
  const csStart$ = msg$.filter(propEq('type','cs-created'))
  const csNotReady$ = toVal(false, csStart$).toProperty(T)
      // Analytics
  const csGaEvent$ = makeMsgStream('gaEvent').map(prop('event'))
  const csGaException$ = makeMsgStream('gaException').map(prop('exception'))
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
      // Sync
  const workerMsg$ = Kefir.fromEvents(worker,'message').map(prop('data'))
  const workerReady$ = workerMsg$.filter(propEq('type', 'ready')).map( x=>{return isNil(x) ? false : true}).toProperty(F)

  
    // DB
  // const db_prom = db.open(  ) // Promise, IMPURE
  // const dbReady$ = Kefir.fromPromise(db_prom).map(pipe(isNil,not)).toProperty(F).ignoreEnd()
    // Auth
  const auth$ = makeAuthObs()
  const unique_auth$ = auth$.skipDuplicates(compareAuths).filter(validateAuth).toProperty() // unique_auth$ :: auth -> auth
  // const userInfo$ = unique_auth$.flatMap(_=>Kefir.fromPromise(fetchUserInfo(getAuthInit))).filter(x=>x.id!=null).toProperty(()=>{return {id:null}}) // IMPURE userInfo$ :: user_info
  const userInfo$ = promiseStream(unique_auth$, ()=>fetchUserInfo(getAuthInit)).filter(x=>x.id!=null).toProperty(()=>{return {id:null}}) // IMPURE userInfo$ :: user_info
  userInfo$.log('[DEBUG] userInfo$')
    // Ready, Sync
  const ready$ = Kefir.combine([ // ready$ :: Bool
    workerReady$,
    userInfo$.map( x=>{return isNil(x.id) ? false : true}),
  ], (...args)=>reduce(and, true, args)).toProperty(F) 
  const notReady$ = ready$.map(not) // notReady$ :: Bool
  const makeSafe = stream => stream.bufferWhileBy(notReady$).flatten() // makeSafe :: Stream -> Stream
  const makeMsgStreamSafe = name => makeSafe(makeMsgStream(name)) // makeMsgStreamSafe :: String -> Stream msg
  const errorFilter = stream => stream.filterErrors(e=>{
    console.log('[ERROR]', {stream, e});
    return false})
// 
  const reqClear$ = makeMsgStream("clear") // reqClear$ :: msg
  const dataReset$ = promiseStream(reqClear$, resetData) // dbCleared$ :: msg
  const initData$ = makeSafe(Kefir.merge([csStart$, ready$.bufferWhileBy(csNotReady$).flatten(), dataReset$])).throttle(1000) // initData$ ::  // second term exists bc if csStart arrives before ready, then event won't fire
  initData$.log('[DEBUG] initData$')
    // Tweet API
  const debugGetBookmarks$ = makeMsgStreamSafe('get-bookmarks') // debugGetBookmarks$ :: msg
  const updateTweets$ = makeMsgStreamSafe('update-tweets') // reqUpdatedTweets$ :: msg
  const updateTimeline$ = makeMsgStream("update-timeline") // reqUpdatedTweets$ :: msg
  
  const hasTimeline$ = (await _makeStgObs('hasTimeline'))
  hasTimeline$.log('[DEBUG] hasTimeline$')
  const missingTimeline$ = hasTimeline$.map(not)
  // missingTimeline$.log('missingTimeline$')
  // const reqTimeline$ = makeSafe(Kefir.merge([updateTimeline$, initData$]))  // reqTimeline$ :: msg
  const reqUpdatedTweets$ = makeSafe(Kefir.merge([updateTweets$, initData$.filterBy(hasTimeline$)])) // reqUpdatedTweets$ :: msg
  const reqTimeline$ = makeSafe(Kefir.merge([updateTimeline$, initData$.filterBy(missingTimeline$)])) // reqTimeline$ :: msg
  reqTimeline$.log('[DEBUG] reqTimeline$')
  const reqBookmarks$ = makeSafe(Kefir.merge([debugGetBookmarks$, initData$])) //.flatten() // reqBookmarks$ :: msg
  // reqBookmarks$.log('[DEBUG] reqBookmarks$')
  const reqAddBookmark$ = makeMsgStreamSafe('add-bookmark') // reqAddBookmark$ :: msg
  const reqBookmarkId$ = reqAddBookmark$.map(pipe(prop('id'), id=>[id])) // reqBookmarkId$ :: [id]
  const anyAPIReq$ = Kefir.merge([reqUpdatedTweets$, reqBookmarks$, reqTimeline$, reqAddBookmark$,]) // anyAPIReq$ :: msg
  anyAPIReq$.log('[DEBUG] anyAPIReq$')

  const fetchedUpdate$ = errorFilter(promiseStream(reqUpdatedTweets$, _ => updateQuery(getAuthInit, getUsername(), update_size))) // IMPURE fetchedUpdate$ :: [apiTweet]
  const fetchedTimeline$ = errorFilter(promiseStream(reqTimeline$, _ => timelineQuery(getAuthInit, getUserInfo()))) // IMPURE fetchedTimeline$ :: [apiTweet]
  const fetchedBookmarks$ = errorFilter(promiseStream(reqBookmarks$, _ => getBookmarks(getAuthInit))) // IMPURE fetchedBookmarks$ :: [apiBookmark]
  const fetchedBookmark$ = errorFilter(promiseStream(reqBookmarkId$, tweetLookupQuery(getAuthInit))) // IMPURE fetchedBookmark$ :: [apiTweet]

  const fetchedAnyAPIReq$ = errorFilter(Kefir.merge([fetchedUpdate$, fetchedTimeline$, fetchedBookmarks$, fetchedBookmark$,])) // fetchedAnyAPIReq$ :: [apiTweet]
  fetchedAnyAPIReq$.log('[DEBUG] fetchedAnyAPIReq$')
    // User submitted  
  const reqArchiveLoad$ = makeMsgStreamSafe("temp-archive-stored") // reqArchiveLoad$ :: msg
  reqArchiveLoad$.log('[DEBUG] reqArchiveLoad$')
  const extractTweetPropIfNeeded = ifElse(prop('tweet'), prop('tweet'), x=>x)
  const archiveLoadedTweets$ = errorFilter(promiseStream(reqArchiveLoad$, pipe(_=>getData("temp_archive"), andThen(map(extractTweetPropIfNeeded))))) // IMPURE archiveLoadedTweets$ :: [archTweet]
  archiveLoadedTweets$.log('[DEBUG] archiveLoadedTweets$')
  const archTweets$ = archiveLoadedTweets$.map(saferMap(archToTweet(getUserInfo)))
  
  const thUpdate$ = fetchedUpdate$.map(saferMap(apiToTweet)) // thUpdate$ :: [tweet] // update as threadhelper tweets 
  const thTweets$ = Kefir.merge([ // thTweets$ :: [tweet] // tweet :: threadhelper_tweet
    fetchedUpdate$.map(saferMap(apiToTweet)),
    fetchedTimeline$.map(saferMap(apiToTweet)),
    fetchedBookmarks$.map(saferMap(bookmarkToTweet)),
    fetchedBookmark$.map(saferMap(apiBookmarkToTweet)),
    archTweets$
  ]).filter(pipe(isEmpty, not))
  thTweets$.log('[DEBUG] thTweets$')
  const fetchedTweets$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$])//.map(toTweets) // fetchedTweets$ :: [apiTweet]
  // Local Tweet Processing
  const reqDeleteTweet$ = makeMsgStreamSafe('delete-tweet') // reqDeleteTweet$ :: msg
  const reqRemoveBookmark$ = makeMsgStreamSafe('remove-bookmark') // reqRemoveBookmark$ :: msg

  const idsToRemove$ = Kefir.merge([reqDeleteTweet$, reqRemoveBookmark$]).map(prop('id')) // idsToRemove$ :: id
  idsToRemove$.log('[DEBUG] idsToRemove$')
  
  // Worker returns  
  const addedTweets$ = errorFilter(promiseStream(thTweets$, addTweets)) // addedTweets$ :: msg
  addedTweets$.log('[DEBUG] addedTweets$')
  const removedTweet$ = errorFilter(promiseStream(idsToRemove$, removeTweet))  // removedTweet$ :: msg
  removedTweet$.log('[DEBUG] removedTweet$')
  const updatedTweets$ = errorFilter(promiseStream(thUpdate$, updateTweets)) // updatedTweets$ :: msg    // fetchedUpdate$ gets added for a secnod time because update is the way we find deleted recent tweets
  updatedTweets$.log('[DEBUG] updatedTweets$')
  
  const anyTweetUpdate$ = Kefir.merge([updatedTweets$, addedTweets$, removedTweet$, dataReset$]).toProperty()  // anyTweetUpdate$ :: msg
  anyTweetUpdate$.log('[DEBUG] anyTweetUpdate$')  
    // Misc
  const whenUpdated$ = anyTweetUpdate$.map(_=>getDateFormatted()).toProperty(getDateFormatted) // keeps track of when the last update to the tweet db was
  const syncDisplay$ = Kefir.merge([ready$, anyTweetUpdate$,]) // triggers sync display update// ready$ :: user_info -> Bool
  syncDisplay$.log('[DEBUG] syncDisplay$')
// 
    // Sync
  const anyWorkerReq$ = Kefir.merge([fetchedUpdate$, fetchedBookmarks$, fetchedTimeline$, reqRemoveBookmark$, idsToRemove$, reqArchiveLoad$]) // like with anyAPIReq$, these should only be emitted as the worker request is sent but oh well\
  const makeFlag = curry((def, stream0, stream1) => Kefir.merge([toVal(false, stream0), toVal(true, stream1)]).map(defaultTo(def)).toProperty(()=>def))
  const makeFlagT = makeFlag(true)
  const notArchLoading$ = makeFlagT(reqArchiveLoad$, archiveLoadedTweets$)
  notArchLoading$.log('[DEBUG] notArchLoading$')
  const notFetchingAPI$ = makeFlagT(anyAPIReq$, fetchedAnyAPIReq$)
  notFetchingAPI$.log('[DEBUG] notFetchingAPI$')
  const notMidWorkerReq$ = makeFlagT(anyWorkerReq$, anyTweetUpdate$)
  notMidWorkerReq$.log('[DEBUG] notMidWorkerReq$')
  const syncLight$ = streamAnd([notArchLoading$, notFetchingAPI$, notMidWorkerReq$, ready$]).map(defaultTo(false)).toProperty(F)
  syncLight$.log('[DEBUG] syncLight$')
  // CS messages
  const searchQuery$ = makeMsgStream("search").map(prop('query')).toProperty(()=>'')
  // const reqRoboQuery$ = msg$.filter(x=>!isNil(x)).filter(propEq('type', 'robo-tweet')).bufferWhileBy(notReady$).flatten()
  const logAuth$ = makeMsgStream('log-auth')
  const getUserInfo$ = makeMsgStream('get-user-info')
    // Search
  const reqSearch$ = makeSafe(Kefir.merge([ 
    searchQuery$,
    searchQuery$.sampledBy(searchFilters$).filter((isExist)),
    searchQuery$.sampledBy(anyTweetUpdate$).filter((isExist)),
    ]))
    // doSearch
  const reqDefaultTweets$ = makeSafe(Kefir.merge([  // reqDefaultTweets$ :: msg | String // triggers getting and pushing default tweets
    searchQuery$.sampledBy(searchFilters$),//.filter(pipe(isExist,R.not)),
    searchQuery$.sampledBy(anyTweetUpdate$),//.filter(pipe(isExist,R.not)),
    makeMsgStream("get-latest"),
    anyTweetUpdate$,
  ])).bufferWhileBy(notReady$).map(last).throttle(1000) //.last()
  reqDefaultTweets$.log('[DEBUG] reqDefaultTweets$')

  
    // Worker returns
  const gotDefaultTweets$ = promiseStream(reqDefaultTweets$, getDefaultTweets) // gotDefaultTweets$ :: [tweets]
  // const filteredDefaultTweets$
  const searchResults$ = promiseStream(reqSearch$, doSearch) // searchResults$ :: [tweets]

  // const reqRoboQueryEffects = m=>{setData({'roboSync':false}); makeRoboRequest(getAuthInit,m).then(roboTweet=> setData({'roboTweet':roboTweet, 'roboSync':true}))}
  
  const checkGotTimeline = timeline => {
    // console.log('[DEBUG] checkGotTimeline',{timeline_len:timeline.length, user_info: getUserInfo(), total_tweets:getUserInfo().statuses_count}); 
    return (timeline.length > 3000 || timeline.length >= getUserInfo().statuses_count-1)}
  // Effects from streams
    // Ready / sync
  ready$.log('[INFO] READY')
  csStart$.log('[INFO] csStart')
  csGaEvent$.log('[DEBUG] csGaEvent$')
  subObs(csGaEvent$, pipe(values,x=>Event(...x)))
  subObs(csGaException$, pipe(values,x=>Exception(...x)))
  workerReady$.log('[INFO] workerReady')
  subObs(syncDisplay$, pipe(_=>makeSyncDisplayMsg(), andThen(setStg('syncDisplay')))) // update sync display
  subObs(syncLight$, setStg('sync'))
    // Worker actions
      // Import tweets
  subObs(fetchedTweets$, nullFn) // happens after fetching tweets from twitter API
  subObs(fetchedBookmarks$, nullFn)  // happens on requests to fetch all bookmarks
  subObs(fetchedTimeline$, pipe(when(checkGotTimeline, ()=>setStg('hasTimeline', true))))
  subObs(idsToRemove$, nullFn) // happens on a request to remove a tweet from DB
  subObs(reqAddBookmark$, nullFn) // happens on requests to add a bookmark
  subObs(archiveLoadedTweets$, clearTempArchive) // happens after tweets are updated by worker, should only happen after loading archive
      // Search
  // subObs(reqSearch$, doSearch)
  subObs(reqDefaultTweets$, nullFn)
  subObs(searchResults$, pipe(prop('res'), setStg('search_results')))
  // subObs(filteredSearchResults$, pipe(prop('res'), setStg('search_results')))
  subObs(gotDefaultTweets$, pipe(prop('res'), setStg('latest_tweets')))
  // subObs(filteredDefaultTweets$, pipe(prop('res'), setStg('latest_tweets')))
  // bg search
  // subObs(searchResult$, pipe(getTweetsFromDbById, andThen(pipe(setStg('search_results'), andThen(x=>{emitMidSearch(false); return x;})))))
  // subObs(reqDefaultTweets$, pipe(getDefaultTweets, andThen(setStg('latest_tweets'))) )
    // DB
  subObs(reqClear$, nullFn)
  // searchQuery
    // Robo
  // subObs(reqRoboQuery$, reqRoboQueryEffects)
    // Debug
  subObs(logAuth$, ()=>console.log(getAuthInit()))  
  subObs(getUserInfo$, ()=>getUserInfo(getAuthInit))
  // subObs(searchQuery$, nullFn)
  subObs(searchFilters$, nullFn)
  // searchFilters$.log('[DEBUG] searchFilters$')
}

//  


let twitterTabs = []// twitterTabs :: int

function onInstalled() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: { urlContains: "twitter.com" }})],
        actions: [new chrome.declarativeContent.ShowPageAction()]}]);});
  // twitterTabs.forEach(x=>chrome.tabs.reload(x)) // this shouldn't work bc installed is the first thing that happens
}

// TODO emit to active tab
function onTabActivated(activeInfo){
  chrome.tabs.get(activeInfo.tabId, function(tab){
    if(tab.url != null){
      try{if (tab.url.match(twitter_url)) {
          // console.log(`checking for reload: ${equals(twitterTabs[0],tab.id)}`,{twitterTabs, tabid:tab.id})
          if(!twitterTabs.includes(tab.id)){
            twitterTabs.push(tab.id)
          }}
      }catch(e){
        console.log(e)
      }}});}

function onTabUpdated(tabId, change, tab){
  if (tab.active && change.url) {
    if (change.url.match(twitter_url)){
      msgCS(tab.id,{type:"tab-change-url", url:change.url, cs_id: tab.id})
    }
  }
}    
// 
main();