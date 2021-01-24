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
import { Status as Tweet, User } from 'twitter-d';
import { inspect } from '../utils/putils';
import { Credentials } from '../types/types';
import { TweetId } from '../types/tweetTypes';

const getMaxId = (res) => (res.length > 1 ? res[res.length - 1].id : null);
const retryLimit = 3;

/*  URLS */
const URLGetBookmarks =
  'https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweets=true&count=10000&ext=mediaStats%2CcameraMoment';
const URLCreateFav = 'https://twitter.com/i/api/1.1/favorites/create.json';
const URLDestroyFav = 'https://twitter.com/i/api/1.1/favorites/destroy.json';
const URLRetweet = 'https://twitter.com/i/api/1.1/statuses/retweet.json';
const URLUnretweet = 'https://twitter.com/i/api/1.1/statuses/unretweet.json';
const makeURLStartQT = (id) =>
  `https://twitter.com/intent/tweet?url=https://twitter.com/x/status/${id}`;
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
  )}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&count=20&query_source=typed_query&pc=1&spelling_corrections=0&ext=mediaStats%2ChighlightedLabel%2CcameraMoment&include_quote_count=true`;
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
  let output = [];
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

export const thFetch = async (url: string, options): Promise<any> =>
  fetch(url, options)
    .then(errorRefusal)
    .then((response) => response.json())
    .catch(handleFetchError);

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

const fetchStatus = async (auth: Credentials, id: TweetId) => {
  return await twitterFetch(makeFetchStatusUrl(id), auth);
};

export const searchUsers = (authHeaders, query) =>
  twitterFetch(makeUserSearchUrl(query), {
    authHeaders,
    method: 'GET',
    body: null,
    referrer: 'https://twitter.com/explore',
  });

const sendTweetAction = curry((url, authHeaders, tweetId) =>
  twitterFetch(URLCreateFav, {
    ...authHeaders,
    method: 'POST',
    body: `tweet_mode=extended&id=${tweetId}`,
    referrer: 'https://twitter.com/home',
  })
);

export const sendLikeRequest = sendTweetAction(URLCreateFav);
export const sendUnlikeRequest = sendTweetAction(URLDestroyFav);
export const sendRetweetRequest = sendTweetAction(URLRetweet);
export const sendUnretweetRequest = sendTweetAction(URLUnretweet);

const fetchTweets = async (
  url: string,
  authHeaders: Credentials
): Promise<Tweet[]> => twitterFetch(url, { authHeaders });

export const fetchUserInfo = async (authHeaders: Credentials): Promise<User> =>
  await loopRetry(() =>
    twitterFetch(
      `https://api.twitter.com/1.1/account/verify_credentials.json`,
      { authHeaders }
    )
  );
export const updateQuery = async (
  auth: Credentials,
  username: string,
  count: number
) => await fetchTweets(makeUpdateQueryUrl(username, count), auth);

export const tweetLookupQuery = curry(
  async (auth: Credentials, ids: string[]): Promise<Tweet[]> => {
    const fetch100Ids = (ids: string[]): Promise<Tweet[]> =>
      fetchTweets(
        `https://api.twitter.com/1.1/statuses/lookup.json?id=${R.join(
          ',',
          ids
        )}`,
        auth
      );

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
// fetch as many tweets as possible from the timeline
export const timelineQuery = async (auth: Credentials, user_info: User) =>
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
const getApiTweets = pipe(path(['globalObjects', 'tweets']), (x) =>
  Object.values(x)
);
const getApiUsers = pipe(path(['globalObjects', 'users']));
const getQtId = pipe(prop('quoted_status_id_str'));
// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })
const assocUser = curry(
  (
    users: {
      [x: string]: any;
    },
    tweet: {
      user_id_str: string | number;
    }
  ) => assoc('user', users[tweet.user_id_str], tweet)
);
// const assocQTs =  curry((qts, tweet) => assoc('quote', qts[tweet.quoted_status_id_str], tweet))
const assocQTs = curry((qts: { [x: string]: Tweet }, tweet) =>
  when(
    pipe(prop('quoted_status_id_str'), isNil, not),
    pipe(
      assoc('quoted_status', qts[tweet.quoted_status_id_str]),
      assoc('is_quote_status', true)
    )
  )(tweet)
);
const getQTs = curry((auth: Credentials, tweets: Tweet[]) =>
  pipe(
    () => tweets,
    getApiTweets,
    map(getQtId),
    filter(pipe(isNil, not)),
    tweetLookupQuery(auth),
    andThen(indexBy(prop('id_str'))),
    andThen(inspect('afterlookupquery'))
  )()
);

// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })

export async function getBookmarks(auth: Credentials): Promise<Tweet[]> {
  const authFetchBookmarks = () => fetchTweets(URLGetBookmarks, auth);
  let bookmarks: Tweet[] = await loopRetry(authFetchBookmarks);
  const tweets = getApiTweets(bookmarks);
  const users = getApiUsers(bookmarks);
  const authGetQTs = () => getQTs(auth, bookmarks);
  const qts = await loopRetry(authGetQTs);
  const makeRes = (bookmarks: any[]): {} =>
    pipe(
      getApiTweets,
      map(assocUser(users)),
      map(assocQTs(qts)),
      inspect('bookmarks with qts')
    )(bookmarks);
  const res = await makeRes(bookmarks);
  return values(res);
}

export const searchAPI = curry(
  async (auth: Credentials, query: string): Promise<Tweet[]> => {
    const fetchQ = () => fetchTweets(makeApiSearchUrl(query), auth);
    const _res = await loopRetry(fetchQ);
    const tweets = getApiTweets(_res);
    const users = getApiUsers(_res);
    const authGetQTs = () => getQTs(auth, _res);
    const qts = await loopRetry(authGetQTs);
    const makeRes = (_res: any[]): {} =>
      pipe(getApiTweets, map(assocUser(users)), map(assocQTs(qts)))(_res);
    const res = await makeRes(_res);
    return res;
  }
);
