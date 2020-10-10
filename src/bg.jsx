//using this temporarily but eventually probably should refactor away from classes
import "@babel/polyfill";
import * as browser from "webextension-polyfill";
import  PromiseWorker from 'promise-worker'
import { getTwitterTabIds} from './utils/wutils.jsx'
import { flattenModule, inspect, toggleDebug, currentValue, nullFn } from './utils/putils.jsx'
import * as R from 'ramda';
flattenModule(window,R) 
import Kefir from 'kefir';
import { msgCS, setStg, getData, removeData, getOptions, getOption, makeStorageObs, makeGotMsgObs, resetStorage} from './utils/dutils.jsx'
import { defaultOptions } from './utils/defaultStg.jsx'
import { makeAuthObs} from './bg/auth.jsx'
import * as db from './bg/db.jsx'
import { initWorker} from './bg/workerBoss.jsx'
// import { makeRoboRequest} from './bg/robo.jsx'
import { makeIndex, loadIndex, updateIndex, search} from './bg/nlp.jsx'
import { fetchUserInfo, updateQuery, tweetLookupQuery, timelineQuery, archToTweet, bookmarkToTweet, apiToTweet, getRandomSampleTweets, getLatestTweets, getBookmarks} from './bg/twitterScout.jsx'

// Project business
var DEBUG = true;
toggleDebug(window, DEBUG)
Kefir.Property.prototype.currentValue = currentValue

// 
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
const saferMap = fn => pipe(defaultTo([]), map(fn)) // fn -> ([x] -> [fn(x)])
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
  return optionsChange$.filter(x=>!isOptionSame(itemName,x))
  .map(path([['newVal'], itemName]))
  .map(defaultTo(prop(itemName,defaultOptions())))
  // .map(inspect(`make option obs ${itemName}`))
  .toProperty(()=>initVal)
})
const combineOptions = (...args) => pipe(reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)
  // stream utils
const streamAnd = streams => Kefir.combine(streams, (...args)=>reduce(and, true, args))
const toVal = (val,stream) => stream.map(()=>val).toProperty(()=>val)
const promiseStream = (stream, promise_fn) => stream.flatMapLatest(x=>Kefir.fromPromise(promise_fn(x)))

export async function main(){  
  // Extension business
  chrome.runtime.onInstalled.addListener(onInstalled);
  chrome.tabs.onActivated.addListener(onTabActivated);
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
  const resetData = _ => Promise.all([resetStorage(), dbClear()])
  // const reqDbGet = ids =>{ msgPromiseWorker({type:'dbGet', ids:ids})} // reqDbGet :: IMPURE [id] -> Promise [tweet]
  const doSearch = async query => msgPromiseWorker(makeReqSearchMsg(query)); // doSearch :: IMPURE String -> Promise [tweet]
  const getDefaultTweets = async () => msgPromiseWorker(makeReqDefaultTweetsMsg())// getDefaultTweets :: IMPURE () -> Promise [tweet]
 
    // DB functions
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
    // const n_tweets = await howManyTweetsDb(_db)
    const n_tweets = await howManyTweetsDb()
    const dateTime = await whenLastUpdate()
    return `Hi ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`
  }


  // Define streams
    // Extension observers
      // Messages
  const msg$ = makeGotMsgObs().map(x=>x.m) // msg$ :: () -> msg // msg :: {type,...} // Listens to chrome runtime onMessage
  const makeMsgStream = name => msg$.filter(propEq('type', name))
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
      // Sync
  const workerMsg$ = Kefir.fromEvents(worker,'message').map(prop('data'))
  const workerReady$ = workerMsg$.filter(propEq('type', 'ready')).map( x=>{return isNil(x) ? false : true}).toProperty(()=>false)
      // IO
  // const updatedTweets$ = workerMsg$.filter(propEq('type','updateTweets'))    // handles the return of a updateTweets action from worker
  // const removedTweet$ = workerMsg$.filter(propEq('type','removeTweets'))
  // const addedTweets$ = workerMsg$.filter(propEq('type','addTweets'))
  // const anyTweetUpdate$ = Kefir.merge([updatedTweets$, addedTweets$, removedTweet$]).toProperty() 
  // const gotDefaultTweets$ = workerMsg$.filter(propEq('type','getDefaultTweets'))
  // const searchedIndex$ = workerMsg$.filter(propEq('type','searchIndex'))


  
    // DB
  // const db_prom = db.open(  ) // Promise, IMPURE
  // const dbReady$ = Kefir.fromPromise(db_prom).map(pipe(isNil,not)).toProperty(()=>false).ignoreEnd()
    // Auth
  const auth$ = makeAuthObs()
  const unique_auth$ = auth$.skipDuplicates(compareAuths).filter(validateAuth).toProperty() // unique_auth$ :: auth -> auth
  // const userInfo$ = unique_auth$.flatMap(_=>Kefir.fromPromise(fetchUserInfo(getAuthInit))).filter(x=>x.id!=null).toProperty(()=>{return {id:null}}) // IMPURE userInfo$ :: user_info
  const userInfo$ = promiseStream(unique_auth$, ()=>fetchUserInfo(getAuthInit)).filter(x=>x.id!=null).toProperty(()=>{return {id:null}}) // IMPURE userInfo$ :: user_info
    // Ready, Sync
  const ready$ = Kefir.combine([ // ready$ :: Bool
    workerReady$,
    userInfo$.map( x=>{return isNil(x.id) ? false : true}),
  ], (...args)=>reduce(and, true, args)).toProperty(()=>false) 
  const notReady$ = ready$.map(not) // notReady$ :: Bool
  const makeSafe = stream => stream.bufferWhileBy(notReady$).flatten() // makeSafe :: Stream -> Stream
  const makeMsgStreamSafe = name => makeSafe(makeMsgStream(name)) // makeMsgStreamSafe :: String -> Stream msg
