import unescape from 'lodash/unescape';
import * as R from 'ramda';
import {
  curry,
  defaultTo,
  difference,
  dropLastWhile,
  dropWhile,
  ifElse,
  isEmpty,
  isNil,
  map,
  path,
  pipe,
  prop,
  __,
} from 'ramda'; // Function
import { FullUser, Status, User } from 'twitter-d';
import default_pic_url from '../../images/defaultProfilePic.png';
import { ArchTweet, thTweet } from '../types/tweetTypes';

/* Constants */
const rtRE = /RT @([a-zA-Z0-9_]+).*/;
const rt_tag = /RT @([a-zA-Z0-9_]+:?)/;
// const rt_tag = /RT @[\w+]{1,15}\b:/;

// const default_pic_url =
//   'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png';

/* Utils */

const findAuthor = (rt: string[], t) =>
  path(['entities', 'user_mentions'], t).find((t) => {
    return prop('screen_name', t).toLowerCase() === rt[1].toLowerCase();
  });
const getRTAuthor = (user_info, rt: any[], t) => {
  if (isNil(rt)) {
    return prop('name', user_info);
  } else {
    let author = rt[1];
    try {
      author = findAuthor(rt, t);
    } catch (e) {
      console.log('ERROR getRTAuthor ', { e, user_info, rt, t });
    }
    return prop('name', author);
  }
};
const makeApiQuote = (quoted_status: Status): thTweet => {
  var qt: thTweet = {
    // Basic info.
    text: unescape(
      prop('full_text', quoted_status) || prop('text', quoted_status)
    ),
    id: prop('id_str', quoted_status),
    name: path(['user', 'name'], quoted_status),
    username: path(['user', 'screen_name'], quoted_status),
    user_id: path(['user', 'id_st'], quoted_status),
    time: new Date(prop('created_at', quoted_status)).getTime(),
    profile_image: path(['user', 'profile_image_url_https'], quoted_status),
    // Replies/mentions.
    reply_to: prop('in_reply_to_screen_name', quoted_status),
    mentions: defaultTo(
      [],
      path(['entities', 'user_mentions'], quoted_status).map(
        (x: { screen_name: any; indices: any }) => ({
          username: x.screen_name,
          indices: x.indices,
        })
      )
    ),
    // URLs.
    urls: path(['entities', 'urls'], quoted_status).map(
      (x: { url: any; display_url: any; expanded_url: any }) => ({
        current_text: x.url,
        display: x.display_url,
        expanded: x.expanded_url,
      })
    ),
    has_media:
      typeof path(['entities', 'media'], quoted_status) !== 'undefined',
    media: null,
  };
  if (qt.has_media) {
    qt.media = path(['entities', 'media'], quoted_status).map(
      (x: { url: any; media_url_https: any }) => ({
        current_text: x.url,
        url: x.media_url_https,
      })
    );
  }
  return qt;
};

// export const getRTOwner = (t: Status | ArchTweet) => {
//   const username = rtRE.exec(t.full_text ?? t.text);
//   return username ? getArchUserId(t) : null;
// };
const _isOwnTweet = (rt: any[], user_info) =>
  isNil(rt) || rt[1] === prop('screen_name', user_info);

const propDefNull = (name: string, t) => R.defaultTo(null, prop(name, t)); // propDefNull :: x | null
const getMentionsFromTweet = ifElse(
  // getMentionsFromTweet :: preTweet -> [mention] // preTweet :: apiTweet | archTweet
  path(['entities', 'user_mentions']),
  pipe(
    path(['entities', 'user_mentions']),
    map((x) => ({
      username: prop('screen_name', x),
      indices: prop('indices', x),
    }))
  ),
  (_) => []
);
const getUrlsFromTweet = ifElse(
  // getUrlsFromTweet :: preTweet -> [url]
  path(['entities', 'urls']),
  pipe(
    path(['entities', 'urls']),
    map((x) => ({
      current_text: prop('url', x),
      display: prop('display_url', x),
      expanded: prop('expanded_url', x),
    }))
  ),
  (_) => []
);
const getMediaTweet = pipe(
  path(['entities', 'media']),
  map((x) => ({ current_text: x.url, url: x.media_url_https }))
);

