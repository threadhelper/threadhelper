import {getData, setData, makeOnStorageChanged} from '../utils/dutils.jsx';
import { flattenModule, inspect} from '../utils/putils.jsx';
import { unescape } from 'lodash';
import * as R from 'ramda';
flattenModule(global,R)

// helper functions
const getMaxId = (res) => res.length > 1 ? res[res.length - 1].id : null

// Fetches, IMPURE
export const fetchUserInfo = async (getAuthInit) => await fetch(`https://api.twitter.com/1.1/account/verify_credentials.json`,getAuthInit()).then(x => x.json())
export const updateQuery = async (getAuthInit, username, count) => await fetch(makeUpdateQueryUrl(username, count), getAuthInit()).then(x => x.json())
export const tweetLookupQuery = curry(async (getAuthInit, ids) => {
  return await fetch(`https://api.twitter.com/1.1/statuses/lookup.json?id=${R.join(",",ids)}`, getAuthInit()).then(x => x.json())
})



// fetch as many tweets as possible from the timeline
export const timelineQuery = async (getAuthInit, user_info) => await query(getAuthInit, user_info.screen_name, user_info.statuses_count, -1, [])


const stop_condition = (res, count, max_id)=>(res.length >= count || !(max_id != null)) //stop if got enough tweets or if max_id is null (twitter not giving any more)

// res is the accumulator, should be called as [], max_id initialized as -1
const query = curry( async (getAuthInit, username, count, max_id, res) => {
  if (stop_condition(res, count, max_id)) return res

  const req_res = await fetch(makeTweetQueryUrl(max_id, username, count), getAuthInit()).then(x => x.json())
    
  return await query(getAuthInit, username, count, getMaxId(req_res), res.concat(req_res))
})


const makeTweetQueryUrl = curry( (max_id, username, count) => {
  const max_param = max_id > 0 ? `&max_id=${max_id}` : '';
  return `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}${max_param}&include_rts=1&tweet_mode=extended`
} )

const makeUpdateQueryUrl = makeTweetQueryUrl(-1)


export const idComp = (a,b)=>a.localeCompare(b,undefined,{numeric: true})
// gt for ids
const gtId = curry((a,b) => idComp(a,b) > 0)
//lt for ids
const ltId = curry((a,b) => idComp(a,b) < 0)

function sortKeys(keys){
  return keys.sort(idComp)
}