// 
  const reqClear$ = makeMsgStream("clear") // reqClear$ :: msg
  const dataReset$ = promiseStream(reqClear$, resetData) // dbCleared$ :: msg
  const initData$ = makeSafe(Kefir.merge([csStart$, ready$.bufferWhileBy(csNotReady$).flatten(), dataReset$])) // initData$ ::  // second term exists bc if csStart arrives before ready, then event won't fire
  initData$.log('initData$')
    // Tweet API
  const debugGetBookmarks$ = makeMsgStreamSafe('get-bookmarks') // debugGetBookmarks$ :: msg
  const reqUpdatedTweets$ = makeMsgStreamSafe('update-tweets') // reqUpdatedTweets$ :: msg
  const updateTimeline$ = makeMsgStream("update-timeline") // reqUpdatedTweets$ :: msg

  const reqTimeline$ = makeSafe(Kefir.merge([ updateTimeline$, initData$]))  // reqTimeline$ :: msg
  const reqBookmarks$ = makeSafe(Kefir.merge([debugGetBookmarks$, initData$])) //.flatten() // reqBookmarks$ :: msg
  // reqBookmarks$.log('reqBookmarks$')
  const reqAddBookmark$ = makeMsgStreamSafe('add-bookmark') // reqAddBookmark$ :: msg
  const reqBookmarkId$ = reqAddBookmark$.map(pipe(prop('id'), id=>[id])) // reqBookmarkId$ :: [id]
  const anyAPIReq$ = Kefir.merge([reqUpdatedTweets$, reqBookmarks$, reqTimeline$, reqAddBookmark$,]) // anyAPIReq$ :: msg
  // anyAPIReq$.log('anyAPIReq$')

  const fetchedUpdate$ = promiseStream(reqUpdatedTweets$, _ => updateQuery(getAuthInit, getUsername(), update_size)) // IMPURE fetchedUpdate$ :: [apiTweet]
  const fetchedTimeline$ = promiseStream(reqTimeline$, _ => timelineQuery(getAuthInit, getUserInfo())) // IMPURE fetchedTimeline$ :: [apiTweet]
  const fetchedBookmarks$ = promiseStream( reqBookmarks$, _ => getBookmarks(getAuthInit)) // IMPURE fetchedBookmarks$ :: [apiBookmark]
  const fetchedBookmark$ = promiseStream( reqBookmarkId$, tweetLookupQuery(getAuthInit)) // IMPURE fetchedBookmark$ :: [apiTweet]

  const fetchedAnyAPIReq$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$, fetchedBookmarks$, fetchedBookmark$,]) // fetchedAnyAPIReq$ :: [apiTweet]
  // fetchedAnyAPIReq$.log('fetchedAnyAPIReq$')
    // User submitted  
  const reqArchiveLoad$ = makeMsgStreamSafe("temp-archive-stored") // reqArchiveLoad$ :: msg
  const archiveLoadedTweets$ = promiseStream(reqArchiveLoad$, _=>getData("temp_archive")) // IMPURE archiveLoadedTweets$ :: [archTweet]

  // const fetchedUpdate$ = reqUpdatedTweets$.flatMapLatest(_=>Kefir.fromPromise(updateQuery(getAuthInit, getUsername(), update_size))) // IMPURE
  // const fetchedTimeline$ = reqTimeline$.flatMapLatest(_=>Kefir.fromPromise(timelineQuery(getAuthInit, userInfo$.currentValue()))) // IMPURE
  // const fetchedBookmarks$ = reqBookmarks$.flatMapLatest(_=>Kefir.fromPromise(getBookmarks(getAuthInit)))
  // subObs(fetchedTweets$, pipe(saferApiToTweet, updateTweets,)) // happens after fetching tweets from twitter API
  // subObs(fetchedBookmarks$, pipe(, updateTweets,), )  // happens on requests to fetch all bookmarks
  // subObs(archiveLoadedTweets$, pipe(defaultTo([]), map(archToTweet(getUserInfo)), addTweets)) // happens after loading temp_archive from stg, from file. Action imports it
  const thTweets$ = Kefir.merge([ // thTweets$ :: [tweet] // tweet :: threadhelper_tweet
    fetchedUpdate$.map(saferMap(apiToTweet)),
    fetchedTimeline$.map(saferMap(apiToTweet)),
    fetchedBookmarks$.map(saferMap(bookmarkToTweet)),
    fetchedBookmark$.map(saferMap(apiToTweet)).map(assoc('is_bookmark', true)),
    archiveLoadedTweets$.map(saferMap(archToTweet(getUserInfo)))
  ])
  thTweets$.log('thTweets$')
  const fetchedTweets$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$])//.map(toTweets) // fetchedTweets$ :: [apiTweet]
  // Local Tweet Processing
  const reqDeleteTweet$ = makeMsgStreamSafe('delete-tweet') // reqDeleteTweet$ :: msg
  const reqRemoveBookmark$ = makeMsgStreamSafe('remove-bookmark') // reqRemoveBookmark$ :: msg

  const idsToRemove$ = Kefir.merge([reqDeleteTweet$, reqRemoveBookmark$]).map(prop('id')) // idsToRemove$ :: id
  idsToRemove$.log('idsToRemove$')
  
  // Worker returns  
  const addedTweets$ = promiseStream(thTweets$, addTweets) // addedTweets$ :: msg
  addedTweets$.log('addedTweets$')
  const removedTweet$ = promiseStream(idsToRemove$, removeTweet)  // removedTweet$ :: msg
  removedTweet$.log('removedTweet$')
  const updatedTweets$ = promiseStream(fetchedUpdate$, updateTweets) // updatedTweets$ :: msg    // fetchedUpdate$ gets added for a secnod time because update is the way we find deleted recent tweets
  updatedTweets$.log('updatedTweets$')
  
  const anyTweetUpdate$ = Kefir.merge([updatedTweets$, addedTweets$, removedTweet$, dataReset$]).toProperty()  // anyTweetUpdate$ :: msg
  anyTweetUpdate$.log('anyTweetUpdate$')  
    // Misc
  const whenUpdated$ = anyTweetUpdate$.map(_=>getDateFormatted()).toProperty(getDateFormatted) // keeps track of when the last update to the tweet db was
  const syncDisplay$ = Kefir.merge([ready$, anyTweetUpdate$,]) // triggers sync display update// ready$ :: user_info -> Bool
  syncDisplay$.log('syncDisplay$')