export const validateTweet = (t: Status): boolean => {
  const valid = !isNil(t.id_str) && (!isNil(t.full_text) || !isNil(t.text));
  if (!valid) {
    console.error('ERROR invalid tweet', {
      valid,
      id_str: t.id_str,
      full_text: t.full_text,
      text: t.text,
      t,
    });
  }
  return !isNil(valid);
};

export const idComp = curry((a, b) =>
  BigInt(a) == BigInt(b) ? 0 : BigInt(a) < BigInt(b) ? -1 : 1
);
const gtId = curry((a, b) => idComp(a, b) > 0); // gt for ids
const ltId = curry((a, b) => idComp(a, b) < 0); //lt for ids
export const sortKeys = (keys: string[]) => keys.sort(idComp);

const overlap = (minNew, maxNew, currentIds: readonly unknown[]) =>
  pipe(
    sortKeys,
    dropLastWhile(gtId(__, maxNew)),
    dropWhile(ltId(__, minNew))
  )(currentIds);
export const findInnerDiff = curry(
  (currentIds: readonly unknown[], incomingIds: readonly unknown[]) => {
    if (isEmpty(currentIds)) return [];
    // const minNew = reduce(minBy(idComp), '0', newTweets)
    // const maxNew = reduce(maxBy(idComp), Number.MAX_SAFE_INTEGER.toString(), newTweets)
    const sortedNew = sortKeys(incomingIds);
    const minNew = sortedNew[0];
    const maxNew = sortedNew[sortedNew.length - 1];
    const overlappingOldTweets = overlap(minNew, maxNew, currentIds);
    console.log(`counting deleted tweets from ${minNew} to ${maxNew}`, {
      overlappingOldTweets,
      currentIds,
      incomingIds,
    });
    return difference(overlappingOldTweets, incomingIds);
  }
);

/* Importers */

export const apiSearchToTweet = (entry: Status): thTweet => {
  let tweet: {} = apiToTweet(entry);
  tweet = {
    ...tweet,
    favorite_count: entry.favorite_count,
    retweet_count: entry.retweet_count,
    reply_count: entry.reply_count,
    quote_count: entry.quote_count,
    favorited: entry.favorited,
    conversation_id: entry.conversation_id_str,
  };
  return tweet;
};

// FUNCTIONAL ATTEMPT
// TOOD: make user and pic queue emit events
// export const apiToTweet = (entry) => {
//   let tweet: thTweet = {};
//   tweet.retweeted = isNil(prop('retweeted', entry))
//     ? false
//     : prop('retweeted', entry);
//   let rt_entry = entry;
//   if (tweet.retweeted) {
//     if (prop('retweeted_status', entry) != null)
//       tweet.orig_id = path(['retweeted_status', 'id_str'], entry);
//     rt_entry = !isNil(prop('retweeted_status', entry))
//       ? prop('retweeted_status', entry)
//       : entry;
//   }
//   tweet = toTweetCommon(tweet, rt_entry);
//   tweet.id = prop('id_str', entry);
//   //tweet contents
//   tweet.username = path(['user', 'screen_name'], rt_entry);
//   tweet.name = path(['user', 'name'], rt_entry);
//   tweet.text = unescape(prop('full_text', rt_entry) || prop('text', rt_entry));
//   tweet.profile_image = path(['user', 'profile_image_url_https'], rt_entry);
//   // Add full quote info.

