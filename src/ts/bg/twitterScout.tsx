/* For interacting with Twitter API */
import { Status as Tweet } from 'twitter-d';
import { User } from 'twitter-d';
import { delay } from 'delay';
import { fetchInit } from '../types/types'
import { getData, setData, makeOnStorageChanged } from '../utils/dutils';
import { inspect } from '../utils/putils';
import * as R from 'ramda';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch, otherwise } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length, indexBy } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math
// helper functions
const getMaxId = (res: string | any[]) => res.length > 1 ? res[res.length - 1].id : null;
const retryLimit = 20
const loopRetry = async <T,> (fn:(arg0:any)=>any):Promise<T> => {
    let retryCount = 0;
    let success = false;
    let output = [];
    while (!success && retryCount < retryLimit) {
        try {
            output = await fn();
            success = true;
            console.log('[DEBUG] Loop succeeded')
        }
        catch (e) {
            retryCount += 1;
            if (retryCount < retryLimit){
                console.error(`[ERROR] [${fn.name}] failed. Retrying...`, e);
                await delay(500);
            } else{
                console.error(`[ERROR] failed. Stopped retrying...`, e);
                throw e;
            }   
        }
    }
    return output;
};

export const handleErrors = response => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const thFetch = async (url: string, auth: RequestInit): Promise<any> => fetch(url, auth)
    .then(handleErrors)
    .then(response => response.json())
    .catch(error => console.error('[ERROR] catch thFetching', {error, auth, url}));

const fetchTweets = async (url: string, auth: RequestInit): Promise<Tweet[]> => thFetch(url, auth)
const fetchUser = async (url: string, auth: RequestInit): Promise<User> => thFetch(url, auth)

// export const fetchUserInfo = async (getAuthInit: () => RequestInit):Promise<User> => await fetchUser(`https://api.twitter.com/1.1/account/verify_credentials.json`, getAuthInit());
// export const fetchUserInfo = async (getAuthInit: () => RequestInit):Promise<User> => await loopRetry(()=>fetchUser(`https://api.twitter.com/1.1/account/verify_credentials.json`, getAuthInit()));
export const fetchUserInfo = async (init: RequestInit):Promise<User> => await loopRetry(()=>fetchUser(`https://api.twitter.com/1.1/account/verify_credentials.json`, init));
export const updateQuery = async (getAuthInit: () => RequestInit, username:string, count:number) => await fetchTweets(makeUpdateQueryUrl(username, count), getAuthInit());

export const tweetLookupQuery = curry(async (getAuthInit: () => RequestInit, ids: string[]): Promise<Tweet[]> => {
    const fetch100Ids = (ids:string[]): Promise<Tweet[]>=>fetchTweets(`https://api.twitter.com/1.1/statuses/lookup.json?id=${R.join(",", ids)}`, getAuthInit())
    
    return pipe<string[], string[][], Promise<Tweet[]>[], Promise<Tweet[][]>, Promise<Tweet[]>>(
        R.splitEvery(100),
        map(fetch100Ids),
        ps => Promise.all(ps),
        R.andThen(R.reduce<Tweet[], Tweet[]>(R.concat, [])),
    )(ids)
});
// fetch as many tweets as possible from the timeline
export const timelineQuery = async (getAuthInit: () => RequestInit, user_info:User)  => await query(getAuthInit, prop('screen_name', user_info), prop('statuses_count', user_info), -1, []);
const stop_condition = (res: Tweet[], count: number, max_id:number) => (res.length >= count || isNil(max_id)); //stop if got enough tweets or if max_id is null (twitter not giving any more)
// res is the accumulator, should be called as [], max_id initialized as -1
const query = curry(async (getAuthInit: () => any, username: string, count: number, max_id: number, res: Tweet[]): Promise<Tweet[]> => {
    if (stop_condition(res, count, max_id))
        return res;
    const req_res = await fetchTweets(makeTweetQueryUrl(max_id, username, count), getAuthInit());
    return await query(getAuthInit, username, count, getMaxId(req_res), res.concat(req_res));
});
const makeTweetQueryUrl = curry((max_id: number, username:string, count:number) => {
    const max_param = max_id > 0 ? `&max_id=${max_id}` : '';
    return `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}${max_param}&include_rts=1&tweet_mode=extended`;
});
const makeUpdateQueryUrl = makeTweetQueryUrl(-1);

