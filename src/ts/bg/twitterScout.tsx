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
// helper functions
const getMaxId = (res: string | any[]) =>
  res.length > 1 ? res[res.length - 1].id : null;
const retryLimit = 20;

var sendLikeRequest = function (getAuthInit: () => RequestInit, tweetId) {
  return thFetch(
    'https://twitter.com/i/api/1.1/favorites/create.json',
    getAuthInit()
  );
};
var sendUnlikeRequest = function (getAuthInit: () => RequestInit, tweetId) {
  return thFetch(
    'https://twitter.com/i/api/1.1/favorites/destroy.json',
    getAuthInit()
  );
};
var sendRetweetRequest = function (getAuthInit: () => RequestInit, tweetId) {
  return thFetch(
    'https://twitter.com/i/api/1.1/statuses/retweet.json',
    getAuthInit()
  );
};
var sendUnretweetRequest = function (getAuthInit: () => RequestInit, tweetId) {
  return thFetch(
    'https://twitter.com/i/api/1.1/statuses/unretweet.json',
    getAuthInit()
  );
};

var startQuoteTweet = function (getAuthInit: () => RequestInit, tweetId) {
  return thFetch(
    `https://twitter.com/intent/tweet?url=https://twitter.com/x/status/tweetId`,
    getAuthInit()
  );
};

const loopRetry = async <T,>(fn: (arg0: any) => any): Promise<T> => {
  let retryCount = 0;
  let success = false;
  let output = [];
  while (!success && retryCount < retryLimit) {
    try {
      output = await fn();
      success = true;
      console.log(`[DEBUG] [${fn.name}] Loop succeeded`);
    } catch (e) {
      retryCount += 1;
      if (retryCount < retryLimit) {
        console.log(`[ERROR] [${fn.name}] failed. Retrying...`, e);
        await delay(500);
      } else {
        console.error(`[ERROR] failed. Stopped retrying...`, e);
        throw e;
      }
    }
  }
  return output;
};

export const handleErrors = (_response) => {
  if (!_response.ok) {
    const response = _response.clone();
    // console.error('[ERROR] handleErrors fetch ', {response:_response})
    // let err = mergeDeepLeft(Error(), {ok:false, status:response.status, statusText:response.statusText, url:response.url})
    throw response;
  }
  return _response;
};

export const thFetch = async (url: string, auth: RequestInit): Promise<any> =>
  fetch(url, auth)
    .then(handleErrors)
    .then((response) => response.json())
    .catch((error) => {
      switch (error.status) {
        case 88:
          console.error(
            `[ERROR] thFetch ${error.status}, ${error.statusText}`,
            { error, auth, url }
          );
          break;
        case 401:
          console.error(
            `[ERROR] thFetch ${error.status}, ${error.statusText}`,
            { error, auth, url }
          );
          break; // Unauthorized client, lacks valid auth for target resource. Re-auth might make a difference
        case 403:
          console.error(
            `[ERROR] thFetch ${error.status}, ${error.statusText}`,
            { error, auth, url }
          );
          break; // Forbidden, server understood but refuses to authorize. re-auth will make no difference.
        case 429:
          console.error(`[ERROR] thFetch ${error.status}, Too Many Requests`, {
            error,
            auth,
            url,
          });
          throw error; // Too many requests.
        default:
          console.error(
            `[ERROR] thFetch ${error.status}, ${error.statusText}`,
            { error, auth, url }
          );
          throw error;
      }
    });

const fetchTweets = async (url: string, auth: RequestInit): Promise<Tweet[]> =>
  thFetch(url, auth);
const fetchUser = async (url: string, auth: RequestInit): Promise<User> =>
  thFetch(url, auth);

// export const fetchUserInfo = async (getAuthInit: () => RequestInit):Promise<User> => await fetchUser(`https://api.twitter.com/1.1/account/verify_credentials.json`, getAuthInit());
// export const fetchUserInfo = async (getAuthInit: () => RequestInit):Promise<User> => await loopRetry(()=>fetchUser(`https://api.twitter.com/1.1/account/verify_credentials.json`, getAuthInit()));
export const fetchUserInfo = async (init: RequestInit): Promise<User> =>
  await loopRetry(() =>
    fetchUser(
      `https://api.twitter.com/1.1/account/verify_credentials.json`,
      init
    )
  );
export const updateQuery = async (
  getAuthInit: () => RequestInit,
  username: string,
  count: number
) => await fetchTweets(makeUpdateQueryUrl(username, count), getAuthInit());