//   if (tweet.has_quote && tweet.is_quote_up && prop('quoted_status', rt_entry)) {
//     const quoted_status = prop('quoted_status', rt_entry);
//     tweet.quote = makeApiQuote(quoted_status);
//   }
//   return tweet;
// };
const shortUrlRE = /https?:\/\/t.co\/([a-zA-Z0-9_]+).*/;
const longUrlRE = /(?:twitter.com|mobile.twitter.com)\/(.*)\/status\/([0-9]*)(?:\/)?(?:\?.*)?$/;
export const getArchQtId = (t: ArchTweet) => {
  const urls: [] = defaultTo([], path(['entities', 'urls'], t));
  const shortUrlSearch = shortUrlRE.exec(t.full_text);
  if (isNil(shortUrlSearch)) return null;
  const shortUrl = R.nth(0, shortUrlSearch);
  if (isNil(shortUrl)) return null;
  const urlObj = R.find((x) => R.propEq('url', shortUrl, x), urls);
  const longUrl = prop('expanded_url', urlObj);
  const longUrlSearch = longUrlRE.exec(longUrl);
  if (isNil(longUrlSearch)) return null;
  const id = R.nth(2, longUrlSearch);
  if (isNil(id)) return null;
  return id;
};

const _findAuthor = (screenName: string, t: ArchTweet) =>
  t.entities?.user_mentions?.find((t) => {
    return t.screen_name?.toLowerCase() === screenName.toLowerCase();
  });
// returns null if it's not a retweet
export const getArchUserId = (
  t: ArchTweet
): { name: string; screen_name: string; id: string; id_str: string } => {
  let rt = rtRE.exec(prop('full_text', t));
  if (isNil(rt)) return null;
  const screenName = rt[1];
  const author = _findAuthor(screenName, t);
  const id = author.id_str ?? null;
  const name = author.name ?? null;
  const screen_name = author.screen_name ?? null;
  // return {name, screen_name, id};
  return author ?? null;
};

export const patchArchivePrep = curry(
  (userInfo: User, t: ArchTweet): ArchTweet => {
    let _t = pipe(() => t, patchArchQtId, patchArchUser(userInfo))();
    return _t;
  }
);

export const patchArchUser = curry(
  (userInfo: User, t: ArchTweet): ArchTweet => {
    const rtAuthor = getArchUserId(t);
    const user = isNil(rtAuthor) ? userInfo : rtAuthor;
    const userProp = R.pick(['id', 'id_str', 'screen_name', 'name'], user);
    let _t = pipe(
      () => t,
      // R.assoc('user_id', user.id),
      // R.assoc('user_id_str', user.id_str),
      // R.assoc('screen_name', user.screen_name),
      // R.assoc('name', user.name),
      R.assoc('user', userProp),
      R.assoc('retweeted', !isNil(rtAuthor)),
      R.assoc('text', prop('full_text', t).replace(rt_tag, ''))
    )();
    return _t;
  }
);

export const patchArchQtId = (t: ArchTweet): ArchTweet => {
  const qtId = getArchQtId(t);
  let _t = t;
  if (isNil(qtId)) {
    _t = R.assoc('has_quote', false, _t);
  } else {
    _t = pipe(
      () => _t,
      R.assoc('has_quote', true),
      R.assoc('quoted_status_id_str', qtId)
    )();
  }
  return _t;
};

export const archToTweet = curry(
  (t: ArchTweet): thTweet => {
    let initTweet = {};
    let tweet = toTweetCommon(initTweet, t);
    return tweet;
  }
);

export const apiToTweet = (entry: Status) => {
  let tweet: thTweet = {};
  tweet = toTweetCommon(tweet, entry);
  return tweet;
};

export const bookmarkToTweet = pipe(apiToTweet, R.assoc('is_bookmark', true));

