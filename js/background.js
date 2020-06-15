"use strict";

// Stores auth and CSRF tokens once they are captured in the headers.


let user_info = {}

let options = {}

let interrupt_query = false

let tabId = null

let midRequest = false

function setUserInfo(res){
  user_info = res
  chrome.storage.local.set({ user_info: user_info }, function() {
    console.log("user_info stored", user_info)
  })
}

//returns a promise that gets from chrome local storage 
function getData(key) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(key, function(items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(items[key]);
      }
    });
  });
}

//returns a promise that gets from chrome local storage 
function setData(key_vals) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.set(key_vals, function(items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
}



function getTabId(){
  return new Promise(function(resolve, reject) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(tabs[0].id);
      }
    });  
  });
}


//** Activates the extension icon on twitter.com */
function onInstalled() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "twitter.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
}


async function loadOptions(){
  chrome.storage.local.get(["options"], r =>{
    if (typeof r.options !== "undefined"){
      options = r.options
      console.log("options loaded!")
    }
  })
}


/*
testAuth: checks if it's null, makes a request about current user
getAuth: load or reload page
updateAuth: turns headers into auth
*/

class Auth {
  constructor(csrfToken = null, authorization = null, since = null) {
    this.csrfToken = csrfToken;
    this.authorization = authorization;
    this.since = since
    
  }
  
  isAuth(){
    let auth = this;
    return ! (typeof auth === 'undefined' || auth.authorization == null || auth.csrfToken == null || auth.authorization == 'null' ||auth.csrfToken == 'null')
  }
  // is auth something rather than null and friend?
  isFresh(stale_thresh=1){
    // auths aren't explicitly expired, but I still don't exactly know what to do when the current one is bad and reloading doesn't get you a new one
    let auth = this;
    let fresh = false;
    if (!auth.isAuth()){
      //console.log("auth does not exist", auth)
      return false
    }
    else{ 
      var now = new Date()
      var msPerH = 60 * 60 * 1000; // Number of milliseconds per day
      //var stale_thresh = 0.05 //3m
      var hours_past = (now.getTime() - auth.since) / msPerH;
      if(hours_past <= stale_thresh) {
        fresh = true
      }
    }
    return fresh
  }
  //make a trivial request to make sure auth works
  //returns false if not good, and user info if good
  async testAuth(){
    let auth = this;
    let _user_info = null;
    if (this.isAuth() /*&& this.isFresh(auth)*/){
      try
      {
        const init = {
          credentials: "include",
          headers: {
            authorization: auth.authorization,
            "x-csrf-token": auth.csrfToken
          }
        };
        var uurl = `https://api.twitter.com/1.1/account/verify_credentials.json`
        console.log("testing auth getting user info")
        let res = await fetch(uurl,init).then(x => x.json())//.catch(throw new Error("caught in fetch")) 
        if(res != null)
        {
          setUserInfo(res)
          _user_info = user_info
          console.log("auth is good")
        }
      }
      catch(err){
          console.log("auth is stale")
          console.log(err)
      }
    }
    return _user_info
  }

  setParams(auth){
    this.csrfToken = auth.csrfToken;
    this.authorization = auth.authorization;
    this.since = auth.since
  }

  getParams(){
    return {csrfToken: this.csrfToken, authorization: this.authorization, since: this.since}
  }


  // check if good, tries to load, and reloads page if failed (to get an auth)
  // auths are produced when application cookie isn't there
  // reload will only work if cookie's missing
  // 
  async getAuth() {
    //try to get from storage first
    let success = false
    let auth = this
    let fresh = false
    //fresh = await auth.testAuth()
    // test if it's already a good auth
    if (fresh){
      console.log("current auth fresh af")
      success = true
    }
    // otherwise try to load from storage and test if it's good
    else{
      console.log("gonna load auth from storage")
      let data = await getData("auth");
      if (data != null && data.csrfToken != null && data.authorization != null) auth.setParams(data)

      if (await auth.testAuth()){
        console.log("got it")
        success = true
      }
      // if it's not good, delete it from storage
      else{
        console.log("couldn't or is bad, getting new auth")
        chrome.storage.local.remove(["auth"],function(){
          var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
          console.log("deleted stored auth")
        })
        //chrome.cookies.remove("auth_token")
        //chrome.cookies.getAll({domain: "twitter.com"/*, name:"auth"*/}, (r)=>{console.log("cookies",r)})
        success = false
        //finally reload page to get a new one
        this.getNew();
      }
    }
    return success
  }

