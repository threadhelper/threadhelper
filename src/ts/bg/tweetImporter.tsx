import unescape from 'lodash/unescape';
import * as R from 'ramda';
// flattenModule(global,R)
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
const re = /RT @([a-zA-Z0-9_]+).*/;
const rt_tag = /RT @([a-zA-Z0-9_]+:)/;
const default_pic_url =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png';
// // bookmarkToTweet :: apiBookmark -> tweet
// export const bookmarkToTweet = pipe(apiToTweet, assoc('is_bookmark', true))
export const bookmarkToTweet = (entry) => {
  let tweet = apiToTweet(entry);
  (tweet as any).is_bookmark = true;
  return tweet;
};
// FUNCTIONAL ATTEMPT
// TOOD: make user and pic queue emit events
// apiToTweet :: apiTweet -> tweet
export const apiToTweet = (entry) => {
  let tweet = {};
  (tweet as any).retweeted = isNil(prop('retweeted', entry))
    ? false
    : prop('retweeted', entry);
  let rt_entry = entry;
  if ((tweet as any).retweeted) {
    if (prop('retweeted_status', entry) != null)
      (tweet as any).orig_id = path(['retweeted_status', 'id_str'], entry);
    rt_entry =
      prop('retweeted_status', entry) != null
        ? prop('retweeted_status', entry)
        : entry;
  }
  tweet = toTweetCommon(tweet, rt_entry);
  (tweet as any).id = prop('id_str', entry);
  //tweet contents
  (tweet as any).username = path(['user', 'screen_name'], rt_entry);
  (tweet as any).name = path(['user', 'name'], rt_entry);
  (tweet as any).text = unescape(
    prop('full_text', rt_entry) || prop('text', rt_entry)
  );
  (tweet as any).profile_image = path(
    ['user', 'profile_image_url_https'],
    rt_entry
  );
  // Add full quote info.
  if (
    (tweet as any).has_quote &&
    (tweet as any).is_quote_up &&
    prop('quoted_status', entry)
  ) {
    const quoted_status = prop('quoted_status', entry);
    (tweet as any).quote = {
      // Basic info.
      text: unescape(
        prop('full_text', quoted_status) || prop('text', quoted_status)
      ),
      name: path(['user', 'name'], quoted_status),
      username: path(['user', 'screen_name'], quoted_status),
      time: new Date(prop('created_at', quoted_status)).getTime(),
      profile_image: path(['user', 'profile_image_url_https'], quoted_status),
      // Replies/mentions.
      reply_to: prop('in_reply_to_screen_name', quoted_status),
      // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
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
      // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
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
    if ((tweet as any).quote.has_media) {
      // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
      (tweet as any).quote.media = path(
        ['entities', 'media'],
        quoted_status
      ).map((x: { url: any; media_url_https: any }) => ({
        current_text: x.url,
        url: x.media_url_https,
      }));
    }
  }
  return tweet;
};
// @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
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
const initArchRT = (user_info, rt: any[], t) => {
  return {
    username: isNil(rt) ? prop('screen_name', user_info) : rt[1],
    text: unescape(
      isNil(rt)
        ? prop('full_text', t).replace(rt_tag, '')
        : prop('full_text', t)
    ),
    name: getRTAuthor(user_info, rt, t),
    profile_image: default_pic_url,
    retweeted: true,
  };
};
const initArchTweet = (user_info, t) => {
  return {
    username: prop('screen_name', user_info),
    text: unescape(prop('full_text', t)),
    name: prop('name', user_info),
    profile_image: prop('profile_image_url_https', user_info),
    retweeted: false,
  };
};
// makeQuote :: archQuote -> quote
const makeQuote = (quoted_status) => {
  return {
    // Basic info.
    text: unescape(
      prop('full_text', quoted_status) || prop('text', quoted_status)
    ),
    name: path(['user', 'name'], quoted_status),
    username: path(['user', 'screen_name'], quoted_status),
    time: new Date(prop('created_at', quoted_status)).getTime(),
    profile_image: path(['user', 'profile_image_url_https'], quoted_status),
    // Replies/mentions.
    reply_to: prop('in_reply_to_screen_name', quoted_status),
    // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
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
    // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
    urls: path(['entities', 'urls'], quoted_status).map(
      (x: { url: any; display_url: any; expanded_url: any }) => ({
        current_text: x.url,
        display: x.display_url,
        expanded: x.expanded_url,
      })
    ),
    has_media: !isNil(path(['entities', 'media'], quoted_status)),
    // @ts-expect-error ts-migrate(2533) FIXME: Object is possibly 'null' or 'undefined'.
    media: defaultTo([], path(['entities', 'media'], quoted_status)).map(
      (x: { url: any; media_url_https: any }) => ({
        current_text: x.url,
        url: x.media_url_https,
      })
    ),
  };
};
const _isOwnTweet = (rt: any[], user_info) =>
  isNil(rt) || rt[1] === prop('screen_name', user_info);
// archToTweet :: archTweet -> tweet
export const archToTweet = curry((user_info, t) => {
  let rt = re.exec(prop('full_text', t));
  const isOwnTweet = _isOwnTweet(rt, user_info);
  // ts-migrate(2345) FIXME: Argument of type 'RegExpExecArray | null' is not a... Remove this comment to see the full error message
  const init_tweet = isOwnTweet
    ? initArchTweet(user_info, t)
    : initArchRT(user_info, rt, t);
  // const init_tweet = {
  //   username : !isNil(rt) ? rt[1] : prop('screen_name', user_info),
  //   text: unescape(!isNil(rt) ? prop('full_text', t).replace(rt_tag,'') : prop('full_text', t)),
  //   name: isOwnTweet ? prop('name', user_info) : prop('name', findAuthor(rt, t)),  // If I'm tweeting/retweeting myself
  //   profile_image: isOwnTweet ? prop('profile_image_url_https', user_info) : default_pic_url,
  //   retweeted: isOwnTweet ? false : true
  // }
  let tweet = toTweetCommon(init_tweet, t);
  // Add full quote info.
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  if (
    prop('has_quote', tweet) &&
    prop('is_quote_up', tweet) &&
    prop('quoted_status', tweet)
  ) {
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    const quoted_status = prop('quoted_status', tweet);
    tweet.quote = makeQuote(quoted_status);
    // if (prop('quote', tweet).has_media) {
    //   tweet.quote.media = defaultTo([], path(['entities', 'media'], quoted_status)).map(x => ({current_text: x.url, url: x.media_url_https}))
    // }
  }
  return tweet;
});
// prop that defaults to null if undefined
const propDefNull = (name: string, t) => R.defaultTo(null, prop(name, t)); // propDefNull :: x | null
const getMentionsFromTweet = ifElse(
  // getMentionsFromTweet :: preTweet -> [mention] // preTweet :: apiTweet | archTweet
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
// !isNil(path(['entities','user_mentions'], t)) ? path(['entities', 'user_mentions'], t).map(x => ({username: x.screen_name, indices: x.indices})) : []
const getUrlsFromTweet = ifElse(
  // getUrlsFromTweet :: preTweet -> [url]
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
// !isNil(path(['entities','urls'], t)) ? path(['entities', 'urls'], t).map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})) : []
// @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
const getMediaTweet = pipe(
  path(['entities', 'media']),
  map((x) => ({ current_text: x.url, url: x.media_url_https }))
); // getUrlsFromTweet :: preTweet -> [media]
const toTweetCommon = (
  tweet_: {
    username?: any;
    text?: any;
    name?: any;
    profile_image?: any;
    retweeted?: boolean;
    id?: any;
    time?: any;
    reply_to?: any;
    mentions?: any;
    urls?: any;
    has_media?: any;
    media?: any;
    has_quote?: any;
    is_quote_up?: any;
    quote?: any;
    is_bookmark?: any;
  },
  t
) => {
  // Basic info, same for everyone
  tweet_.id = prop('id_str', t);
  // tweet_.id = t.id,
  tweet_.time = new Date(prop('created_at', t)).getTime();
  // tweet_.human_time = new Date(prop('created_at', t)).toLocaleString()
  // Replies/mentions.
  tweet_.reply_to = propDefNull('in_reply_to_screen_name', t); // null if not present
  tweet_.mentions = defaultTo([], getMentionsFromTweet(t));
  // URLs.
  tweet_.urls = getUrlsFromTweet(t);
  // Media.
  tweet_.has_media = !isNil(path(['entities', 'media'], t));
  tweet_.media = null;
  // Quote info.
  tweet_.has_quote = defaultTo(false, prop('is_quote_status', t));
  tweet_.is_quote_up = !isNil(prop('quoted_status', t));
  tweet_.quote = null;
  tweet_.is_bookmark = false;
  // Add media info.
  if (tweet_.has_media) {
    tweet_.media = getMediaTweet(t);
  }
  return tweet_;
};
export const validateTweet = (t: object): boolean => {
  const valid = R.prop('id_str');
  if (!valid) console.log('ERROR invalid tweet', valid);
  return !isNil(valid);
};
// const toTweetCommon = (tweet_, t) => {
//   // Basic info, same for everyone
//   tweet_.id = prop('id_str', t)
//   // tweet_.id = t.id,
//   tweet_.time = new Date(prop('created_at', t)).getTime()
//   // tweet_.human_time = new Date(prop('created_at', t)).toLocaleString()
//   // Replies/mentions.
//   tweet_.reply_to = !isNil(prop('in_reply_to_screen_name', t)) ? prop('in_reply_to_screen_name', t) : null // null if not present
//   tweet_.mentions = !isNil(path(['entities','user_mentions'], t)) ? path(['entities', 'user_mentions'], t).map(x => ({username: x.screen_name, indices: x.indices})) : []
//   // URLs.
//   tweet_.urls = !isNil(path(['entities','urls'], t)) ? prop('entities', t).urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})) : []
//   // Media.
//   tweet_.has_media = !isNil(path(['entities','media'], t))
//   tweet_.media = null
//   // Quote info.
//   tweet_.has_quote = isNil(prop('is_quote_status', t)) ? false : prop('is_quote_status', t)
//   tweet_.is_quote_up = !isNil(prop('quoted_status', t))
//   tweet_.quote = null
//   tweet_.is_bookmark = false
//   // Add media info.
//   if (tweet_.has_media) {
//     tweet_.media = path(['entities', 'media'], t).map(x => ({current_text: x.url, url: x.media_url_https}))
//   }
//   return tweet_
// }
// export const idComp = curry((a,b)=>a.localeCompare(b,undefined,{numeric: true})) // WRONG
export const idComp = curry((a, b) =>
  BigInt(a) == BigInt(b) ? 0 : BigInt(a) < BigInt(b) ? -1 : 1
);
const gtId = curry((a, b) => idComp(a, b) > 0); // gt for ids
const ltId = curry((a, b) => idComp(a, b) < 0); //lt for ids
export const sortKeys = (keys: string[]) => keys.sort(idComp);
//
// newest (largest id) first
function sortTweets(tweetDict: { [x: string]: any }) {
  let keys = Object.keys(tweetDict);
  let skeys = sortKeys(keys);
  let stobj = Object.fromEntries(
    skeys.map((k: string | number) => {
      return [k, tweetDict[k]];
    })
  );
  return stobj;
}
const overlap = (minNew, maxNew, currentIds: readonly unknown[]) =>
  pipe(
    sortKeys,
    dropLastWhile(gtId(__, maxNew)),
    dropWhile(ltId(__, minNew))
  )(currentIds);
// findInnerDiff :: [id] -> [id] -> [id] // finds currentIds ids in the range [min, max](incoming) which are missing in incomingIds
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
