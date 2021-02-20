/* For interacting with Twitter API */
import delay from 'delay';
import * as R from 'ramda';
import {
  andThen,
  assoc,
  curry,
  filter,
  indexBy,
  isEmpty,
  isNil,
  map,
  not,
  path,
  pipe,
  prop,
  values,
  when,
} from 'ramda'; // Function
import { FullUser, Status, Status as Tweet, User } from 'twitter-d';
import { inspect } from '../utils/putils';
import { Credentials } from '../types/types';
import { ArchTweet, thTweet, TweetId } from '../types/tweetTypes';
import {
  apiSearchToTweet,
  archPatchQtId,
  patchArchivePrep,
} from './tweetImporter';
import { TweetResult } from '../types/msgTypes';
import { WranggleRpc, PostMessageTransport } from '@wranggle/rpc';

const isServe = process.env.DEV_MODE == 'serve';
let remote = {};
if (isServe) {
  const opts = { targetWindow: window, shouldReceive: (x) => true };
  const rpc = new WranggleRpc({
    postMessage: opts,
    channel: 'bgFetch',
    // debug: true,
  });
  remote = rpc.remoteInterface();
  // window.fetch = remote.fetchBg;
}

const getMaxId = (res) => (res.length > 1 ? res[res.length - 1].id : null);
const retryLimit = 3;

/*  URLS */
const URLVerifyCredentials = `https://api.twitter.com/1.1/account/verify_credentials.json`;
const URLGetBookmarks =
  'https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweets=true&count=10000&ext=mediaStats%2CcameraMoment';
const URLCreateFav = 'https://twitter.com/i/api/1.1/favorites/create.json';
const URLDestroyFav = 'https://twitter.com/i/api/1.1/favorites/destroy.json';
const URLRetweet = 'https://twitter.com/i/api/1.1/statuses/retweet.json';
const URLUnretweet = 'https://twitter.com/i/api/1.1/statuses/unretweet.json';
const makeURLStartQT = (id) =>
  `https://twitter.com/intent/tweet?url=https://twitter.com/x/status/${id}`;
const makeTweetLookupUrl = (ids) =>
  `https://api.twitter.com/1.1/statuses/lookup.json?id=${R.join(
    ',',
    ids
  )}&tweet_mode=extended&include_entities=true`;
const makeUserLookupUrl = (ids) =>
  `https://api.twitter.com/1.1/users/lookup.json?user_id=${R.join(',', ids)}`;

const makeTimelineQueryUrl = curry(
  (max_id: number, screen_name: string, count: number) => {
    const max_param = max_id > 0 ? `&max_id=${max_id}` : '';
    return `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screen_name}&count=${count}${max_param}&include_rts=1&tweet_mode=extended`;
  }
);
const makeUpdateQueryUrl = makeTimelineQueryUrl(-1);
const makeApiSearchUrl = (q) =>
  `https://api.twitter.com/2/search/adaptive.json?q=${encodeURIComponent(
    q
  )}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=false&count=20&query_source=typed_query&pc=1&spelling_corrections=0&ext=mediaStats%2ChighlightedLabel%2CcameraMoment&include_quote_count=true`;
// )}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&count=20&query_source=typed_query&pc=1&spelling_corrections=0&ext=mediaStats%2ChighlightedLabel%2CcameraMoment&include_quote_count=true`;
const makeUserSearchUrl = (q) =>
  `https://twitter.com/i/api/1.1/search/typeahead.json?q=${encodeURIComponent(
    q
  )}&src=search_box&result_type=users`;
const makeFetchStatusUrl = (tid) =>
  `https://api.twitter.com/1.1/statuses/show.json?id=${tid}&tweet_mode=extended`;
const shouldRetryError = (error) => ![403, 429].includes(error.status);

