/* For interacting with Twitter API */
import '@babel/polyfill';
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
import { inspect, toggleDebug } from '../utils/putils';
import { Credentials } from '../types/types';
import { ArchTweet, thTweet, TweetId } from '../types/tweetTypes';
import {
  apiSearchToTweet,
  getArchUserId,
  patchArchivePrep,
} from './tweetImporter';
import { TweetResult } from '../types/msgTypes';
import { WranggleRpc, PostMessageTransport } from '@wranggle/rpc';

// var DEBUG = process.env.NODE_ENV != 'production';
// toggleDebug(window, DEBUG);

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
  'https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&count=10000&ext=mediaStats%2CcameraMoment';
// 'https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=false&count=10000&ext=mediaStats%2CcameraMoment';
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
const makeUserLookupUrl = (ids, names = []) =>
  `https://api.twitter.com/1.1/users/lookup.json?${
    isEmpty(ids)
      ? ''
      : 'user_id=$' + R.join(',', ids) + (isEmpty(names) ? '' : '&')
  }${isEmpty(names) ? '' : 'screen_name=' + R.join(',', names)}`;

const makeTimelineQueryUrlv1 = curry(
  (max_id: number, screen_name: string, count: number) => {
    const max_param = max_id > 0 ? `&max_id=${max_id}` : '';
    return `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screen_name}&count=${count}${max_param}&include_rts=1&tweet_mode=extended`;
  }
);

const makeTimelineQueryUrl = curry(
  (cursor: string, user_id: string, count: number) => {
    const cursor_param = !isNil(cursor)
      ? `&cursor=${encodeURIComponent(cursor)}`
      : '';
    return `https://twitter.com/i/api/2/timeline/profile/${user_id}.json?include_profile_interstitial_type=1&include_blocking=0&include_blocked_by=1&include_followed_by=0&include_want_retweets=1&include_mute_edge=0&include_can_dm=0&include_can_media_tag=1&skip_status=1&include_cards=0&include_ext_alt_text=false&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=false&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&include_tweet_replies=false&count=${count}${cursor_param}&userId=${user_id}`;
    // return `https://twitter.com/i/api/2/timeline/profile/${user_id}.json?include_profile_interstitial_type=1&include_blocking=0&include_blocked_by=1&include_followed_by=0&include_want_retweets=1&include_mute_edge=0&include_can_dm=0&include_can_media_tag=1&skip_status=1&include_cards=0&include_ext_alt_text=false&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=false&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=false&include_tweet_replies=false&count=${count}${cursor_param}&userId=${user_id}`;
  }
);

const makeUpdateQueryUrlv1 = makeTimelineQueryUrlv1(-1);
const makeUpdateQueryUrl = (user_id: string, count: number) => {
  return `https://twitter.com/i/api/2/timeline/profile/${user_id}.json?include_profile_interstitial_type=1&include_blocking=0&include_blocked_by=1&include_followed_by=0&include_want_retweets=1&include_mute_edge=0&include_can_dm=0&include_can_media_tag=1&skip_status=1&include_cards=0&include_ext_alt_text=false&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=false&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&include_tweet_replies=false&count=${count}&userId=${user_id}`;
  // return `https://twitter.com/i/api/2/timeline/profile/${user_id}.json?include_profile_interstitial_type=1&include_blocking=0&include_blocked_by=1&include_followed_by=0&include_want_retweets=1&include_mute_edge=0&include_can_dm=0&include_can_media_tag=1&skip_status=1&include_cards=0&include_ext_alt_text=false&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=false&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=false&include_tweet_replies=false&count=${count}&userId=${user_id}`;
};
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

export const genericLoopRetry = curry(
  async <T,>(retryLimit, delayMs, fn: () => Promise<T>): Promise<T> => {
    let retryCount = 0;
    let success = false;
    let output = null;
    let stop = false;
    while (!success && !stop && retryCount < retryLimit) {
      try {
        console.log(`[DEBUG] [${fn.name}] Looping`);
        output = await fn();
        success = true;
        console.log(`[DEBUG] [${fn.name}] Loop succeeded`);
      } catch (e) {
        retryCount += 1;
        if (shouldRetryError(e) && retryCount < retryLimit) {
          console.log(`[ERROR] [${fn.name}] failed. Retrying...`, e);
          await delay(delayMs);
        } else {
          stop = true;
          console.error(`[ERROR] failed. Stopped retrying...`, e);
          throw e;
        }
      }
    }
    return output;
  }
);

const loopRetry = genericLoopRetry(retryLimit, 500);

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
    case 404:
      console.error(`[ERROR] thFetch ${error.status}, Not found.`, {
        error,
      });
      break; // The URI requested is invalid or the resource requested, such as a user, does not exist.
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
  console.log('thFetching', { url, fullOptions });
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