// (IMPURE) fetchTweet :: tid -> tweet
const fetchTweet = async (getAuthInit: () => Object, tid) => {
    const url = tid => `https://api.twitter.com/1.1/statuses/show.json?id=${tid}&tweet_mode=extended`;
    const tweet = await fetch(url(tid), getAuthInit()).then(x => x.json()); //.then(x=>x.in_reply_to_status_id_str)
    return tweet;
};
// (IMPURE) getThreadAbove :: tid -> [tweet]
// init : thread [], counter 0
const maxThreadSize = 20;
export const getThreadAbove = curry(async (getAuthInit: () => Object, counter: number, tid) => {
    // console.log('getting thread above', tid)
    if (isNil(tid) || isEmpty(tid) || counter > maxThreadSize)
        return [];
    const cur = await fetchTweet(getAuthInit, tid);
    // console.log('current tweet', cur)
    const thread_above = await getThreadAbove(getAuthInit, counter + 1, cur.in_reply_to_status_id_str);
    // console.log('thread above', thread_above)
    return [...thread_above, cur];
});
const bookmark_url = "https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweets=true&count=10000&ext=mediaStats%2CcameraMoment";
// ts-migrate(2769) FIXME: No overload matches this call.
const getBookmarkTweets = pipe(path(['globalObjects', 'tweets']), x => Object.values(x));
const getBookmarkUsers = pipe(path(['globalObjects', 'users']));
const getQtId = pipe(prop('quoted_status_id_str'));
// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })
const assocUser = curry((users: {
    [x: string]: any;
}, tweet: {
    user_id_str: string | number;
}) => assoc('user', users[tweet.user_id_str], tweet));
// const assocQTs =  curry((qts, tweet) => assoc('quote', qts[tweet.quoted_status_id_str], tweet))
const assocQTs = curry((qts: {
    [x: string]: any;
}, tweet) => when(pipe(prop('quoted_status_id_str'), isNil, not), pipe(assoc('quoted_status', qts[tweet.quoted_status_id_str]), assoc('is_quote_status', true)))(tweet));
const fetchBookmarks = (getAuthInit: () => fetchInit) => pipe(inspect('[DEBUG] fetching bookmarks'), _ => fetch(bookmark_url, getAuthInit()), inspect('[DEBUG] fetched bookmarks'), 
// otherwise(pipe(inspect('ERROR: rejected fetchBookmark'), defaultTo([]))),
// @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
andThen(x => x.json()), otherwise(pipe(inspect('ERROR [fetchBookmarks] x to json'))))(1);
// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const getBookmarkQTs = curry((getAuthInit: () => Object, bookmarks: Tweet[]) => pipe(getBookmarkTweets, map(getQtId), filter(pipe(isNil, not)), tweetLookupQuery(getAuthInit), andThen(indexBy(prop('id_str'))), andThen(inspect('afterlookupquery')))(bookmarks));

// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })

export async function getBookmarks(getAuthInit: () => Object):Promise<Tweet[]> {
    const authFetchBookmarks = () => fetchBookmarks(getAuthInit);
    let bookmarks:Tweet[] = await loopRetry(authFetchBookmarks);
    const tweets = getBookmarkTweets(bookmarks);
    const users = getBookmarkUsers(bookmarks);
    const authGetQTs = () => getBookmarkQTs(getAuthInit, bookmarks);
    const qts = await loopRetry(authGetQTs);
    const makeRes = (bookmarks:any[]):{} => pipe(getBookmarkTweets, map(assocUser(users)), map(assocQTs(qts)), inspect('bookmarks with qts'))(bookmarks);
    const res = await makeRes(bookmarks);
    return values(res);
}
