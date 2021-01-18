import "@babel/polyfill";
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import * as browser from "webextension-polyfill";
import ReactGA from 'react-ga';
import { Status as Tweet, User } from 'twitter-d';
import { curProp, fetchInit } from './types/types'
import * as window from './global';
import { initGA, Event, Exception, PageView } from './utils/ga';
import PromiseWorker from 'promise-worker';
import * as R from 'ramda';
import { flattenModule, delay, inspect, toggleDebug, currentValue, nullFn, isExist, timeFn, list2Obj, streamAnd, toVal, promiseStream, curVal, waitFor, makeMsgStream, errorFilter } from './utils/putils';
import { twitter_url, getDateFormatted, apiBookmarkToTweet, saferTweetMap, makeInit, compareAuths, validateAuth, msgSomeWorker, isOptionSame, _makeOptionObs, _makeStgObs, combineOptions, makeReqDefaultTweetsMsg, makeReqSearchMsg } from './utils/bgUtils';
import { isWorkerReady, howManyTweetsDb, addAccount, removeAccount, addUser, removeUser, updateTimeline, addTweets, removeTweets, removeTweet, dbClear, resetIndex, getDefaultTweets, clearTempArchive, resetData } from './utils/bgUtils';
import { update_size, n_tweets_results } from './utils/params';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch, otherwise } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, pathSatisfies, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math
import Kefir, { Observable } from 'kefir';
import { msgCS, setStg, getData, removeData, getOptions, getOption, makeStorageChangeObs as makeStorageChangeObs, updateStgPath, makeStgItemObs, makeOptionObs, makeGotMsgObs, resetStorage } from './utils/dutils';
import { defaultOptions } from './utils/defaultStg';
import { makeAuthObs } from './bg/auth';
import { initWorker } from './bg/workerBoss';
import { fetchUserInfo, updateQuery, tweetLookupQuery, timelineQuery, getBookmarks, } from './bg/twitterScout';
import { makeValidateTweet } from './worker/search';
import { validateTweet, archToTweet, bookmarkToTweet, apiToTweet } from './bg/tweetImporter';
import { StorageChange, SearchFilters, SearchMode, IdleMode } from "./types/stgTypes";
import { thTweet } from "./types/tweetTypes";
import { Msg, TweetResult, TweetResWorkerMsg, WorkerMsg, ReqDefaultTweetsMsg } from "./types/msgTypes";
// Analytics //IMPORTANT: this block must come before setting the currentValue for Kefir. Property and I have no idea why
(function initAnalytics() { initGA(); })();
PageView('/background.html');

// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);
(Kefir.Property.prototype as any).currentValue = currentValue;

