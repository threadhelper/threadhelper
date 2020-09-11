import {getData, setData, makeOnStorageChanged} from '../utils/dutils.jsx'
import { curry, difference, prop, reverse, minBy, maxBy, dropLastWhile, dropWhile, gt, lt, reduce, map, pipe } from 'ramda'


export const getUserInfo = async (getAuthInit) => await fetch(`https://api.twitter.com/1.1/account/verify_credentials.json`,getAuthInit()).then(x => x.json())

export const updateQuery = async (getAuthInit, username, count) => await fetch(makeUpdateQueryUrl(username, count), getAuthInit()).then(x => x.json())


const getMaxId = (res) => res.length > 1 ? res[res.length - 1].id : null


// fetch as many tweets as possible from the timeline
export const timelineQuery = async (getAuthInit, user_info) => await query(getAuthInit, user_info.screen_name, user_info.statuses_count, -1, [])

// res is the accumulator, should be called as [], max_id initialized as -1
const query = curry( async (getAuthInit, username, count, max_id, res) => {
  const stop_condition = (res, count, max_id)=>(res.length >= count || !(max_id != null)) //stop if got enough tweets or if max_id is null (twitter not giving any more)
  if (stop_condition(res, count, max_id)) return res

  const url = makeTweetQueryUrl(max_id, username, count)
  const req_res = await fetch(url, getAuthInit()).then(x => x.json())
    
  return await query(getAuthInit, username, count, getMaxId(req_res), res.concat(req_res))
})


const makeTweetQueryUrl = curry( (max_id, username, count) => {
  const max_param = max_id > 0 ? `&max_id=${max_id}` : '';
  return `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}${max_param}&include_rts=1&tweet_mode=extended`
} )

const makeUpdateQueryUrl = makeTweetQueryUrl(-1)


function updateMeta(new_tweets, count){
  let old_meta = this.tweets_meta
  let len = Object.keys(new_tweets).length - 1
  let first_key = Object.keys(new_tweets)[0]
  let last_key = Object.keys(new_tweets)[len]
  let meta = {
    count: count, 
    max_id: Math.min(new_tweets[last_key].id, old_meta.max_id),
    max_time: Math.min(new_tweets[last_key].time, old_meta.max_time),
    since_id: Math.max(new_tweets[first_key].id, old_meta.since_id),
    since_time: Math.max(new_tweets[first_key].time, old_meta.since_time),
    last_updated: (new Date()).getTime(),
  }
  return meta
}

function makeTweetsMeta(tweets){
  let meta = {}
  if (tweets != null){
    if (Object.keys(tweets).length>0){
      let len = Object.keys(tweets).length - 1
      let first_key = Object.keys(tweets)[0]
      let last_key = Object.keys(tweets)[len]
      meta = {
        count: len, 
        max_id: tweets[last_key].id, 
        max_time: tweets[last_key].time,
        since_id: tweets[first_key].id, 
        since_time: tweets[first_key].time,
        last_updated: (new Date()).getTime(),
      }
    }
  } else{
    meta = {
      count: 0, 
      max_id: null, 
      max_time: null,
      since_id: null, 
      since_time: null,
      last_updated: null,
    }
  }
  return meta
}

export const idComp = (b,a)=>{
  let res = null; 
  try {
    res = a.localeCompare(b,undefined,{numeric: true});  
  } catch (error) {
    console.log(error)
    console.log({a,b})
  }
  return res 
}


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

function toTweets(res, user_info, arch = false){
  let toTweet = (t)=>{let tweet = toTweet(t,false,user_info); return [tweet.id, tweet]}
  let archToTweet = (t)=>{let tweet = toTweet(t,true,user_info); return [tweet.id, tweet]}
  let new_tweet_list = arch ? res.map(archToTweet) : res.map(toTweet);
  let new_tweets = Object.fromEntries(new_tweet_list)
  return new_tweets
}