export const tweetLookupQuery = curry(
  async (getAuthInit: () => RequestInit, ids: string[]): Promise<Tweet[]> => {
    const fetch100Ids = (ids: string[]): Promise<Tweet[]> =>
      fetchTweets(
        `https://api.twitter.com/1.1/statuses/lookup.json?id=${R.join(
          ',',
          ids
        )}`,
        getAuthInit()
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
export const timelineQuery = async (
  getAuthInit: () => RequestInit,
  user_info: User
) =>
  await query(
    getAuthInit,
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
    getAuthInit: () => any,
    username: string,
    count: number,
    max_id: number,
    res: Tweet[]
  ): Promise<Tweet[]> => {
    if (stop_condition(res, count, max_id)) return res;
    const req_res = await fetchTweets(
      makeTweetQueryUrl(max_id, username, count),
      getAuthInit()
    );
    return await query(
      getAuthInit,
      username,
      count,
      getMaxId(req_res),
      res.concat(req_res)
    );
  }
);

const makeTweetQueryUrl = curry(
  (max_id: number, username: string, count: number) => {
    const max_param = max_id > 0 ? `&max_id=${max_id}` : '';
    return `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}${max_param}&include_rts=1&tweet_mode=extended`;
  }
);
const makeUpdateQueryUrl = makeTweetQueryUrl(-1);

const makeApiSearchUrl = (q) =>
  // `https://twitter.com/i/api/2/search/adaptive.json?q=${encodeURIComponent(q)}`;
  `https://api.twitter.com/2/search/adaptive.json?q=${encodeURIComponent(
    q
  )}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&count=20&query_source=typed_query&pc=1&spelling_corrections=0&ext=mediaStats%2ChighlightedLabel%2CcameraMoment&include_quote_count=true`;

const makeUserSearchUrl = (q) =>
  `https://twitter.com/i/api/1.1/search/typeahead.json?q=${encodeURIComponent(
    q
  )}&src=search_box&result_type=users`;
// (IMPURE) fetchTweet :: tid -> tweet
const fetchTweet = async (getAuthInit: () => Object, tid) => {
  const url = (tid) =>
    `https://api.twitter.com/1.1/statuses/show.json?id=${tid}&tweet_mode=extended`;
  const tweet = await fetch(url(tid), getAuthInit()).then((x) => x.json()); //.then(x=>x.in_reply_to_status_id_str)
  return tweet;
};
// (IMPURE) getThreadAbove :: tid -> [tweet]
// init : thread [], counter 0
const maxThreadSize = 20;
export const getThreadAbove = curry(
  async (getAuthInit: () => Object, counter: number, tid) => {
    // console.log('getting thread above', tid)
    if (isNil(tid) || isEmpty(tid) || counter > maxThreadSize) return [];
    const cur = await fetchTweet(getAuthInit, tid);
    // console.log('current tweet', cur)
    const thread_above = await getThreadAbove(
      getAuthInit,
      counter + 1,
      cur.in_reply_to_status_id_str
    );
    // console.log('thread above', thread_above)
    return [...thread_above, cur];
  }
);
const bookmark_url =
  'https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweets=true&count=10000&ext=mediaStats%2CcameraMoment';
// ts-migrate(2769) FIXME: No overload matches this call.
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
// const fetchBookmarks = (getAuthInit: () => RequestInit) => pipe(
//     () => fetchTweets(bookmark_url, getAuthInit()),
//     // andThen(x => x.json()),
//     otherwise(x=>console.error('ERROR [fetchBookmarks] x to json', x)))();
const getQTs = curry((getAuthInit: () => Object, tweets: Tweet[]) =>
  pipe(
    () => tweets,
    getApiTweets,
    map(getQtId),
    filter(pipe(isNil, not)),
    tweetLookupQuery(getAuthInit),
    andThen(indexBy(prop('id_str'))),
    andThen(inspect('afterlookupquery'))
  )()
);

// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })

export async function getBookmarks(
  getAuthInit: () => RequestInit
): Promise<Tweet[]> {
  const authFetchBookmarks = () => fetchTweets(bookmark_url, getAuthInit());
  let bookmarks: Tweet[] = await loopRetry(authFetchBookmarks);
  const tweets = getApiTweets(bookmarks);
  const users = getApiUsers(bookmarks);
  const authGetQTs = () => getQTs(getAuthInit, bookmarks);
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
  async (getAuthInit: () => RequestInit, query: string): Promise<Tweet[]> => {
    const fetchQ = () => fetchTweets(makeApiSearchUrl(query), getAuthInit());
    const _res = await loopRetry(fetchQ);
    const tweets = getApiTweets(_res);
    const users = getApiUsers(_res);
    const authGetQTs = () => getQTs(getAuthInit, _res);
    const qts = await loopRetry(authGetQTs);
    const makeRes = (_res: any[]): {} =>
      pipe(getApiTweets, map(assocUser(users)), map(assocQTs(qts)))(_res);
    const res = await makeRes(_res);
    return res;
  }
);