// Stream clean up
const subscriptions: any[] = [];
const rememberSub = (sub) => { subscriptions.push(sub); return sub; };
const subObs = (obsObj:any, effect:any) => {
    let obs = head(values(obsObj)); let name = head(keys(obsObj));
    obs = obs.setName(name)
    rememberSub(obs.observe({ value: effect }));
};
// Extension business
// Potential functions to import
// Message builders
const makeSyncDisplayMsg = async (pWorker: PromiseWorker, getUsername: (arg0:any)=>string, whenUpdated$) => {
    const username = getUsername(1);
    // const n_tweets = await howManyTweetsDb(_db)
    const n_tweets = await howManyTweetsDb(pWorker);
    const dateTime = await curVal(whenUpdated$);
    return `Hi ${username}, I have ${n_tweets} tweets available. \n Last updated on ${dateTime}`;
};
export async function main() {
    const worker = initWorker();
    const pWorker = new PromiseWorker(worker); //promise worker
    // Extension business
    chrome.tabs.onActivated.addListener(onTabActivated);
    chrome.runtime.onInstalled.addListener(onInstalled(() => resetData(pWorker)));
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    // Stream value getters
    const getAuthInit = (_: any) : RequestInit => makeInit(curVal(auth$));
    const getUserInfo = (_: any): User => curVal(userInfo$);
    const getUsername = (_: any) : string => prop('screen_name', curVal(userInfo$));
    const getAccId = (_: any) : string => prop('id_str', curVal(userInfo$));
    // const getAccsShown = (_: any) : any[] => curV ode$);
    // Define streams
    //  Extension observers
    //      Messages
    const msg$ = makeGotMsgObs().map(prop('m')); // msg$ :: () -> msg // msg :: {type,...} // Listens to chrome runtime onMessage
    const msgStream = makeMsgStream(msg$);
    const reqReset$ = msgStream("clear"); const dataReset$ = reqReset$.thru<Observable<any,any>>(promiseStream(_ => resetData(pWorker)));

    const csStart$ = msg$.filter(propEq('type', 'cs-created')).map(_=>true).toProperty(()=>false);      const csNotReady$ = csStart$.map(not); // const csNotReady$ = toVal(false, csStart$)
    //      Analytics
    const csGaEvent$ = msgStream('gaEvent').map(prop('event'));     const csGaException$ = msgStream('gaException').map(prop('exception'));
    //      Storage
    const optionsChange$ = makeStorageChangeObs().filter((propEq('itemName', 'options')));      const makeOptionObs = _makeOptionObs(optionsChange$); // const storageChange$ = makeStorageChangeObs();  
    
    // Display options and Search filters
    const idleMode$ = (await makeOptionObs('idleMode')).map(prop('value')) as Observable<IdleMode, any>; 
    const searchMode$ = (await makeOptionObs('searchMode')).map(prop('value'));
    // const getRT$ = ;    const useBookmarks$ = await makeOptionObs('useBookmarks');    const useReplies$ = await makeOptionObs('useReplies');    
    const searchFilters$ = Kefir.combine([
        await makeOptionObs('getRTs'), 
        await makeOptionObs('useBookmarks'), 
        await makeOptionObs('useReplies')], combineOptions).toProperty();

    const wMsgEvent$ = Kefir.fromEvents<MessageEvent, any>(worker, 'message')
    const workerMsg$ = wMsgEvent$.filter(propSatisfies(x=>R.type(x)=="String", 'data')).map(prop('data')).map(
        (x:string)=>tryCatch( //trycatch is here bc firefox handles requests faster if they're completely stringified rather than partially but I haven't made sure that all workerMsgs are stringified, especially PromiseWorker ones
            (x:string)=>(JSON.parse(x) as WorkerMsg), 
            e => {console.error('[ERROR] pWorkerMsg$ Couldnt parse', {e, x}); throw e}
        )(x)
        ).ignoreErrors() // msgs sent as stringified json
    const pWorkerMsg$ = wMsgEvent$.filter(pathSatisfies(x=>R.type(x)=="Object", ['data', 2])).map(path(['data', 2])) // msgs from Promise Worker
    const workerReady$ = workerMsg$.filter(propEq('type', 'ready')).map(R.T).toProperty(R.F);
    const _workerReady = _=>curVal(workerReady$)
    
    const askWorkerReady$ = Kefir.repeat(i => {
        if (i < 5 && !_workerReady(1)) {
            console.log(`[DEBUG] asking isWorkerReady i=${i}`, {workerReady: _workerReady(1)})
            return Kefir.sequentially(2000, [i])
        } else {
            return false;
        }
      })
    const workerConsole$ = workerMsg$.filter(propEq('type', 'console'))
    // Auth
    const auth$ = makeAuthObs().filter(validateAuth).skipDuplicates(compareAuths).toProperty();
    // User Info
    const _userInfo$ = auth$
        .map(makeInit)
        .thru<Observable<User,any>>(promiseStream((auth:RequestInit) => fetchUserInfo(auth)))
        .filter(pipe(isNil, not))
        .filter(pipe(propEq('id', null), not))
    const userInfo$ = Kefir.merge([_userInfo$.skipDuplicates(), _userInfo$.sampledBy(dataReset$)]).toProperty();
    // Ready, Sync
    const haveUserInfo$ = userInfo$.map((x: User) => { return isNil(x.id) ? false : true; })
    const ready$ = Kefir.combine([
        workerReady$,
        haveUserInfo$,
    ], (...args) => reduce(and, true, args)).toProperty(R.F);   const notReady$ = ready$.map(not); notReady$.log('notReady$')
    // Utils
    const msgStreamSafe = (name: string): Observable<Msg,any>  => msgStream(name).thru(waitFor(notReady$)); // msgStreamSafe :: String -> Stream msg
    // Accounts 
    //      write
    const removeAccount$ = msgStream('remove-account').map(prop('id')).thru<Observable<any,any>>(promiseStream(removeAccount(pWorker))); // const removeAccount$ = promiseStream(msgStream('remove-account').map(prop('id')), removeAccount(pWorker)).toProperty(); 
    const incomingAccounts$ = userInfo$ 
        .thru(promiseStream(addAccount(pWorker)))
        .map(list2Obj('id_str'))
        .toProperty();
    const accountsUpdate$ = Kefir.merge([removeAccount$, incomingAccounts$]); // both these are returns from worker requests to the db that contain the currently active accounts (accs in the db)
    
    //      read
    const accounts$ = (await _makeStgObs('activeAccounts')).map(defaultTo([])); 
    const accsShown$ = accounts$.map(pipe( // it's a search filter
        values, 
        filter(either(
            pipe(prop('showTweets'), isNil), 
            propEq('showTweets', true))
            ))) as unknown as Observable<User[], any>;

    const filters$ = Kefir.merge([searchFilters$, accsShown$.map(map(prop('id_str')))]); //just for sampling other things
    // 
    const initData$ = Kefir.merge([csStart$, ready$.bufferWhileBy(csNotReady$).flatten(), dataReset$]).thru(waitFor(notReady$)).throttle(1000); // initData$ ::  // second term exists bc if csStart arrives before ready, then event won't fire
    // Tweet API
    const hasTimeline$ = (await _makeStgObs('hasTimeline')).map(pipe(prop(getAccId(1)), defaultTo(false)));     const missingTimeline$ = hasTimeline$.map(not); // just a flag
    // Tweet API reqs from CS
    const debugGetBookmarks$ = msgStreamSafe('get-bookmarks'); 
    const updateRecentTimeline$ = msgStreamSafe('update-tweets'); 
    const updateTimeline$ = msgStream("update-timeline"); 
    const reqAddBookmark$ = msgStreamSafe('add-bookmark');
    // Tweet API  reqs to be made
    const reqUpdatedTweets$ = Kefir.merge([updateRecentTimeline$, initData$.filterBy(hasTimeline$)]).thru(waitFor(notReady$)).thru(errorFilter('reqUpdatedTweets$')); // asks for update on explicit req and on initData
    const reqTimeline$ = Kefir.merge([updateTimeline$, initData$.filterBy(missingTimeline$)]).thru(waitFor(notReady$)).thru(errorFilter('reqTimeline$')); // asks for update on explicit req and on initData
    const reqBookmarks$ = Kefir.merge([debugGetBookmarks$, initData$]).thru(waitFor(notReady$)).thru(errorFilter('reqBookmarks$')); // asks for update on explicit req and on initData
    const reqBookmarkId$ = reqAddBookmark$.map(pipe(prop('id'), id => [id])).thru(errorFilter('reqBookmarkId$')); 
    const anyAPIReq$ = Kefir.merge([reqUpdatedTweets$, reqBookmarks$, reqTimeline$, reqAddBookmark$,]); // flag
    // Tweet API promise returns
    const fetchedUpdate$ =  reqUpdatedTweets$.thru(promiseStream(_ => updateQuery(getAuthInit, getUsername(), update_size))).thru(errorFilter('fetchedUpdate$')); // const fetchedUpdate$ = promiseStream(reqUpdatedTweets$, _ => updateQuery(getAuthInit, getUsername(), update_size)).thru(errorFilter('fetchedUpdate$')); 
    const fetchedTimeline$ =  reqTimeline$.thru(promiseStream(_ => timelineQuery(getAuthInit, getUserInfo()))).thru(errorFilter('fetchedTimeline$')); 
    const fetchedBookmarks$ =  reqBookmarks$.thru(promiseStream(_ => getBookmarks(getAuthInit))).thru(errorFilter('fetchedBookmarks$')); 
    const fetchedBookmark$ =  reqBookmarkId$.thru(promiseStream(tweetLookupQuery(getAuthInit))).thru(errorFilter('fetchedBookmark$')); 
    const fetchedAnyAPIReq$ = Kefir.merge([fetchedUpdate$, fetchedTimeline$, fetchedBookmarks$, fetchedBookmark$,]).thru(errorFilter('fetchedAnyAPIReq$')); 
    // User submitted tweets
    const reqArchiveLoad$ = msgStreamSafe("temp-archive-stored"); // reqArchiveLoad$ :: msg
    const extractTweetPropIfNeeded = ifElse(prop('tweet'), prop('tweet'), x => x);
    const archiveLoadedTweets$ = reqArchiveLoad$.thru(promiseStream(pipe(_ => getData("temp_archive"), andThen(map(extractTweetPropIfNeeded))))).thru(errorFilter('archiveLoadedTweets$')); 
    const thUpdate$ = fetchedUpdate$.map(saferTweetMap(apiToTweet));
    // 
    // const curAccount = pipe(_ => userInfo$, curVal, prop('id_str'));
    const assocAccount = x => pipe(assoc('account', getAccId(1)))(x);
    const thTweets$ = Kefir.merge([
        thUpdate$, //fetchedUpdate$.map(saferTweetMap(apiToTweet)),
        fetchedTimeline$.map(saferTweetMap(apiToTweet)),
        fetchedBookmarks$.map(saferTweetMap(bookmarkToTweet)),
        fetchedBookmark$.map(saferTweetMap(apiBookmarkToTweet)),
        archiveLoadedTweets$.map(saferTweetMap(archToTweet(()=>getUserInfo(1)))) 
    ]).filter(pipe(isEmpty, not)).map(map(assocAccount));
    // Local Tweet Processing
    const reqDeleteTweet$ = msgStreamSafe('delete-tweet'); // reqDeleteTweet$ :: msg
    const reqRemoveBookmark$ = msgStreamSafe('remove-bookmark'); // reqRemoveBookmark$ :: msg
    const idsToRemove$ = Kefir.merge([reqDeleteTweet$, reqRemoveBookmark$]).map(prop('id')); // idsToRemove$ :: id
    // Worker returns  
    const addedTweets$ = thTweets$.thru(promiseStream(addTweets(pWorker))).thru(errorFilter('addedTweets$')); 
    const removedTweet$ = idsToRemove$.thru(promiseStream(removeTweet(pWorker))).thru(errorFilter('removedTweet$')); 
    const updatedTimeline$ = thUpdate$.thru(promiseStream(updateTimeline(pWorker))).thru(errorFilter('updatedTimeline$')); 
    // thUpdate$ gets added once more separately because update is the way we find deleted recent tweets
    const anyTweetUpdate$ = Kefir.merge([updatedTimeline$, addedTweets$, removedTweet$, dataReset$]).toProperty(); // anyTweetUpdate$ :: msg
    const whenUpdated$ = anyTweetUpdate$.map(_ => getDateFormatted()).toProperty(getDateFormatted); // keeps track of when the last update to the tweet db was
    const updateSyncDisplay$ = Kefir.merge([ready$, anyTweetUpdate$,]).map(_ => true); // triggers sync display update// ready$ :: user_info -> Bool
    // Sync
    const anyWorkerReq$ = Kefir.merge([fetchedUpdate$, fetchedBookmarks$, fetchedTimeline$, reqRemoveBookmark$, idsToRemove$, reqArchiveLoad$]); // like with anyAPIReq$, these should only be emitted as the worker request is sent but oh well\
    const makeFlag = curry((def, stream0, stream1) => Kefir.merge([toVal(false, stream0), toVal(true, stream1)]).map(defaultTo(def)).toProperty(() => def));
    const makeFlagT = makeFlag(true);
    const notArchLoading$ = makeFlagT(reqArchiveLoad$, archiveLoadedTweets$);
    const notFetchingAPI$ = makeFlagT(anyAPIReq$, fetchedAnyAPIReq$);
    const notMidWorkerReq$ = makeFlagT(anyWorkerReq$, anyTweetUpdate$);
    const syncLight$ = streamAnd([notArchLoading$, notFetchingAPI$, notMidWorkerReq$, ready$]).map(defaultTo(false)).toProperty(F);
    // Search query
    const isWordEnd = pipe(last, R.match(/[^a-zA-Z0-9]/g), isEmpty, not) // true if it's not in the middle of a word
    const searchQuery$ = msgStream("search").map(prop('query')).toProperty() as curProp<string>;     // const searchQuery$ = msgStream("search").map(prop('query')).toProperty(() => '');
    const emptyQuery$ = searchQuery$.map(trim).filter(isEmpty)     //TODO: can't trim in cs bc I need the final space
    const wordSearchQuery$ = searchQuery$.filter(isWordEnd).map(R.trim).skipDuplicates()
    // Search and default reqs
    const reqFullTextSearch$ = Kefir.merge([
        // searchQuery$,
        searchQuery$.filter(pipe(isEmpty, not)),
        searchQuery$.sampledBy(filters$).filter(isExist),
        searchQuery$.sampledBy(anyTweetUpdate$).filter((isExist)),
    ]).thru(waitFor(notReady$)).bufferWhileBy(searchMode$.map(mode=>!equals('fulltext', mode))).map(last);
    const reqSemanticSearch$ = wordSearchQuery$.thru(waitFor(notReady$)).bufferWhileBy(searchMode$.map(mode=>!equals('semantic', mode))).map(last);
    const reqSearch$ = Kefir.merge([reqFullTextSearch$, reqSemanticSearch$]).thru(waitFor(notReady$));

    const defaultsWorkerMsg$ = Kefir.combine<ReqDefaultTweetsMsg>([searchFilters$, idleMode$, accsShown$], makeReqDefaultTweetsMsg)

    const reqDefaultTweets$ = Kefir.merge([
        defaultsWorkerMsg$, 
        anyTweetUpdate$,
    ]).thru(waitFor(notReady$)).bufferWhileBy(notReady$).map(last); //.last()

    // Search worker returns
    const gotDefaultTweets$ = Kefir.merge([defaultsWorkerMsg$, defaultsWorkerMsg$.sampledBy(reqDefaultTweets$)])
        .thru<Observable<TweetResWorkerMsg, any>>(promiseStream(msg => pWorker.postMessage(msg)))
        .map(prop('res')); // gotDefaultTweets$ :: [tweets]
    const defaultTweets$ = Kefir.merge([gotDefaultTweets$, gotDefaultTweets$.sampledBy(filters$)])
    // const gotDefaultTweets$ = reqDefaultTweets$.thru(promiseStream(_ => getDefaultTweets(pWorker, getFilters, idleMode$, accsShown$))).map(prop('res')); // gotDefaultTweets$ :: [tweets]
    
    
    const filterDefaults = (filters:SearchFilters, accs: User[], results:TweetResult[]) => R.filter(pipe(
        result=>makeValidateTweet(filters, accs)(prop('tweet', result)),
        ), results)
    const filteredDefaultTweets$ = Kefir.combine<TweetResult[]>([searchFilters$, accsShown$, defaultTweets$], filterDefaults) // const filteredDefaultTweets$ = Kefir.merge([gotDefaultTweets$, gotDefaultTweets$.sampledBy(filters$)]).map(filter(x => validateSidebarTweet(getFilters(), getAccsShown())));
    
    // const searchResults$ = promiseStream(reqSearch$, searchFn(1)).map(prop('res')); // searchResults$ :: [tweets]
    // const searchResults$ = reqSearch$.thru(promiseStream(doSearch(pWorker, getSearchMode, getFilters, accsShown$))).map(prop('res')); // searchResults$ :: [tweets]
    // IDEA: instead of getting curVals, combine streams into the message and pass it through the stream
    const searchWorkerMsg$ = Kefir.combine([searchMode$, searchFilters$, accsShown$, reqSearch$], makeReqSearchMsg)
    const fullTextSearchRes$ = searchWorkerMsg$
        .sampledBy(reqFullTextSearch$)
        .thru<Observable<TweetResWorkerMsg,any>>(promiseStream(msg => pWorker.postMessage(msg)))
        .map(prop('res')); // searchResults$ :: [tweets]

    const semanticSearchRes$ = searchWorkerMsg$     
        .thru<Observable<TweetResWorkerMsg,any>>(promiseStream(msg => pWorker.postMessage(msg)))
        .map(prop('res')); // searchResults$ :: [tweets]
    // const searchResults$ = searchWorkerMsg$.sampledBy(reqSearch$).thru(promiseStream(msg => pWorker.postMessage(msg))).map(prop('res')); // searchResults$ :: [tweets]
    const emptyResults$ = emptyQuery$.map((_):TweetResult[] => [])
    const searchResults$ = Kefir.merge([fullTextSearchRes$, semanticSearchRes$, emptyResults$])
    const filteredSearchResults$ = Kefir.combine([searchFilters$, accsShown$, searchResults$], filterDefaults)

    const logAuth$ = msgStream('log-auth');
    const getUserInfo$ = msgStream('get-user-info');

    
    const checkGotTimeline = (timeline: string | any[]) => (timeline.length > 3000 || timeline.length >= getUserInfo(1).statuses_count - 1);
    // Effects from streams
    // Ready / sync
    subObs({accountsUpdate$}, setStg('activeAccounts'));
    subObs({csGaEvent$}, pipe(values, x => Event(...x)));
    subObs({csGaException$}, pipe(values, x => Exception(...x)));
    subObs({askWorkerReady$}, _ => isWorkerReady(pWorker));
    subObs({updateSyncDisplay$}, pipe(_ => makeSyncDisplayMsg(pWorker, getUsername, whenUpdated$), andThen(setStg('syncDisplay')))); // update sync display
    subObs({syncLight$}, setStg('sync'));
    // Worker actions
    // Import tweets
    subObs({fetchedBookmarks$}, nullFn); // happens on requests to fetch all bookmarks
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(x0: string | any[]) => any' is ... Remove this comment to see the full error message
    subObs({fetchedTimeline$}, pipe(when(checkGotTimeline, _ => updateStgPath(['hasTimeline', getAccId()], true))));
    subObs({idsToRemove$}, nullFn); // happens on a request to remove a tweet from DB
    subObs({reqAddBookmark$}, nullFn); // happens on requests to add a bookmark
    subObs({archiveLoadedTweets$}, clearTempArchive); // happens after tweets are updated by worker, should only happen after loading archive
    // Search
    subObs({searchFilters$}, nullFn);
    subObs({reqDefaultTweets$}, nullFn);
    subObs({filteredSearchResults$}, pipe(setStg('search_results')));
    subObs({filteredDefaultTweets$}, pipe(setStg('latest_tweets')));
    // bg search
    // DB
    subObs({reqReset$}, nullFn);
    // searchQuery
    // Debug
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '() => void' is not assignable to... Remove this comment to see the full error message
    subObs({logAuth$}, () => console.log(getAuthInit()));
    subObs({getUserInfo$}, () => console.log(curVal(userInfo$)));
    
    
    ready$.log('[INFO] READY');
    csStart$.log('[INFO] csStart');
    msg$.log('[DEBUG] msg$');
    // workerMsg$.log('[DEBUG] workerMsg$')
    workerConsole$.log('[INFO] workerConsole$')
    auth$.log('[DEBUG] unique_auth$');
    userInfo$.log('[DEBUG] userInfo$');
    userInfo$.log('[DEBUG] uniqueUserInfo$');
    notReady$.log('[DEBUG] notReady$');
    initData$.log('[DEBUG] initData$');
    idleMode$.log('[DEBUG] idleMode$')
    // reqUpdatedTweets$.log('[DEBUG] reqUpdatedTweets$');
    // reqTimeline$.log('[DEBUG] reqTimeline$');
    // reqBookmarks$.log('[DEBUG] reqBookmarks$');
    // anyAPIReq$.log('[DEBUG] anyAPIReq$');
    // fetchedAnyAPIReq$.log('[DEBUG] fetchedAnyAPIReq$');
    // reqArchiveLoad$.log('[DEBUG] reqArchiveLoad$');
    // archiveLoadedTweets$.log('[DEBUG] archiveLoadedTweets$');
    // thTweets$.log('[DEBUG] thTweets$');
    // idsToRemove$.log('[DEBUG] idsToRemove$');
    // addedTweets$.log('[DEBUG] addedTweets$');
    // removedTweet$.log('[DEBUG] removedTweet$');
    // updatedTimeline$.log('[DEBUG] updatedTimeline$');
    // anyTweetUpdate$.log('[DEBUG] anyTweetUpdate$');
    // updateSyncDisplay$.log('[DEBUG] updateSyncDisplay$');
    // notArchLoading$.log('[DEBUG] notArchLoading$');
    // notFetchingAPI$.log('[DEBUG] notFetchingAPI$');
    // notMidWorkerReq$.log('[DEBUG] notMidWorkerReq$');
    syncLight$.log('[DEBUG] syncLight$');
    reqSearch$.log('[DEBUG] reqSearch$')
    reqDefaultTweets$.log('[DEBUG] reqDefaultTweets$');
    // csGaEvent$.log('[DEBUG] csGaEvent$');
    accounts$.log('[DEBUG] accounts$');
    accsShown$.log('[DEBUG] accsShown$');
    searchResults$.log('[DEBUG] searchResults$')
    // wMsgEvent$.log('wMsgEvent$')
    // workerMsg$.log('workerMsg$')
    pWorkerMsg$.log('pWorkerMsg$')
    workerReady$.log('[DEBUG] workerReady$')
    askWorkerReady$.log('askWorkerReady$')
    incomingAccounts$.log('[DEBUG] incomingAccounts$');
    // searchQuery$.log('[DEBUG] searchQuery$')
    // emptyQuery$.log('emptyQuery$')
    // wordSearchQuery$.log('[DEBUG] wordSearchQuery$')
    // reqFullTextSearch$.log('reqFullTextSearch$')
    // reqSemanticSearch$.log('reqSemanticSearch$')
    defaultsWorkerMsg$.log('[DEBUG] defaultsWorkerMsg$')
    // gotDefaultTweets$.log('[DEBUG] gotDefaultTweets$')
    // filteredDefaultTweets$.log('[DEBUG] filteredDefaultTweets$');
    // searchWorkerMsg$.log('[DEBUG] searchWorkerMsg$')
    // fullTextSearchRes$.log('[DEBUG] fullTextSearchRes$')
    // semanticSearchRes$.log('[DEBUG] semanticSearch$')
}