// TOOD: make user and pic queue emit events 
const _toTweet = curry ((arch, user_info, entry) => {
  let return_tweet = {}
  let tweet = {};
  let user_queue = []
  let pic_tweet_queue = []

  entry = arch ? entry.tweet : entry;
  
  let re = /RT @([a-zA-Z0-9_]+).*/
  let rt_tag = /RT @([a-zA-Z0-9_]+:)/
  let default_pic_url = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
  try{
    if (entry != null){
      tweet.id = entry.id_str
      //Handing retweets in archive
      if(arch){
        let rt = re.exec(entry.full_text);  
        //tweet contents
        tweet.username = rt != null ? rt[1] : user_info.screen_name
        tweet.text = rt != null ? entry.full_text.replace(rt_tag,'') : entry.full_text
        // If I'm tweeting/retweeting myself
        if(tweet.username == user_info.screen_name){
          tweet.name = user_info.name
          tweet.profile_image = user_info.profile_image_url_https
        } 
        // if I'm retweeting someone else
        else{
          tweet.profile_image = default_pic_url
          try{
            let author = entry.entities.user_mentions.find(t=>{return t.screen_name.toLowerCase() == tweet.username.toLowerCase()})
            tweet.name = author != null ? author.name : tweet.username
            user_queue.push(author.id_str)
            pic_tweet_queue[entry.id_str] = author.id_str
            tweet.retweeted = true
          } catch(e){
            console.log("ERRORRRRRRRR", e)
            console.log("RT match",rt)
            console.log("tweet username",tweet.username)
            console.log(entry.entities.user_mentions)
          }
          //console.log(tweet); console.log(entry); wiz
        }
      }else{
        tweet.retweeted = entry.retweeted
        tweet.id = entry.id_str
        if(tweet.retweeted){
          if(entry.retweeted_status != null) tweet.orig_id = entry.retweeted_status.id_str
           entry = entry.retweeted_status != null ? entry.retweeted_status : entry;
          }
        //tweet contents
        tweet.username = entry.user.screen_name
        tweet.name = entry.user.name
        tweet.text = entry.full_text || entry.text
        tweet.profile_image = entry.user.profile_image_url_https
        
      }
        // Basic info, same for everyone
        // tweet.id = entry.id,
        tweet.time = new Date(entry.created_at).getTime()
        // tweet.human_time = new Date(entry.created_at).toLocaleString()
        // Replies/mentions.
        tweet.reply_to = entry.in_reply_to_screen_name != null ? entry.in_reply_to_screen_name : null // null if not present.
        tweet.mentions = entry.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices}))
        // URLs.
        tweet.urls = entry.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url}))
        // Media.
        tweet.has_media = typeof entry.entities.media !== "undefined"
        tweet.media = null
        // Quote info.
        tweet.has_quote = entry.is_quote_status
        tweet.is_quote_up = typeof entry.quoted_status !== "undefined"
        tweet.quote = null
      // Add media info.
      if (tweet.has_media) {
        tweet.media = entry.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
      }
      // Add full quote info.
      if (tweet.has_quote && tweet.is_quote_up) {
        tweet.quote = {
          // Basic info.
          text: entry.quoted_status.full_text || entry.quoted_status.text,
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
    }
  } catch(e){
    console.log("error in totweet", e)
    console.log("error in totweet", entry)
    throw(e)
  }
  // wiz.user_queue = user_queue
  // wiz.pic_tweet_queue = pic_tweet_queue
  return tweet
})


export const archToTweet = _toTweet(true)
export const toTweet = _toTweet(false)

export const findDeletedIds = (currentIds, incomingIds) =>{
  // const minNew = reduce(minBy(idComp), '0', newTweets)
  // const maxNew = reduce(maxBy(idComp), Number.MAX_SAFE_INTEGER.toString(), newTweets)
  const sortedNew = sortKeys(incomingIds)
  const minNew = sortedNew[0]
  const maxNew = sortedNew[sortedNew.length - 1]
  const overlappingOldTweets = pipe(sortKeys,dropLastWhile(gt(maxNew)), dropWhile(lt(minNew)))(currentIds)
  return difference(overlappingOldTweets, incomingIds)
}


// TODO make functional
export async function getLatestTweets(n_tweets, getRT, db_get, screen_name, keys){
  // let keys = utils.db.getAllKeys('tweets')
  let latest = []

  // for (let k of reverse(sortKeys(keys))){
  for (let k of sortKeys(keys)){
    let t = await db_get('tweets',k)
    if(getRT){  
      latest.push(t)
    } else{
      if(t.username == screen_name) latest.push(t)
    }
    if(latest.length >= n_tweets) break;
  }
  // let latest = (keys.slice(0, n_tweets).map(k=>{return await utils.getDB(k)}))
  return latest
}

// // Finds tweets in our db that are no longer online as evidenced by the request we just got
// // til_end: find from earliest in res until now, instead of until the newest in res
// function findDeletedTweets(res, tweet_ids, til_end = true){
//   //get only the range in our results
//   let from_id = res[res.length-1].id_str
//   let from = tweet_ids.findIndex((tid,idx,ar)=> {return tid==from_id})
//   let to = 0
//   if (!til_end){
//     let to_id = res[0].id_str
//     to = tweet_ids.findIndex((tid,idx,ar)=> {return tid==to_id})
//   } else{
//     to = 0
//   }
//   tweet_ids = tweet_ids.slice(to,from)
//   let res_ids = res.map(t=>t.id_str)
//   tweet_ids = tweet_ids.filter(tid=>!res_ids.includes(tid))
//   console.log('found deleted tweets', tweet_ids)
//   return tweet_ids
// }


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

// let tid = '1284519292982005760'
export const fetchTweet = async (tid) => {
  let url = (tid)=>{return `https://api.twitter.com/1.1/statuses/show.json?id=${tid}&tweet_mode=extended`}
  let tweet =  await fetch(url(tid),auth.init()).then(x=>x.json())//.then(x=>x.in_reply_to_status_id_str)
  return tweet
}


export const getThreadAbove = async (tid) => {
  let tweet_list = []
  let cur_tweet = {}
  let id = tid
  let prev_id = 0
  while(id != prev_id && id != null){
      prev_id = id
      cur_tweet = await fetchTweet(id)
      id = cur_tweet.in_reply_to_status_id_str
      tweet_list = [cur_tweet,...tweet_list]
  }
  console.log(tweet_list)
  return tweet_list
}