const loopRetry = async <T,>(fn: () => Promise<T>): Promise<T> => {
  let retryCount = 0;
  let success = false;
  let output = null;
  let stop = false;
  while (!success && !stop && retryCount < retryLimit) {
    try {
      output = await fn();
      success = true;
      console.log(`[DEBUG] [${fn.name}] Loop succeeded`);
    } catch (e) {
      retryCount += 1;
      if (shouldRetryError(e) && retryCount < retryLimit) {
        console.log(`[ERROR] [${fn.name}] failed. Retrying...`, e);
        await delay(500);
      } else {
        stop = true;
        console.error(`[ERROR] failed. Stopped retrying...`, e);
        throw e;
      }
    }
  }
  return output;
};

const errorRefusal = (response) => {
  if (!response.ok) {
    throw response;
  }
  return response;
};

const handleFetchError = (error) => {
  switch (error.status) {
    case 401:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      break; // Unauthorized client, lacks valid auth for target resource. Re-auth might make a difference
    case 403:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      break; // Forbidden, server understood but refuses to authorize. re-auth will make no difference.
    case 429:
      console.error(`[ERROR] thFetch ${error.status}, Too Many Requests`, {
        error,
      });
      throw error; // Too many requests.
    default:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      throw error;
  }
  throw error;
};

const _thFetch = async (url: string, options): Promise<any> =>
  fetch(url, options)
    .then(errorRefusal)
    .then((response) => response.json())
    .catch(handleFetchError);