  // tries to reload page to get a new auth
  async getNew(){
    let tabId = tabId == null ? await getTabId() : tabId
    var reload_ok = confirm("I'll have to reload the page to get my authorization token :)");
    if (reload_ok){
      chrome.tabs.reload(tabId);
    }
  }

  // Gets auth and csrf token Called before every request. Store only if expired.
  async updateAuth(csrfToken, authorization) {
    let auth_params = {}

    // gather auth params
    auth_params.csrfToken = csrfToken;
    auth_params.authorization = authorization;
    var now = new Date()
    auth_params.since = now.getTime()

    // set em
    this.setParams(auth_params)
    //let _user_info = await this.testAuth()
    // if it's good, store it
    chrome.storage.local.set({ auth: auth_params }, function() {
      //console.log("auth stored")
      //console.log(auth)
    })
    // if(await auth.testAuth()){
    //   console.log("auth good, storing")
    // } else{
    //   console.log("couldn't take auth from header")
    //   console.log(auth)
    // }
  }

}

let auth = new Auth();

// document.querySelector('#go-to-options').addEventListener(function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('options.html'));
//   }
// });
chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.webRequest.onBeforeSendHeaders.addListener(
  c => {
    processHeaders(c.requestHeaders);
  },
  { urls: ["https://api.twitter.com/*"] },
  ["requestHeaders"]
);
window.onload = () => {loadOptions()}




// called after reloading, checks if auth exists and if not
// can't send requests out of here bc sending requests sends a header and makes a feedback loop
  async function processHeaders(headers){
    // on mac there's a bug where updateAuth is called befor auth is defined,
    // so this is checking that
    // console.log("processing headers")
    if (typeof auth  === 'undefined'){
      console.log("auth was undefined, for some reason, gonna define it and do nothing else")
      auth = new Auth();
    }
    let csrfToken = null
    let authorization = null
    for (let header of headers) {
      //console.log(headers)
      if (header.name.toLowerCase() == "x-csrf-token") {
        csrfToken = header.value;
      } else if (header.name.toLowerCase() == "authorization") {
        authorization = header.value;
      }
    }
    if (csrfToken && authorization && csrfToken != "null" && authorization != "null"){
      //console.log("updatingAuth")
      auth.updateAuth(csrfToken,authorization)
    }
    else{
      console.log("header does not have auth")
    }
  }


//** Handles messages sent from popup or content scripts */
async function onMessage(m, sender) {
  console.log("message received:", m);
  let auth_good = null
  switch (m.type) {
    case "cs-created":
      tabId = tabId == null ? await getTabId() : tabId
      break;

    case "saveOptions":
      loadOptions()
      break;

    case "loadArchive":
      messageCS({type: "loadArchive"})
      // console.log(await nlp.getRelated("meme magic"))
      // console.log("archive loading", archive_tweets.slice(0,50))
      break;
    
    case "tempArchiveStored":
      updateTweets(m, "archive");
      break;

    case "saveArchive":
      messageCS({type: "save_archive"})
      // console.log(await nlp.getRelated("meme magic"))
      // console.log("archive loading", archive_tweets.slice(0,50))
      break;
      

    case "update":
      auth_good = await auth.testAuth()
      if(await auth_good != null){
        console.log("auth good", auth_good)
        updateTweets(m);
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, "update")
      }
      break;

    case "timeline":
      auth_good = await auth.testAuth()
      if(await auth_good != null){
        console.log("auth good", auth_good)
        updateTweets(m, "timeline");
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, "timeline")
      }
      break;

    case "load_history":
      auth_good = await auth.testAuth()
      if(auth_good  != null){
        console.log("auth good", auth_good)
        updateTweets(m, "archive");
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, "archive")
      }
      break;
    case "interrupt-query":
      interrupt_query = true;
      break;

    case "clear":
      // clear storage
      console.log("clearing storage")
      clearStorage()
      break;
  }
  return //Promise.resolve('done');
  ;
}


//clears storage of tweets, tweets meta info, and auth
function clearStorage(){
  chrome.storage.local.remove(["tweets","tweets_meta"/*,"auth"*/],function(){
    messageCS({type: "storage-clear"})
    var error = chrome.runtime.lastError;
       if (error) {
           console.error(error);
       }
   })
   return true
}


async function messageCS(m){
  let id = tabId == null ? await getTabId() : tabId
  console.log("sending message to cs tab ", id)
  chrome.tabs.sendMessage(id, m)
}