// newest (largest id) first
function sortTweets(tweetDict){
  let keys = Object.keys(tweetDict)
  let skeys = sortKeys(keys)
  let stobj = Object.fromEntries(skeys.map((k)=>{return[k,tweetDict[k]]}))
  return stobj
}

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
  tweet.retweeted = isNil(entry.retweeted) ? false : entry.retweeted
  tweet.id = entry.id_str
  if(tweet.retweeted){
    if(entry.retweeted_status != null) tweet.orig_id = entry.retweeted_status.id_str
      entry = entry.retweeted_status != null ? entry.retweeted_status : entry;
    }
  //tweet contents
  tweet.username = entry.user.screen_name
  tweet.name = entry.user.name
  tweet.text = unescape(entry.full_text || entry.text)
  tweet.profile_image = entry.user.profile_image_url_https

  tweet = toTweetCommon(tweet,entry)
  // Add full quote info.
  if (tweet.has_quote && tweet.is_quote_up) { 
    tweet.quote = {
      // Basic info.
      text: unescape(entry.quoted_status.full_text || entry.quoted_status.text),
      name: entry.quoted_status.user.name,
      username: entry.quoted_status.user.screen_name,
      time: new Date(entry.quoted_status.created_at).getTime(),
      profile_image: entry.quoted_status.user.profile_image_url_https,
      // Replies/mentions.
      reply_to: entry.quoted_status.in_reply_to_screen_name,
      mentions: entry.quoted_status.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})),
      // URLs.
      urls: entry.quoted_status.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
      has_media: typeof entry.quoted_status.entities.media !== "undefined",
      media: null,
    }
    if (tweet.quote.has_media) {
      tweet.quote.media = entry.quoted_status.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
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
  let rt = re.exec(t.full_text);  
  const isOwnTweet = isNil(rt) || rt[1] === user_info.screen_name
  const findAuthor =  t=>t.entities.user_mentions.find(t=>{return t.screen_name.toLowerCase() === rt[1].toLowerCase()})

  const init_tweet = {
    username : !isNil(rt) ? rt[1] : user_info.screen_name,
    text: unescape(!isNil(rt) ? t.full_text.replace(rt_tag,'') : t.full_text),
    name: isOwnTweet ? user_info.name : findAuthor(t).name,  // If I'm tweeting/retweeting myself
    profile_image: isOwnTweet ? user_info.profile_image_url_https : default_pic_url,
    retweeted: isOwnTweet ? false : true
  }

  let tweet = toTweetCommon(init_tweet,t)
  // Add full quote info.
  if (tweet.has_quote && tweet.is_quote_up) { 
    tweet.quote = {
      // Basic info.
      text: unescape(t.quoted_status.full_text || t.quoted_status.text),
      name: t.quoted_status.user.name,
      username: t.quoted_status.user.screen_name,
      time: new Date(t.quoted_status.created_at).getTime(),
      profile_image: t.quoted_status.user.profile_image_url_https,
      // Replies/mentions.
      reply_to: t.quoted_status.in_reply_to_screen_name,
      mentions: t.quoted_status.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})),
      // URLs.
      urls: t.quoted_status.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
      has_media: typeof t.quoted_status.entities.media !== "undefined",
      media: null,
    }
    if (tweet.quote.has_media) {
      tweet.quote.media = t.quoted_status.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
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

export const findDeletedIds = (currentIds, incomingIds) =>{
  if(isEmpty(currentIds)) return []
  // const minNew = reduce(minBy(idComp), '0', newTweets)
  // const maxNew = reduce(maxBy(idComp), Number.MAX_SAFE_INTEGER.toString(), newTweets)
  const sortedNew = sortKeys(incomingIds)
  const minNew = sortedNew[0]
  const maxNew = sortedNew[sortedNew.length - 1]
  const overlappingOldTweets = pipe(sortKeys,dropLastWhile(gtId(maxNew)), dropWhile(ltId(minNew)))(currentIds)
  console.log(`counting deleted tweets from ${minNew} to ${maxNew}`)
  return difference(overlappingOldTweets, incomingIds)
}

const getDocUsername = (ref) => index.documentStore.getDoc(ref).username
const isRT = propEq()
const isBookmark = prop('is_bookmark')
const isReply = x=>!isNil(x.reply_to) && x.reply_to === x.username

// To see if a tweet can be sampled according to search filters
const makeValidityTest = (filters, screen_name)=>{
  const isRT = t=>((t.username != screen_name) && !t.is_bookmark)
  const isBookmark = prop('is_bookmark')
  const isReply = t=>!isNil(t.reply_to) && t.reply_to != t.username  
  const isValidTweet = t => 
  (filters.getRTs || !isRT(t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t))
  return isValidTweet
}
// takeRandomSample :: [id] -> generator(id)
export const genRandomSample = (keys)=>{
  const rnd = Math.random(); 
  return pipe(
    length,
    multiply(rnd), 
    Math.floor, 
    nth(__,keys))(keys)}

// get random tweets as a serendipity generator
// TODO make functional

export const getDefaultTweets = curry(async (sampleFn, n_tweets, filters, db_get, screen_name, getKeys) => {
  let sample = []
  const keys = await getKeys()
  const isFull = (sample) => sample.length >= n_tweets || sample.length >= keys.length
  // const isValidTweet = makeValidityTest(filters, screen_name)
  const isRT = t=>(!propEq('username', screen_name, t) && !prop('is_bookmark', t))
  const isBookmark = prop('is_bookmark')  
  const isReply = t=>!isNil(prop('reply_to', t)) && prop('reply_to', t) != prop('username', t)  
  const isValidTweet = t => 
  (filters.getRTs || !isRT(t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t))

  while(!isFull(sample)){
    await pipe(
      sampleFn,
      db_get('tweets'),
      andThen(pipe(
        when(
          isValidTweet, 
          t=>sample.push(t))))
      )(keys)
  }
  return sample
})

export const getRandomSampleTweets = getDefaultTweets(genRandomSample)

// TODO make functional
export async function getLatestTweets(n_tweets, filters, db_get, screen_name, getKeys){
  // let keys = utils.db.getAllKeys('tweets')
  let latest = []
  const isFull = (latest) => latest.length >= n_tweets
  const isRT = t=>((t.username != screen_name) && !t.is_bookmark)
  const isBookmark = prop('is_bookmark')
  const isReply = t=>!isNil(t.reply_to) && t.reply_to != t.username  
  const isValidTweet = t => 
  (filters.getRTs || !isRT(t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t))

  
  for (const k of reverse(sortKeys(await getKeys()))){
    const t = await db_get('tweets',k)
    isValidTweet(t) ? latest.push(t) : null
    if(isFull(latest)) break;
  }
  return latest
}

async function getProfilePics(){
  console.log("getting profile pics")
  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  // let url = (name)=>{return `https://api.twitter.com/1.1/users/show.json?user_id=${name}`}
  //takes comma-separated list of user_ids
  let url = (ids)=>{return `https://api.twitter.com/1.1/users/lookup.json?user_id=${ids}`}
  let pic = ''
  let obj = {}
  let res = {}
  let temp_users = {}

  this.user_queue = this.user_queue.filter(x=>{return x != '-1'})
  this.pic_tweet_queue = Object.fromEntries(Object.entries(this.pic_tweet_queue).filter(x=>{return x[1] != '-1'}))
  //split array into chunks
  var i,j,ids,temparray,chunk = 100;
  for (i=0,j=this.user_queue.length; i<j; i+=chunk) {
      temparray = this.user_queue.slice(i,i+chunk);
      ids = temparray.join(',')
      try{
        res = await fetch(url(ids),init).then(x => x.json())
      } catch(e){
        console.log(e)
        console.log("error looking users up", ids)
      }
      
      //Basically add new profile pics to the profile pic holder
      try{
        this.profile_pics = Object.assign(this.profile_pics, Object.fromEntries(res.map(u=>{return [u.id_str, u.profile_image_url_https]})))
      } catch(e){
        console.log(res)
        console.log(e)
        throw("ERROR GETTING PROFILE PICS")
      }
      this.users = Object.assign(this.users, Object.fromEntries(res.map(u=>{return [u.id_str, u]})))
      //console.log(pic)
      // do whatever
  }
  // Gets tweets from storage to add to them
  // For each tweet without pic (which is why its in the queue), assign it its user's profile pic
  // After storing again, delete the profile pics
  getData("tweets").then((tweets)=>{
    for (let key_val of Object.entries(this.pic_tweet_queue)){
      // tweets[key_val[0]].profile_image = Object.keys(this.profile_pics).includes(key_val[1]) ? this.profile_pics[key_val[1]] : this.profile_pics[key_val[1]]
      tweets[key_val[0]].profile_image =  this.profile_pics[key_val[1]]
      tweets = sortTweets(tweets)
    }
    setData({tweets:tweets}).then(()=>{
      this.profile_pics = {}
      this.user_queue = []
      this.pic_tweet_queue = {}
      console.log("done setting profile pics")
    })
  })
}
// 

// (IMPURE) fetchTweet :: tid -> tweet
const fetchTweet = async (getAuthInit,tid)=>{
  const url = (tid)=>{return `https://api.twitter.com/1.1/statuses/show.json?id=${tid}&tweet_mode=extended`}
  const tweet =  await fetch(url(tid),getAuthInit()).then(x=>x.json())//.then(x=>x.in_reply_to_status_id_str)
  return tweet
}

// (IMPURE) getThreadAbove :: tid -> [tweet]
// init : thread [], counter 0
const maxThreadSize = 20;
export const getThreadAbove = curry(async (getAuthInit, counter, tid)=>{
  // console.log('getting thread above', tid)
  if (isNil(tid) || isEmpty(tid) || counter > maxThreadSize) return []
  const cur = await fetchTweet(getAuthInit,tid)
  // console.log('current tweet', cur)
  const thread_above = await getThreadAbove(getAuthInit, counter+1, cur.in_reply_to_status_id_str)
  // console.log('thread above', thread_above)
  return [...thread_above, cur]
})


const bookmark_url = "https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweets=true&count=10000&ext=mediaStats%2CcameraMoment"
const getBookmarkTweets = pipe(path(['globalObjects', 'tweets']), x=>Object.values(x))
const getBookmarkUsers = pipe(path(['globalObjects', 'users']))
const getQtId = pipe(prop('quoted_status_id_str'))
// const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })
const assocUser =  curry((users, tweet) => assoc('user', users[tweet.user_id_str], tweet))
// const assocQTs =  curry((qts, tweet) => assoc('quote', qts[tweet.quoted_status_id_str], tweet))
const assocQTs =  curry((qts, tweet) => when(pipe(prop('quoted_status_id_str'), isNil, not),
  pipe(assoc('quoted_status', qts[tweet.quoted_status_id_str]), assoc('is_quote_status', true),))(tweet))

export async function getBookmarks(getAuthInit){
  const getBookmarkQTs = pipe(getBookmarkTweets, map(getQtId), filter(pipe(isNil, not)), tweetLookupQuery(getAuthInit), andThen(indexBy(prop('id_str'))), andThen(inspect('afterlookupquery')))
  const bookmarks = await fetch(bookmark_url,getAuthInit()).then(x => x.json())
  
  const assocUserToTweet = (users, tweet) => ({ ...tweet, user: users[tweet.user_id_str] })
  // let tweets = Object.values(bookmarks.globalObjects.tweets)
  const tweets = getBookmarkTweets(bookmarks)
  const users = getBookmarkUsers(bookmarks)
  const qts = await getBookmarkQTs(bookmarks)
  // add users
  const makeRes = pipe(getBookmarkTweets, map(assocUser(users)), map(assocQTs(qts)), inspect('bookmarks with qts'))
  const res = await makeRes(bookmarks)
  // QTs

  return values(res)
}



 