import {getData, setData, makeOnStorageChanged} from '../utils/dutils.jsx';
import { flattenModule, inspect} from '../utils/putils.jsx';
import { isNil, unescape } from 'lodash';
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

// archToTweet :: archive_entry -> th_tweet
export const archToTweet = curry((getUserInfo, entry)=>{
  const user_info = getUserInfo()
  const default_pic_url = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
  let re = /RT @([a-zA-Z0-9_]+).*/
  let rt_tag = /RT @([a-zA-Z0-9_]+:)/
  let t = prop('tweet', entry)
  let rt = re.exec(prop('full_text', t));  
  const isOwnTweet = isNil(rt) || rt[1] === prop('screen_name', user_info)
  const findAuthor =  t=>path(['entities', 'user_mentions'], t).find(t=>{return prop('screen_name', t).toLowerCase() === rt[1].toLowerCase()})

  const init_tweet = {
    username : !isNil(rt) ? rt[1] : prop('screen_name', user_info),
    text: unescape(!isNil(rt) ? prop('full_text', t).replace(rt_tag,'') : prop('full_text', t)),
    name: isOwnTweet ? prop('name', user_info) : prop('name', findAuthor(t)),  // If I'm tweeting/retweeting myself
    profile_image: isOwnTweet ? prop('profile_image_url_https', user_info) : default_pic_url,
    retweeted: isOwnTweet ? false : true
  }

  let tweet = toTweetCommon(init_tweet,t)
  // Add full quote info.
  if (prop('has_quote', tweet) && prop('is_quote_up', tweet) && prop('quoted_status', tweet)) { 
    const quoted_status = prop('quoted_status', tweet)
    tweet.quote = {
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
      has_media: typeof path(['entities', 'media'], quoted_status) !== "undefined",
      media: null,
    }
    if (prop('quote', tweet).has_media) {
      tweet.quote.media = path(['entities', 'media'], quoted_status).map(x => ({current_text: x.url, url: x.media_url_https}))
    }
  }
  return tweet
})


const toTweetCommon = (tweet, t) => {
  // Basic info, same for everyone
  tweet.id = t.id_str
  // tweet.id = t.id,
  tweet.time = new Date(t.created_at).getTime()
  // tweet.human_time = new Date(t.created_at).toLocaleString()
  // Replies/mentions.
  tweet.reply_to = !isNil(t.in_reply_to_screen_name) ? t.in_reply_to_screen_name : null // null if not present.
  tweet.mentions = !isNil(path(['entities','user_mentions'], t)) ? t.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})) : []
  // URLs.
  tweet.urls = !isNil(path(['entities','urls'], t)) ? t.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})) : []
  // Media.
  tweet.has_media = !isNil(path(['entities','media'], t))
  tweet.media = null
  // Quote info. 
  tweet.has_quote = isNil(t.is_quote_status) ? false :t.is_quote_status
  tweet.is_quote_up = !isNil(t.quoted_status)
  tweet.quote = null
  tweet.is_bookmark = false
  // Add media info.
  if (tweet.has_media) {
    tweet.media = t.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
  }
  
  return tweet
}