function updateTweets(m, update_type = "update"){
  //console.log("updating tweets");
  messageCS({type: "tweets-loading", update_type: update_type})
  if (!midRequest){
    midRequest = true
    chrome.storage.local.get(["tweets", "tweets_meta"], r =>{
      let since_id = null
      let since_date = null
      let max_id = null
      let max_date = null
      let tweets_meta = null
      if (typeof r.tweets_meta !== 'undefined' && typeof r.tweets_meta.since_id !== 'undefined'  && r.tweets_meta.since_id != null && typeof r.tweets_meta.max_id !== 'undefined'  && r.tweets_meta.max_id != null){
        since_id = r.tweets_meta.since_id
        max_id = r.tweets_meta.max_id
        max_date = formatDate(new Date(r.tweets_meta.max_time))
        since_date = formatDate(new Date(r.tweets_meta.since_time))
        
      }
      switch(update_type){
        case "archive":
          getData("temp_archive").then((temp_archive) => {
            saveTweets(temp_archive, update_type).then(()=>{
              messageCS({type: "tweets-done", update_type: update_type})
              midRequest = false
            })
          })
          break;
        case "update":
          updateQuery(auth, since_id).then((tweets)=>{
            messageCS({type: "tweets-done", update_type: update_type})
            midRequest = false
          })
          break;
        case "timeline":
          timelineQuery(auth, max_id).then(function(tweets) {
            messageCS({type: "tweets-done", update_type: update_type})
            midRequest = false
          });
          break;
        case "history":
          archiveQuery(auth, max_date).then((tweets)=>{
            messageCS({type: "tweets-done", update_type: update_type})
            midRequest = false
          })
          break;
      }
    });
  }
}


function makeTweetsMeta(tweets){
  var tweets_meta = {
    count: tweets.length, 
    max_id: tweets[tweets.length - 1].id, 
    max_time: tweets[tweets.length - 1].time,
    since_id: tweets[0].id, 
    since_time: tweets[0].time,
    last_updated: (new Date()).getTime()
  }
  return tweets_meta
}

function handleError(err){
  //console.log("handling tweet query error")
  switch (err.code){
    case 353: //"This request requires a matching csrf cookie and header."
      console.log("auth is bad, getting new")
      getNew();
    case 215: //""Bad Authentication data.""
      console.log("auth is bad, getting new")
      getNew();
    default:
      console.log(err)
  }
}


// removes duplicate tweets
function removeDuplicates(myArr, prop ='id') {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

// filter to get only tweets by user
function filterUserTweets(ts){
  return ts.filter(t=>{
    return t.user.screen_name == user_info.screen_name
  })
}



// specifically for converting tweets from twitter archive
function archToTweet(entry) {
  // entry.entities.media is not present if media is not present, hence we need to populate those
  // fields only if media is present. Same with quote.
  let tweet = null
  entry = entry.tweet
  if (entry != null){
    try{
    tweet = {
      // Basic info.
      id: entry.id_str,
      //id: entry.id,
      text: entry.full_text || entry.text,
      name: user_info.name,
      username: user_info.screen_name,
      profile_image: user_info.profile_image_url_https,
      time: new Date(entry.created_at).getTime(),
      human_time: new Date(entry.created_at).toLocaleString(),
      // Replies/mentions.
      reply_to: entry.in_reply_to_screen_name, // null if not present.
      mentions: entry.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})),
      // URLs.
      urls: entry.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
      // Media.
      has_media: typeof entry.entities.media !== "undefined",
      media: null,
      // Quote info.
      has_quote: entry.is_quote_status,
      is_quote_up: typeof entry.quoted_status !== "undefined",
      quote: null,
    }
    // Add media info.
    if (tweet.has_media) {
      tweet.media = entry.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
    }
    // Add full quote info.
    if (tweet.has_quote && tweet.is_quote_up) {
      tweet.quote = {
        // Basic info.
        text: entry.quoted_status.text,
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
    }} catch(e){
      console.log("failed", entry)
    }
  }
  return tweet
}