export const fetchUserInfo = async (
  authHeaders: Credentials
): Promise<User> => {
  console.log('fetchUserInfo', { authHeaders });
  try {
    return await loopRetry(() =>
      twitterFetch(URLVerifyCredentials, { authHeaders })
    );
  } catch (e) {
    console.error('fetchUserInfo failed');
    throw e;
  }
};
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
// takes ids or names and sorts them in fetch100Ids
export const userLookupQuery = curry(
  async (auth: Credentials, ids: string[]): Promise<User[]> => {
    const idRE = /[0-9]+/;
    const nameRE = /[\w+]{1,15}\b/;
    const fetch100Ids = (ids: string[]): Promise<User[]> => {
      const userIds = ids.filter(R.test(idRE));
      const userNames = R.difference(ids.filter(R.test(nameRE)), userIds);
      console.log('userLookupQuery', { userIds, userNames });
      return fetchTweets(makeUserLookupUrl(userIds, userNames), auth);
    };
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
export const timelineQuery = async (auth: Credentials, userInfo: FullUser) => {
  console.log('timelineQuery', { auth, userInfo });
  return await query(
    auth,
    prop('id_str', userInfo),
    prop('statuses_count', userInfo),
    null,
    []
  );
};

const getCursor = (cursorType: string) =>
  pipe(
    path(['timeline', 'instructions', 0, 'addEntries', 'entries']),
    R.find(R.propSatisfies(R.includes('cursor-' + cursorType), 'entryId')),
    path(['content', 'operation', 'cursor', 'value'])
  );
const getBottomCursor = getCursor('bottom');
const getTopCursor = getCursor('top');
//stop if got enough tweets or if max_id is null (twitter not giving any more)
const stop_condition = (_res, res: Tweet[], count) => {
  const updateSize = R.length(unpackApiTweets(_res));
  const totalSize = R.length(res);
  console.log('stop_condition', {
    updateSize,
    totalSize,
    botCursor: getBottomCursor(_res),
    topCursor: getTopCursor(_res),
    cursorsEqual: getBottomCursor(_res) == getTopCursor(_res),
    res,
    _res,
    count,
  });
  return (
    updateSize <= 2 ||
    totalSize >= count ||
    getBottomCursor(_res) == getTopCursor(_res)
  );
};
// 20 maximizes how many tweets we get. Bigger steps: less tweets.
const timelineStepSize = 20;
const query = curry(
  async (
    auth: Credentials,
    user_id: string,
    count: number,
    cursor: string,
    res: Tweet[]
  ): Promise<Tweet[]> => {
    const url = makeTimelineQueryUrl(cursor, user_id, timelineStepSize);
    const authFetchUpdate = () => fetchTweets(url, auth);
    const _res = await loopRetry(authFetchUpdate);
    const formattedRes = await formatApiResUser(auth, user_id, _res);
    const concatRes = R.unionWith(R.eqBy(prop('id_str')), formattedRes, res);
    if (stop_condition(_res, concatRes, count)) return res;
    console.log('timelineQuery recursion 1', {
      formattedRes,
      user_id,
      res,
      _res,
      auth,
      url,
      cursor: getBottomCursor(_res),
    });
    return await query(auth, user_id, count, getBottomCursor(_res), concatRes);
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

const unpackApiTweets = pipe(path(['globalObjects', 'tweets']), values);
const unpackApiUsers = pipe(path(['globalObjects', 'users']));
// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })
const assocUser = curry(
  (users: { [x: string]: User }, tweet: Tweet | ArchTweet) => {
    const user = prop(prop('user_id_str', tweet), users);
    return assoc(
      'user',
      user, // undefined users (e.g. deleted accounts) will be null
      tweet
    ); //
  }
);
const assocUserArch = curry(
  (users: { [x: string]: User }, tweet: Tweet | ArchTweet) => {
    const user = prop(path(['user', 'id_str'], tweet), users);
    if (isNil(user)) return tweet;
    return assoc(
      'user',
      user, // undefined users (e.g. deleted accounts) will be null
      tweet
    );
  }
);
// const assocQT =  curry((qts, tweet) => assoc('quote', qts[tweet.quoted_status_id_str], tweet))
const assocQT = curry((qts: { [x: string]: Tweet }, tweet: Tweet | ArchTweet):
  | Tweet
  | ArchTweet => {
  return pipe(
    () => tweet,
    when(
      pipe(prop('quoted_status_id_str'), isNil, not),
      pipe(
        assoc('quoted_status', prop(prop('quoted_status_id_str', tweet), qts)),
        assoc('is_quote_status', true)
      )
    )
  )();
});
const getQTs = curry(
  async (auth: Credentials, res): Promise<{ [id: string]: Tweet }> => {
    const tweets = path(['globalObjects', 'tweets'], res); //dict
    const qt_ids: string[] = pipe(
      () => tweets,
      values,
      map(prop('quoted_status_id_str')),
      filter(pipe(isNil, not)),
      R.uniq
    )();
    console.log('[DEBUG] getQTs', { qt_ids, tweets });
    const local_qts = values(R.pick(qt_ids, tweets));
    console.log('[DEBUG] getQTs', { local_qts, qt_ids, tweets });
    const outside_qts: Tweet[] = await pipe(
      () => local_qts,
      R.keys,
      R.difference(qt_ids),
      tweetLookupQuery(auth)
    )();
    console.log('[DEBUG] getQTs', { local_qts, outside_qts, qt_ids, tweets });
    return indexBy(prop('id_str'), R.concat(local_qts, outside_qts));
  }
);

const getUsers = curry(
  (auth: Credentials, tweets: (Tweet | ArchTweet)[]): Promise<User[]> =>
    pipe(
      () => tweets,
      // unpackApiTweets,
      map(path(['user', 'id_str'])),
      inspect('before user lookupquery'),
      filter(pipe(R.either(isNil, R.equals('-1')), not)), // deleted accounts get -1 user_id
      R.uniq,
      userLookupQuery(auth),
      andThen(indexBy(prop('id_str'))),
      andThen(inspect('after user lookupquery'))
    )()
);

// finds non-RT tweet in archive, looks it up and takes its user if it exists, if not tries another one
const getArchiveOwner = async (auth, archive: ArchTweet[]): Promise<User> => {
  console.log('getArchiveOwner', { auth, archive });
  for (const t of archive) {
    if (pipe(getArchUserId, prop('id_str'), isNil)(t)) {
      console.log('ownTweet', { t });
      const ownTweetRes = await tweetLookupQuery(auth, [t.id_str]);
      console.log('ownTweetRes', { ownTweetRes });
      const ownTweet = ownTweetRes[0];
      if (isNil(ownTweet)) {
        console.log("ownTweet isn't there anymore, trying another one", {
          t,
          ownTweet,
        });
        break;
      } else {
        const ownUser = ownTweet.user;
        console.log('found ownUser', { ownUser });
        return ownUser;
      }
    }
  }
  return null;
};

// tweets that are just quoted by QTs are set as retweets (they could just be removed )
const quoted2Rt = curry(
  (user_id: string, qts: { [id: string]: Tweet }, tweet) => {
    const isJustQuoted = (tweet) => {
      return (
        tweet.user_id_str != user_id &&
        R.not(R.propEq('retweeted', true, tweet)) &&
        R.has(tweet.id_str, qts)
      );
    };
    const isqtd = isJustQuoted(tweet);
    return isqtd ? R.set(R.lensProp('retweeted'), true, tweet) : tweet;
  }
);

// Most of the tweets are gotten when archive uploaded, this is to get users and QTs
export async function patchArchive(
  auth: Credentials,
  userInfo: User,
  archive: ArchTweet[]
): Promise<Tweet[]> {
  const _archOwner = await getArchiveOwner(auth, archive);
  const archOwner = _archOwner ?? userInfo;
  console.log('patchArchive', { _archOwner, archOwner });
  const patchedArch = map((t) => patchArchivePrep(archOwner, t), archive);
  const authGetQTs = () => getQTs(auth, indexBy(prop('id_str'), patchedArch));
  const authGetUsers = () => getUsers(auth, patchedArch);
  const qts: { [id: string]: Tweet } = await loopRetry(authGetQTs);
  const users = await loopRetry(authGetUsers);
  const _users = assoc(prop('id_str', archOwner), archOwner, users);
  const res = await map(pipe(assocQT(qts), assocUserArch(_users)), patchedArch);
  console.log('patchArchive', { res, users, prep: patchedArch });
  return res;
}

// API v2 requests come in a specific format: {globalObjects:{tweets, users, ...}, timeline}, format these into tweets with users and quoted statuses
const formatApiRes = async (auth: Credentials, _res) => {
  let apiTweets: Tweet[] = unpackApiTweets(_res);
  const users: FullUser[] = unpackApiUsers(_res);
  const authGetQTs = () => getQTs(auth, _res);
  const qts: Tweet[] = await loopRetry(authGetQTs);
  const makeRes = (apiTweets: any[]): {} =>
    map(pipe(assocUser(users), assocQT(qts)), apiTweets);
  const res = await makeRes(apiTweets);
  return values(res);
};
// same as formatApiRes but takes a user id argument
const formatApiResUser = async (auth: Credentials, user_id: string, _res) => {
  let apiTweets: Tweet[] = unpackApiTweets(_res);
  const users: FullUser[] = unpackApiUsers(_res);
  const authGetQTs = () => getQTs(auth, _res);
  const qts: Tweet[] = await loopRetry(authGetQTs);
  const makeRes = (apiTweets: any[]): {} =>
    map(
      pipe(quoted2Rt(user_id, qts), assocUser(users), assocQT(qts)),
      apiTweets
    );
  const res = await makeRes(apiTweets);
  return values(res);
};

export const updateQuery = async (
  auth: Credentials,
  userInfo: User,
  count: number
) => {
  const authFetchUpdate = () =>
    fetchTweets(makeUpdateQueryUrl(prop('id_str', userInfo), count), auth);
  const _res = await loopRetry(authFetchUpdate);
  const formattedRes = await formatApiResUser(auth, userInfo.id_str, _res);
  console.log('updateQuery', { _res, userInfo, formattedRes });
  return formattedRes;
};

export async function getBookmarks(auth: Credentials): Promise<Tweet[]> {
  const authFetchBookmarks = () => fetchTweets(URLGetBookmarks, auth);
  const _res = await loopRetry(authFetchBookmarks);
  return formatApiRes(auth, _res);
}

export const searchAPI = curry(
  async (auth: Credentials, query: string): Promise<Tweet[]> => {
    const fetchQ = () => fetchTweets(makeApiSearchUrl(query), auth);
    const _res = await loopRetry(fetchQ);
    return formatApiRes(auth, _res);
  }
);
// export const updateQuery = async (
//   auth: Credentials,
//   userInfo: User,
//   count: number
// ) => {
// const authFetchUpdate = () =>
//   fetchTweets(makeUpdateQueryUrl(prop('id_str', userInfo), count), auth);
//   const _res = await loopRetry(authFetchUpdate);
//   let update: Tweet[] = unpackApiTweets(_res);
//   const users: FullUser[] = unpackApiUsers(_res);
//   const authGetQTs = () => getQTs(auth, _res);
//   const qts: Tweet[] = await loopRetry(authGetQTs);
//   console.log('updateQuery', { _res, update, qts });
//   const makeRes = (update: any[]): {} =>
//     map(pipe(assocUser(users), assocQT(qts)), update);
//   const res = await makeRes(update);
//   return values(res);
// };

// export async function getBookmarks(auth: Credentials): Promise<Tweet[]> {
//   const authFetchBookmarks = () => fetchTweets(URLGetBookmarks, auth);
//   const _res = await loopRetry(authFetchBookmarks);
//   let bookmarks: Tweet[] = unpackApiTweets(_res);
//   const users = unpackApiUsers(_res);
//   const authGetQTs = () => getQTs(auth, _res);
//   const qts = await loopRetry(authGetQTs);
//   const makeRes = (bookmarks: any[]): {} =>
//     map(pipe(assocUser(users), assocQT(qts)), bookmarks);
//   const res = await makeRes(bookmarks);
//   return values(res);
// }

// export const searchAPI = curry(
//   async (auth: Credentials, query: string): Promise<Tweet[]> => {
//     const fetchQ = () => fetchTweets(makeApiSearchUrl(query), auth);
//     const _res = await loopRetry(fetchQ);
//     const tweets = unpackApiTweets(_res);
//     const users = unpackApiUsers(_res);
//     const authGetQTs = () => getQTs(auth, _res);
//     const qts = await loopRetry(authGetQTs);
//     const makeRes = (tweets: Tweet[]): Tweet[] =>
//       pipe(() => tweets, map(assocUser(users)), map(assocQT(qts)))();
//     const res = await makeRes(tweets);
//     return res;
//   }
// );
// order b by pathB according to a's pathA
const orderBy = curry(
  (pathA: string[], as: any[], pathB: string[], bs: any[]): any[] => {
    const getBInA = (a) => R.find(R.pathEq(pathB, path(pathA, a)), bs);
    return map(getBInA, as);
  }
);

// replaces prop propName of a with that of b unless b's is nil
const mixThAndMetrics = curry((a, b) => {
  if (isNil(b)) {
    return R.assocPath(['tweet', 'unavailable'], true, a);
  }
  return R.set(R.lensProp('tweet'), b, a);
});

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
      andThen(orderBy(['tweet', 'id'], results, ['id'])),
      andThen(R.zipWith(mixThAndMetrics, results))
    )();
    return tweets;
  }
}