// 
    // Sync
  const anyWorkerReq$ = Kefir.merge([fetchedUpdate$, fetchedBookmarks$, fetchedTimeline$, reqRemoveBookmark$, idsToRemove$, reqArchiveLoad$]) // like with anyAPIReq$, these should only be emitted as the worker request is sent but oh well\
  const makeFlag = curry((def, stream0, stream1) => Kefir.merge([toVal(false, stream0), toVal(true, stream1)]).map(defaultTo(def)).toProperty(()=>def))
  const makeFlagT = makeFlag(true)
  const notArchLoading$ = makeFlagT(reqArchiveLoad$, archiveLoadedTweets$)
  const notFetchingAPI$ = makeFlagT(anyAPIReq$, fetchedAnyAPIReq$)
  const notMidWorkerReq$ = makeFlagT(anyWorkerReq$, anyTweetUpdate$)
  const syncLight$ = streamAnd([notArchLoading$, notFetchingAPI$, notMidWorkerReq$, ready$]).map(defaultTo(false)).toProperty(()=>false)
  // CS messages
  const searchQuery$ = makeMsgStream("search").map(prop('query')).toProperty(()=>'')
  // const reqRoboQuery$ = msg$.filter(x=>!isNil(x)).filter(propEq('type', 'robo-tweet')).bufferWhileBy(notReady$).flatten()
  const logAuth$ = makeMsgStream('log-auth')
  const getUserInfo$ = makeMsgStream('get-user-info')
    // Search
  const reqSearch$ = makeSafe(Kefir.merge([ 
    searchQuery$,
    searchQuery$.sampledBy(searchFilters$),
    searchQuery$.sampledBy(anyTweetUpdate$),
    ]))
    // doSearch
  const reqDefaultTweets$ = makeSafe(Kefir.merge([  // reqDefaultTweets$ :: msg | String // triggers getting and pushing default tweets
    // searchFilters$.filter(_=>!searchQueryExists()),
    // anyTweetUpdate$.filter(_=>!searchQueryExists()),
    searchQuery$.sampledBy(searchFilters$).filter(pipe(isExist,R.not)),
    searchQuery$.sampledBy(anyTweetUpdate$).filter(pipe(isExist,R.not)),
    makeMsgStream("get-latest"),
    anyTweetUpdate$,
  ])).bufferWhileBy(notReady$).map(last).throttle(1000) //.last()
  reqDefaultTweets$.log('reqDefaultTweets$')

  
    // Worker returns
  const gotDefaultTweets$ = promiseStream(reqDefaultTweets$, getDefaultTweets) // gotDefaultTweets$ :: [tweets]
  const searchResults$ = promiseStream(reqSearch$, doSearch) // searchResults$ :: [tweets]
  // 
  
  // const searchQueryExists = ()=>isExist(searchQuery$.currentValue())
  // Aux functions 
  // Effect functions

  // const storeBookmarks = pipe(saferApiToTweet, map(assoc('is_bookmark', true)), addTweets)
  // const addBookmark = pipe( prop('id'), x=>[x], tweetLookupQuery(getAuthInit), andThen(storeBookmarks) )
  // const getDefaultTweets = async _=>defaultTweetsFn( // IMPURE, getDefaultTweets :: -> [tweet]
  //   n_tweets_results, 
  //   getFilters(), 
  //   db_get, 
  //   getUsername(), 
  //   await _db.getAllKeys('tweets')
  // )

  // const reqRoboQueryEffects = m=>{setData({'roboSync':false}); makeRoboRequest(getAuthInit,m).then(roboTweet=> setData({'roboTweet':roboTweet, 'roboSync':true}))}
  
  // Effects from streams
    // Ready / sync
  ready$.log('READY')

  csStart$.log('csStart')
  workerReady$.log('workerReady')
  subObs(syncDisplay$, pipe(_=>makeSyncDisplayMsg(), andThen(setStg('syncDisplay')))) // update sync display
  subObs(syncLight$, setStg('sync'))
    // Worker actions
      // Import tweets
  subObs(fetchedTweets$, nullFn) // happens after fetching tweets from twitter API
  subObs(fetchedBookmarks$, nullFn)  // happens on requests to fetch all bookmarks
  subObs(idsToRemove$, nullFn) // happens on a request to remove a tweet from DB
  subObs(reqAddBookmark$, nullFn) // happens on requests to add a bookmark
  subObs(archiveLoadedTweets$, clearTempArchive) // happens after tweets are updated by worker, should only happen after loading archive
  // subObs(fetchedTweets$, pipe(saferApiToTweet, updateTweets,)) // happens after fetching tweets from twitter API
  // subObs(fetchedBookmarks$, pipe(defaultTo([]), map(bookmarkToTweet), updateTweets,), )  // happens on requests to fetch all bookmarks
  // subObs(idsToRemove$, removeTweet) // happens on a request to remove a tweet from DB
  // subObs(reqAddBookmark$, pipe(saferApiToTweet, map(assoc('is_bookmark', true)), addTweets)) // happens on requests to add a bookmark
  // subObs(archiveLoadedTweets$, pipe(defaultTo([]), map(archToTweet(getUserInfo)), addTweets)) // happens after loading temp_archive from stg, from file. Action imports it
      // Search
  // subObs(reqSearch$, doSearch)
  subObs(searchResults$, pipe(prop('res'), setStg('search_results')))
  subObs(reqDefaultTweets$, nullFn)
  subObs(gotDefaultTweets$, pipe(prop('res'), setStg('latest_tweets')))
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
  // searchQuery$.log('searchQuery$')
  subObs(searchFilters$, nullFn)
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