function toTweet(entry) {
  // entry.entities.media is not present if media is not present, hence we need to populate those
  // fields only if media is present. Same with quote.
  let tweet = null
  if (entry != null){
    tweet = {
      // Basic info.
      id: entry.id_str,
      //id: entry.id,
      text: entry.full_text || entry.text,
      name: entry.user.name,
      username: entry.user.screen_name,
      profile_image: entry.user.profile_image_url_https,
      time: new Date(entry.created_at).getTime(),
      human_time: new Date(entry.created_at).toLocaleString(),
      // Replies/mentions.
      reply_to: entry.in_reply_to_screen_name, // null if not present.
      mentions: entry.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})),
      // URLs.
      urls: entry.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
      // Media.
      has_media: typeof entry.entities.media !== "undefined",
      media: null,
      // Quote info.
      has_quote: entry.is_quote_status,
      is_quote_up: typeof entry.quoted_status !== "undefined",
      quote: null,
    }
    // Add media info.
    if (tweet.has_media) {
      tweet.media = entry.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
    }
    // Add full quote info.
    if (tweet.has_quote && tweet.is_quote_up) {
      tweet.quote = {
        // Basic info.
        text: entry.quoted_status.text,
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
  return tweet
}


// to format YYYY-MM-DD
function formatDate(d = null){
  d = d == null ? new Date() : d;
  return `${''+d.getFullYear()}-${(''+(d.getMonth()+1)).padStart(2,0)}-${(''+d.getDate()).padStart(2,0)}`
}

//get account creaton date from a twee
function getAccountCreated(user){
  return new Date(user.created_at)
}

// TODO: maximal efficiency would consider the origin with the old tweets but that's more than I want to do
function priorityConcat(_old, _new, update_type = "update"){
  let overwrite = (sub,dom,dom_meta) => {
    //I only want sub with id > dom.since_id and sub with id < dom.max_id
    let reverse_sub = sub.slice().reverse()
    // start looking in reverse because it's supposed to be faster
    let cap = sub.slice(0,(sub.length - 1) - reverse_sub.findIndex((t)=>{return t.id > dom_meta.since_id}))
    let shoes = sub.slice(sub.findIndex((t)=>{return t.id < dom_meta.max_id}),(sub.length - 1))
    // console.log("OVERWRITE")
    // console.log(cap)
    // console.log(dom)
    // console.log(shoes)
    return cap.concat(dom).concat(shoes)
  }
  let priority = {
    timeline: 5,
    update: 4, //there are reasons for update to be higher priority than timeline (deleted recent tweets) but like this is more efficient
    archive: 3,
    old: 2,
    history: 1
  }
  let new_tweets = []
  let old_meta = makeTweetsMeta(_old)
  let new_meta = makeTweetsMeta(_new)
  if (priority[update_type] > priority.old){
    //.reverse()
    new_tweets = overwrite(_old, _new, new_meta)
  } else{
    new_tweets = overwrite(_new, _old, old_meta)
  }
  return new_tweets
}

// Convert request results to tweets and save them
// TODO  : deal with archive RTs which are listed as by the retweeter and not by the original author
async function saveTweets(res, update_type = "update"){
  let arch = update_type == "archive"
  let new_tweets = arch ? res.map(archToTweet) : res.map(toTweet);
  let all_tweets = []
  if (new_tweets.length > 0){
    // load all tweets
    let tweets = await getData("tweets")
    
    
    // all_tweets = all_tweets.concat(new_tweets)
    if (typeof tweets!=="undefined" && tweets != null){
      all_tweets = priorityConcat(tweets, new_tweets, update_type = "update")
    } else {
      all_tweets = new_tweets
    }
  
    all_tweets = removeDuplicates(all_tweets)
    let tweets_meta = makeTweetsMeta(all_tweets)
    // append new tweets and store all tweets'
    let data = {tweets: all_tweets, tweets_meta: tweets_meta}
    await setData(data)
    console.log("Saved!",data)
    messageCS({type: "tweets-loaded"})
  }
  else{
    console.log("No new tweets!",res)
  }
  return new_tweets
}

//to call when we have tweets and wish to update just with the lates
async function updateQuery(auth, since_id = null, count = 3000, include_rts = true) {
  interrupt_query = false
  let stop = false
  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  var username = user_info.screen_name
  var tweets = []
  let res = []
  var since = since_id != null ? `&since_id=${since_id}` : ''
  since_id = 0
  var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}${since}&count=${count}&include_rts=${include_rts}`
  const stop_condition = (res,tweets) => {return tweets.length >= count || !(res != null) || res.length < 1 || stop}
  do
  {
    console.log(`GET: ${url}`)
    try
    {
      res = await fetch(url,init).then(x => x.json())
    }
    catch(err){
      handleError(err)
    }
    if (res.length <= 0 || res ==null){
      //throw new Error("res is empty")
      console.log("res is empty")
      break;
    } 
    else
    {
      if (since_id < res[0].id){
        since_id = res[0].id
      } else{
        stop = true
        break;
      }
      tweets = tweets.concat(res)
      //console.log(`received total ${tweets.length} tweets so far`);
      let new_tweets = await saveTweets(res);
      // pass since_id again only if we got more recent tweets
      //since = since_id >= res[0].id ? '' : `&since_id=${since_id}`
      //since = ''
      // max_id is the max of the next request, so if we received a lower id than max_id, use the new one 
      url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&since=${since_id}&include_rts=${include_rts}`
      //console.log(res);
    }
  }  while(! stop_condition(res,tweets))
  return tweets
}