export const thFetch = isServe ? remote.fetchBg : _thFetch;
//
function twitterFetch(url: string, options) {
  if (!options.authHeaders['x-csrf-token']) {
    return Promise.reject('not requesting, no auth');
  }
  var fullOptions = {
    headers: {
      authorization: options.authHeaders.authorization,
      'x-csrf-token': options.authHeaders['x-csrf-token'],
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'en',
    },
    referrerPolicy:
      options.method === 'GET'
        ? 'no-referrer-when-downgrade'
        : 'strict-origin-when-cross-origin',
    mode: 'cors',
    credentials: 'include',
    body: options.body ?? null,
    method: options.method ?? 'GET',
    referrer: options.referrer ?? 'https://twitter.com/home',
  };
  // if (options.signal) {
  //     fullOptions.signal = options.signal;
  // }
  // we send post requests with url encoding always
  if (options.method === 'POST') {
    fullOptions.headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  return thFetch(url, fullOptions);
}

export const searchTwitter = (authHeaders, query) =>
  twitterFetch(makeApiSearchUrl(query), {
    authHeaders,
    method: 'GET',
    body: null,
    referrer: 'https://twitter.com/search?q=' + encodeURIComponent(query),
  });

export const fetchStatus = async (
  authHeaders: Credentials,
  id: TweetId
): Promise<Status> => {
  return await twitterFetch(makeFetchStatusUrl(id), { authHeaders });
};

function getUsersFromSearchResponse(data) {
  return {
    users: data.users.slice(0, 4),
    error: null,
  };
}
export const searchUsers = (authHeaders, query) =>
  twitterFetch(makeUserSearchUrl(query), {
    authHeaders,
    method: 'GET',
    body: null,
    referrer: 'https://twitter.com/explore',
  }).then(getUsersFromSearchResponse);

const sendTweetAction = curry((url, authHeaders, tweetId) => {
  return twitterFetch(url, {
    authHeaders,
    method: 'POST',
    body: `tweet_mode=extended&id=${tweetId}`,
    referrer: 'https://twitter.com/home',
  });
});

export const sendLikeRequest = sendTweetAction(URLCreateFav);
export const sendUnlikeRequest = sendTweetAction(URLDestroyFav);
export const sendRetweetRequest = sendTweetAction(URLRetweet);
export const sendUnretweetRequest = sendTweetAction(URLUnretweet);

const fetchTweets = async (
  url: string,
  authHeaders: Credentials
): Promise<Tweet[]> =>
  twitterFetch(url, {
    authHeaders,
    method: 'GET',
    body: null,
  });

export const fetchUserInfo = async (authHeaders: Credentials): Promise<User> =>
  await loopRetry(() => twitterFetch(URLVerifyCredentials, { authHeaders }));
export const updateQuery = async (
  auth: Credentials,
  username: string,
  count: number
) => await fetchTweets(makeUpdateQueryUrl(username, count), auth);

//https//twitter.com/i/api/1.1/users/lookup.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&user_id=115074076%2C1325778441392717824%2C22525974

export const tweetLookupQuery = curry(
  async (auth: Credentials, ids: string[]): Promise<Tweet[]> => {
    const fetch100Ids = (ids: string[]): Promise<Tweet[]> =>
      fetchTweets(makeTweetLookupUrl(ids), auth);

    return pipe<
      string[],
      string[][],
      Promise<Tweet[]>[],
      Promise<Tweet[][]>,
      Promise<Tweet[]>
    >(
      R.splitEvery(100),
      map(fetch100Ids),
      (ps) => Promise.all(ps),
      R.andThen(R.reduce<Tweet[], Tweet[]>(R.concat, []))
    )(ids);
  }
);
export const userLookupQuery = curry(
  async (auth: Credentials, ids: string[]): Promise<User[]> => {
    const fetch100Ids = (ids: string[]): Promise<User[]> =>
      fetchTweets(makeUserLookupUrl(ids), auth);

    return pipe<
      string[],
      string[][],
      Promise<User[]>[],
      Promise<User[][]>,
      Promise<User[]>
    >(
      R.splitEvery(100),
      map(fetch100Ids),
      (ps) => Promise.all(ps),
      R.andThen(R.reduce<User[], User[]>(R.concat, []))
    )(ids);
  }
);

// fetch as many tweets as possible from the timeline
export const timelineQuery = async (auth: Credentials, user_info: FullUser) =>
  await query(
    auth,
    prop('screen_name', user_info),
    prop('statuses_count', user_info),
    -1,
    []
  );
const stop_condition = (res: Tweet[], count: number, max_id: number) =>
  res.length >= count || isNil(max_id); //stop if got enough tweets or if max_id is null (twitter not giving any more)
// res is the accumulator, should be called as [], max_id initialized as -1
const query = curry(
  async (
    auth: Credentials,
    username: string,
    count: number,
    max_id: number,
    res: Tweet[]
  ): Promise<Tweet[]> => {
    if (stop_condition(res, count, max_id)) return res;
    const req_res = await fetchTweets(
      makeTimelineQueryUrl(max_id, username, count),
      auth
    );
    return await query(
      auth,
      username,
      count,
      getMaxId(req_res),
      res.concat(req_res)
    );
  }
);

// (IMPURE) getThreadAbove :: tid -> [tweet]
// init : thread [], counter 0
const maxThreadSize = 20;
export const getThreadAbove = curry(
  async (auth: Credentials, counter: number, tid) => {
    // console.log('getting thread above', tid)
    if (isNil(tid) || isEmpty(tid) || counter > maxThreadSize) return [];
    const cur = await fetchStatus(auth, tid);
    // console.log('current tweet', cur)
    const thread_above = await getThreadAbove(
      auth,
      counter + 1,
      cur.in_reply_to_status_id_str
    );
    // console.log('thread above', thread_above)
    return [...thread_above, cur];
  }
);
const unpackApiTweets = pipe(path(['globalObjects', 'tweets']), (x) =>
  Object.values(x)
);
const unpackApiUsers = pipe(path(['globalObjects', 'users']));
// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })
const assocUser = curry(
  (users: { [x: string]: User }, tweet: Tweet | ArchTweet) =>
    assoc('user', users[tweet.user_id_str], tweet)
);
// const assocQT =  curry((qts, tweet) => assoc('quote', qts[tweet.quoted_status_id_str], tweet))
const assocQT = curry((qts: { [x: string]: Tweet }, tweet: Tweet | ArchTweet):
  | Tweet
  | ArchTweet =>
  pipe(
    () => tweet,
    when(
      pipe(prop('quoted_status_id_str'), isNil, not),
      pipe(
        assoc('quoted_status', prop(prop('quoted_status_id_str', tweet), qts)),
        assoc('is_quote_status', true)
      )
    )
  )()
);
const getQTs = curry(
  (auth: Credentials, tweets: (Tweet | ArchTweet)[]): Promise<Tweet[]> =>
    pipe(
      () => tweets,
      // unpackApiTweets,
      map(prop('quoted_status_id_str')),
      filter(pipe(isNil, not)),
      R.uniq,
      tweetLookupQuery(auth),
      andThen(indexBy(prop('id_str')))
    )()
);

const getUsers = curry(
  (auth: Credentials, tweets: (Tweet | ArchTweet)[]): Promise<User[]> =>
    pipe(
      () => tweets,
      // unpackApiTweets,
      map(prop('user_id')),
      filter(pipe(isNil, not)),
      R.uniq,
      userLookupQuery(auth),
      andThen(indexBy(prop('id_str'))),
      andThen(inspect('after user lookupquery'))
    )()
);

// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })

// Most of the tweets are gotten when archive uploaded, this is to get users and QTs
export async function patchArchive(
  auth: Credentials,
  userInfo: User,
  archive: ArchTweet[]
): Promise<Tweet[]> {
  const patchedArch = map((t) => patchArchivePrep(userInfo, t), archive);
  const authGetQTs = () => getQTs(auth, patchedArch);
  const authGetUsers = () => getUsers(auth, patchedArch);
  const qts = await loopRetry(authGetQTs);
  const users = await loopRetry(authGetUsers);
  const res = await map(pipe(assocQT(qts), assocUser(users)), patchedArch);
  console.log('patchArchive', { res });
  return res;
}

export async function getBookmarks(auth: Credentials): Promise<Tweet[]> {
  const authFetchBookmarks = () => fetchTweets(URLGetBookmarks, auth);
  const _res = await loopRetry(authFetchBookmarks);
  let bookmarks: Tweet[] = unpackApiTweets(_res);
  const users = unpackApiUsers(_res);
  const authGetQTs = () => getQTs(auth, bookmarks);
  const qts = await loopRetry(authGetQTs);
  const makeRes = (bookmarks: any[]): {} =>
    map(pipe(assocUser(users), assocQT(qts)), bookmarks);
  const res = await makeRes(bookmarks);
  return values(res);
}

export const searchAPI = curry(
  async (auth: Credentials, query: string): Promise<Tweet[]> => {
    const fetchQ = () => fetchTweets(makeApiSearchUrl(query), auth);
    const _res = await loopRetry(fetchQ);
    const tweets = unpackApiTweets(_res);
    const users = unpackApiUsers(_res);
    const authGetQTs = () => getQTs(auth, tweets);
    const qts = await loopRetry(authGetQTs);
    const makeRes = (tweets: Tweet[]): Tweet[] =>
      pipe(() => tweets, map(assocUser(users)), map(assocQT(qts)))();
    const res = await makeRes(tweets);
    return res;
  }
);

export async function apiMetricsFetch(
  auth: Credentials,
  results: TweetResult[]
) {
  if (!isNil(auth)) {
    const tweets = await pipe(
      () => results,
      map(path(['tweet', 'id'])),
      tweetLookupQuery(auth),
      andThen(map(apiSearchToTweet)),
      andThen((apiRes) =>
        map(
          (r) =>
            R.set(
              R.lensProp('tweet'),
              R.find(R.propEq('id', path(['tweet', 'id'], r)))(apiRes),
              r
            ),
          results
        )
      ),
      andThen(filter(pipe(prop('tweet'), isNil, not)))
    )();
    return tweets;
  }
}