const onUpdated = (previousVersion)=>{
    console.log(`[INFO] updated from version ${previousVersion}`);
}

const onFirstInstalled = (resetData, previousVersion, id)=>{
    console.log(`[INFO] first install. Welcome to TH! ${previousVersion}`);
    resetData();
}


const onInstalled = curry((resetData: () => void, reason: string, previousVersion: string, id) => {
    console.log('[DEBUG] onInstalled', { reason, previousVersion, id });
    switch(reason){ // "install", "update", "chrome_update", or "shared_module_update"
        case 'update': onUpdated(previousVersion);
        case 'install': onFirstInstalled(resetData, previousVersion, id);
    }
    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //   chrome.declarativeContent.onPageChanged.addRules([
    //     {conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: { urlContains: "twitter.com" }})],
    //       actions: [new chrome.declarativeContent.ShowPageAction()]}]);});
    // chrome.pageAction.show(tabId);
    // chrome.pageAction.hide(tabId);
});
// TODO emit to active tab
function onTabActivated(activeInfo: {
    tabId: any;
}) {
    chrome.tabs.get(activeInfo.tabId, function (tab: chrome.tabs.Tab) {
        if (tab.url != null) {
            try { if (tab.url.match(twitter_url)) {} }
            catch (e) {console.log(e);}}
    });
}
// function onTabUpdated(tabId, change: {status: string; url: string;}, tab: {url: string; active: any; id: any;}) {
function onTabUpdated(tabId, change: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
    try {
        // console.log(`[DEBUG] onTabUpdated`, {change, tab})
        if (change.status === 'complete' && tab.url.match(twitter_url)) {
            chrome.browserAction.disable(tabId);
        }
        else {
            chrome.browserAction.enable(tabId);
        }
    }
    catch (e) {
        chrome.browserAction.disable(tabId);
        // console.log(`[ERROR] onTabUpdated`, {e, tab})
    }
    if (tab.active && change.url) {
        if (change.url.match(twitter_url)) {
            msgCS(tab.id, { type: "tab-change-url", url: change.url, cs_id: tab.id });
        }
    }
}
// 
main();