async function timelineQuery(auth, max_id = null, count = 3000, include_rts = true) {
  //console.log("making complete query")
  var tweets = []
  let res = []
  var max = max_id != null ? `&since_id=${max_id}` : ''
  var username = user_info.screen_name
  max_id = max_id == null ? -1 : max_id;
  //var since = since_id != null ? `&since_id=${since_id}` : ''
  //since_id = since_id == null ? 0 : since_id
  var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}${max}&count=${count}&include_rts=${include_rts}`
  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  const stop_condition = (res,tweets) => {return tweets.length >= count || !(res != null) || res.length < 1}
  do
  {
    console.log(`GET: ${url}`)
    try
    {
      res = await fetch(url,init).then(x => x.json())
    }
    catch(err){
      handleError(err)
      break;
    }
    if (res.length <= 0 || res ==null){
      //throw new Error("res is empty")
      console.log("res is empty")
      break;
    } 
    else
    {
      tweets = tweets.concat(res)
      console.log(`received total ${tweets.length} tweets`);
      //console.log(res);
      let new_tweets = await saveTweets(res);
      
      let since = ''
      // max_id is the max of the next request, so if we received a lower id than max_id, use the new one 
      let batch_max = res[res.length - 1].id
      max_id = (batch_max < max_id || max_id == -1) ? batch_max : max_id
      url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&max_id=${max_id}${since}&include_rts=${include_rts}`
    }
  } while(! stop_condition(res,tweets))
  return tweets
}

// Get ALL the tweets in reverse chronological order. Ambitious. Basically iterate through dates. Save earliest and latest dates in meta.
// experiments show twitter only serves max ~50 tweets per day and you can't specify smaller intervals than 1 day
// so we're stuck with getting at most 50 random tweets from each day
async function archiveQuery(auth, arch_until = formatDate(), count = 200000, include_rts = true){
  //console.log("making archive query")
  const nDays = (n) =>{return n * 24 * 60 * 60 * 1000}
  const max_n_reqs = 180;
  var tweets = []
  var users = []
  let res = []
  let username = user_info.screen_name
  var since = new Date(arch_until);
  let arch_since = new Date(user_info.created_at);
  var until = new Date(arch_until);
  arch_until = arch_until==null ? new Date() : new Date(arch_until);
  
  // max days we can fit in 180 requests?
  // day span divided by 180 to know how many days to ask per request
  const nd = Math.min(5,Math.ceil(Math.floor((arch_until.getTime() - arch_since.getTime())/nDays(1)) / max_n_reqs))

  since.setTime(since.getTime() - nDays(nd))
  
  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  const outer_stop_condition = (since, arch=arch_since) => {return (since.getTime() <= arch_since.getTime()) || interrupt_query }
  do
  {
      var query = escape(`from:${username} since:${formatDate(since)} until:${formatDate(until)}`);	  
      let url = `https://api.twitter.com/2/search/adaptive.json?q=${query}&count=${count}&tweet_mode=extended`;
      console.log(`GET: ${url}`)
      try
      {
        res = await fetch(url,init).then(x => x.json())
        var res_tweets = Object.values(res.globalObjects.tweets)
        if (res_tweets.length == 0 || res_tweets == null){
          console.log("res is empty or empty")
        }
        else
        {
          users = Object.values(res.globalObjects.users)
          //let user_tweets = res_tweets.filter(t=>{return t.username==username;}).map(t=>{t.user=users.find(u=>{return u.id == t.user_id}); return t})
          let user_tweets = res_tweets.map(t=>{t.user=users.find(u=>{return u.id == t.user_id}); return t})
          let new_tweets = await saveTweets(user_tweets/*,true*/);
          tweets = tweets.concat(new_tweets)
          
          console.log(new_tweets)
          console.log(`received total ${tweets.length} tweets`);
        }
      }
      catch(err){
        handleError(err)
        break;
      }
    until.setTime(until.getTime() - nDays(nd)) 
    since.setTime(until.getTime() - nDays(nd)) 
  } 
  while(!outer_stop_condition(since));
  return tweets
}
