import {getData, setData, makeOnStorageChanged} from '../utils/dutils.jsx';
import { flattenModule, inspect, renameKeys} from '../utils/putils.jsx';
import { unescape } from 'lodash';
import * as R from 'ramda';
flattenModule(global,R)

const re = /RT @([a-zA-Z0-9_]+).*/
const rt_tag = /RT @([a-zA-Z0-9_]+:)/
const default_pic_url = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'



// // bookmarkToTweet :: apiBookmark -> tweet
// export const bookmarkToTweet = pipe(apiToTweet, assoc('is_bookmark', true))
export const bookmarkToTweet = (entry)=>{
  let tweet = apiToTweet(entry)
  tweet.is_bookmark = true
  return tweet
}


// FUNCTIONAL ATTEMPT
// TOOD: make user and pic queue emit events 
// apiToTweet :: apiTweet -> tweet
export const apiToTweet = (entry) => {
  let tweet = {};
  tweet.retweeted = isNil(prop('retweeted',entry)) ? false : prop('retweeted',entry)
  tweet.id = prop('id_str',entry)
  if(tweet.retweeted){
    if(prop('retweeted_status',entry) != null) tweet.orig_id = path(['retweeted_status', 'id_str'],entry)
      entry = prop('retweeted_status',entry) != null ? prop('retweeted_status',entry) : entry;
    }
  //tweet contents
  tweet.username = path(['user','screen_name'], entry)
  tweet.name = path(['user','name'], entry)
  tweet.text = unescape(prop('full_text', entry) || prop('text', entry))
  tweet.profile_image = path(['user', 'profile_image_url_https'], entry)

  tweet = toTweetCommon(tweet,entry)
  // Add full quote info.
  if (tweet.has_quote && tweet.is_quote_up && prop('quoted_status',entry)) { 
    const quoted_status = prop('quoted_status',entry)
    tweet.quote = {
      // Basic info.
      text: unescape(prop('full_text', quoted_status) || prop('text', quoted_status)),
      name: path(['user', 'name'], quoted_status),
      username: path(['user', 'screen_name'], quoted_status),
      time: new Date(prop('created_at', quoted_status)).getTime(),
      profile_image: path(['user','profile_image_url_https'], quoted_status),
      // Replies/mentions.
      reply_to: prop('in_reply_to_screen_name', quoted_status),
      mentions: defaultTo([], path(['entities','user_mentions'], quoted_status).map(x => ({username: x.screen_name, indices: x.indices}))),
      
      // URLs.
      urls: path(['entities','urls'], quoted_status).map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
      has_media: typeof path(['entities','media'], quoted_status) !== "undefined",
      media: null,
    }
    if (tweet.quote.has_media) {
      tweet.quote.media = path(['entities','media'], quoted_status).map(x => ({current_text: x.url, url: x.media_url_https}))
    }
  }
  return tweet
}

const findAuthor =  (rt, t) =>path(['entities', 'user_mentions'], t).find(t=>{return prop('screen_name', t).toLowerCase() === rt[1].toLowerCase()})

const getRTAuthor = (user_info, rt, t) => {
  if(isNil(rt)){
    return prop('name', user_info)
  }else{
    let author = rt[1]
    try{author = findAuthor(rt, t)}
    catch(e){console.log('ERROR getRTAuthor ',{e, user_info, rt, t})}
    return prop('name', author)
  }
}

const initArchRT = (user_info, rt,  t) => {
  return {
    username: isNil(rt) ? prop('screen_name', user_info) : rt[1],
    text: unescape(isNil(rt) ? prop('full_text', t).replace(rt_tag,'') : prop('full_text', t)),
    name: getRTAuthor(user_info, rt, t),
    profile_image: default_pic_url,
    retweeted: true,
  }
}
const initArchTweet = (user_info, t) => {
  return {
    username: prop('screen_name', user_info),
    text: unescape(prop('full_text', t)),
    name: prop('name', user_info), 
    profile_image: prop('profile_image_url_https', user_info),
    retweeted: false,
  }
}

// makeQuote :: archQuote -> quote
const makeQuote = quoted_status => {
  return {
    // Basic info.
    text: unescape(prop('full_text', quoted_status) || prop('text', quoted_status)),
    name: path(['user', 'name'], quoted_status),
    username: path(['user', 'screen_name'], quoted_status),
    time: new Date(prop('created_at', quoted_status)).getTime(),
    profile_image: path(['user', 'profile_image_url_https'], quoted_status),
    // Replies/mentions.
    reply_to: prop('in_reply_to_screen_name', quoted_status),
    mentions: defaultTo([],path(['entities', 'user_mentions'], quoted_status).map(x => ({username: x.screen_name, indices: x.indices}))),
    // URLs.
    urls: path(['entities', 'urls'], quoted_status).map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
    has_media: !isNil(path(['entities', 'media'], quoted_status)),
    media: defaultTo([], path(['entities', 'media'], quoted_status)).map(x => ({current_text: x.url, url: x.media_url_https})),
  }
}