export const assocUserProps = (tweet: thTweet, user: FullUser) => {
  const picUrl =
    prop('profile_image_url', user) ??
    prop('profile_image_url_https', user) ??
    default_pic_url;
  return pipe(
    () => tweet,
    R.when(
      (_) => R.has('screen_name', user),
      R.assoc('username', prop('screen_name', user))
    ),
    R.when(
      (_) => R.has('id_str', user),
      R.assoc('user_id', prop('id_str', user))
    ),
    R.when((_) => R.has('name', user), R.assoc('name', prop('name', user))),
    R.assoc('profile_image', picUrl)
  )();
};

export const assocUserPropsDisplay = (tweet: thTweet, user: User) => {
  const picUrl =
    prop('profile_image_url', user) ??
    prop('profile_image_url_https', user) ??
    default_pic_url;
  return pipe(
    () => tweet,
    R.assoc('username', prop('screen_name', user)),
    R.assoc('user_id', prop('id_str', user)),
    R.assoc('name', prop('name', user)),
    R.assoc('profile_image', picUrl)
  )();
};

//no qt
const toTweetCommon = (thTweet: thTweet, t: Status) => {
  thTweet.retweeted = t.retweeted ?? false;
  // orig_id is the id of the RT, rather than the tweet retweeted itself
  if (thTweet.retweeted) {
    thTweet.id =
      t.retweeted_status_id_str ?? t.retweeted_status?.id_str ?? t.id_str;
    thTweet.orig_id = prop('id_str', t);
    t = t.retweeted_status ?? t;
  } else if (t.retweeted_status) {
    thTweet.id = t.retweeted_status.id_str ?? t.id_str;
    thTweet.orig_id = prop('id_str', t);
    t = t.retweeted_status ?? t;
  } else {
    thTweet.id = prop('id_str', t);
  }
  // Not: orig_id is the id of the original tweet, rather than the retweet itself
  // if (thTweet.retweeted) {
  //   thTweet.orig_id =
  //     t.retweeted_status_id_str ?? t.retweeted_status?.id_str ?? t.id_str;
  //   thTweet.id = prop('id_str', t);
  //   t = t.retweeted_status ?? t;
  // } else if (t.retweeted_status) {
  //   thTweet.orig_id = t.retweeted_status.id_str ?? t.id_str;
  //   thTweet.id = prop('id_str', t);
  //   t = t.retweeted_status ?? t;
  // } else {
  //   thTweet.id = prop('id_str', t);
  // }
  // Basic info, same for everyone
  thTweet.time = new Date(prop('created_at', t)).getTime() ?? 0;
  // thTweet.human_time = new Date(prop('created_at', t)).toLocaleString()
  // Replies/mentions.
  thTweet.reply_to = t.in_reply_to_screen_name ?? null; // null if not present
  thTweet.mentions = getMentionsFromTweet(t) ?? [];
  // URLs.
  thTweet.urls = getUrlsFromTweet(t);
  // Media.
  thTweet.has_media = !isNil(t.entities?.media);
  thTweet.media = null;
  // Quote info.
  thTweet.has_quote = t.is_quote_status ?? false;
  thTweet.is_quote_up = !isNil(t.quoted_status);
  thTweet.quote = null;
  thTweet.is_bookmark = false;
  thTweet.text = unescape(
    defaultTo('', prop('full_text', t) || prop('text', t)).toString()
  );
  if (!isNil(t.user)) {
    thTweet = assocUserProps(thTweet, t.user);
    // thTweet.username = path(['user', 'screen_name'], t);
    // thTweet.user_id = path(['user', 'id_str'], t);
    // thTweet.name = path(['user', 'name'], t);
    // thTweet.profile_image =
    //   t.user?.profile_image_url ??
    //   t.user?.profile_image_url_https ??
    //   default_pic_url;
  }
  // Add media info.
  if (thTweet.has_media) {
    thTweet.media = getMediaTweet(t);
  }
  if (thTweet.has_quote && thTweet.is_quote_up) {
    const quoted_status = prop('quoted_status', t);
    thTweet.quote = makeApiQuote(quoted_status);
  }
  return thTweet;
};