const _isOwnTweet = (rt, user_info) => (isNil(rt) || rt[1] === prop('screen_name', user_info))
// archToTweet :: archTweet -> tweet
export const archToTweet = curry((getUserInfo, t)=>{
  const user_info = getUserInfo()
  let rt = re.exec(prop('full_text', t));  
  const isOwnTweet = _isOwnTweet(rt, user_info)
  const init_tweet = isOwnTweet ? initArchTweet(user_info, t) : initArchRT(user_info, rt, t)
  // const init_tweet = {
  //   username : !isNil(rt) ? rt[1] : prop('screen_name', user_info),
  //   text: unescape(!isNil(rt) ? prop('full_text', t).replace(rt_tag,'') : prop('full_text', t)),
  //   name: isOwnTweet ? prop('name', user_info) : prop('name', findAuthor(rt, t)),  // If I'm tweeting/retweeting myself
  //   profile_image: isOwnTweet ? prop('profile_image_url_https', user_info) : default_pic_url,
  //   retweeted: isOwnTweet ? false : true
  // }

  let tweet = toTweetCommon(init_tweet,t)
  // Add full quote info.
  if (prop('has_quote', tweet) && prop('is_quote_up', tweet) && prop('quoted_status', tweet)) { 
    const quoted_status = prop('quoted_status', tweet)
    tweet.quote = makeQuote(quoted_status)
    // if (prop('quote', tweet).has_media) {
    //   tweet.quote.media = defaultTo([], path(['entities', 'media'], quoted_status)).map(x => ({current_text: x.url, url: x.media_url_https}))
    // }
  }
  return tweet
})
// prop that defaults to null if undefined
const propDefNull = (name, t) => R.defaultTo(null, prop(name, t)) // propDefNull :: x | null

const getMentionsFromTweet = ifElse( // getMentionsFromTweet :: preTweet -> [mention] // preTweet :: apiTweet | archTweet
  path(['entities','user_mentions']),
  pipe(path(['entities', 'user_mentions']), map(x => ({username: prop('screen_name', x), indices: prop('indices', x)}))),
  _=>[],)
// !isNil(path(['entities','user_mentions'], t)) ? path(['entities', 'user_mentions'], t).map(x => ({username: x.screen_name, indices: x.indices})) : []

const getUrlsFromTweet = ifElse( // getUrlsFromTweet :: preTweet -> [url]
  path(['entities','urls']),
  pipe(path(['entities', 'urls']), map(x => ({current_text: prop('url', x), display: prop('display_url', x), expanded: prop('expanded_url', x)}))),
  _=>[],)
  // !isNil(path(['entities','urls'], t)) ? path(['entities', 'urls'], t).map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})) : []

const getMediaTweet = pipe(path(['entities', 'media']), map(x => ({current_text: x.url, url: x.media_url_https}))) // getUrlsFromTweet :: preTweet -> [media]

const toTweetCommon = (tweet_, t) => {
  // Basic info, same for everyone
  tweet_.id = prop('id_str', t)
  // tweet_.id = t.id,
  tweet_.time = new Date(prop('created_at', t)).getTime()
  // tweet_.human_time = new Date(prop('created_at', t)).toLocaleString()
  // Replies/mentions.
  tweet_.reply_to = propDefNull('in_reply_to_screen_name', t)// null if not present
  tweet_.mentions = defaultTo([], getMentionsFromTweet(t))
  // URLs.
  tweet_.urls = getUrlsFromTweet(t)
  // Media.
  tweet_.has_media = !isNil(path(['entities','media'], t))
  tweet_.media = null
  // Quote info. 
  tweet_.has_quote = defaultTo(false, prop('is_quote_status', t))
  tweet_.is_quote_up = !isNil(prop('quoted_status', t))
  tweet_.quote = null
  tweet_.is_bookmark = false
  // Add media info.
  if (tweet_.has_media) {
    tweet_.media = getMediaTweet(t)
  }
  return tweet_
}

export const validateTweet = t => {
  const valid = R.prop('id_str')
  if(!valid) console.log('ERROR invalid tweet', valid)
  return valid
}

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

