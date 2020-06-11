"use strict";

// Stores auth and CSRF tokens once they are captured in the headers.


let user_info = {}

let options = {}

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
    let tabId = await getTabId()
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
      console.log("auth stored")
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
    console.log("processing headers")
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
      console.log("updatingAuth")
      auth.updateAuth(csrfToken,authorization)
    }
    else{
      console.log("header does not have auth")
    }
  }


//** Handles messages sent from popup or content scripts */
async function onMessage(m, sender, sendResponse) {
  console.log("message received:", m);
  let auth_good = null
  switch (m.type) {

    case "saveOptions":
      loadOptions()
      sendResponse()
      break;

    case "update":
      auth_good = await auth.testAuth()
      if(await auth_good != null){
        console.log("auth good", auth_good)
        updateTweets(m, sendResponse, );
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, sendResponse, "update")
      }
      break;

    case "load":
      auth_good = await auth.testAuth()
      if(await auth_good != null){
        console.log("auth good", auth_good)
        updateTweets(m, sendResponse, "timeline");
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, sendResponse, "timeline")
      }
      break;

    case "load_archive":
      auth_good = await auth.testAuth()
      if(auth_good  != null){
        console.log("auth good", auth_good)
        updateTweets(m, sendResponse, "archive");
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, sendResponse, "archive")
      }
      break;

    case "clear":
      // clear storage
      console.log("clearing storage")
      clearStorage(sendResponse)
      break;
  }
  return true;
}


//clears storage of tweets, tweets meta info, and auth
function clearStorage(sendResponse){
  chrome.storage.local.remove(["tweets","tweets_meta"/*,"auth"*/],function(){
    sendResponse()
    var error = chrome.runtime.lastError;
       if (error) {
           console.error(error);
       }
   })
   return true
}

function updateTweets(m, sendResponse, update_type = "update"){
  //console.log("updating tweets");
  chrome.storage.local.get(["tweets", "tweets_meta"], r =>{
    var since_id = null
    var max_id = null
    if (typeof r.tweets_meta !== 'undefined' && typeof r.tweets_meta.since_id !== 'undefined'  && r.tweets_meta.since_id != null && typeof r.tweets_meta.max_id !== 'undefined'  && r.tweets_meta.max_id != null){
      since_id = r.tweets_meta.since_id
      max_id = r.tweets_meta.max_id
    }
    switch(update_type){
      case "update":
      updateQuery(auth, m.username, since_id).then((tweets)=>{
        if (tweets.length > 0){
          var tweets_meta = makeTweetsMeta(tweets)
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
              chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {
          })}
          });
          }
          else{
          console.log("didn't load any tweets!")
          sendResponse();
          }
      })
      break;
      case "timeline":
      timelineQuery(auth, m.username, max_id, since_id).then(function(tweets) {
        if (tweets.length > 0){
          var tweets_meta = makeTweetsMeta(tweets)
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
              chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {
          })}
          });
        }
        else{
          console.log("didn't load any tweets!")
          sendResponse();
        }
      });
      break;
      case "archive":
      archiveQuery(auth, m.username).then((tweets)=>{
        if (tweets.length > 0){
          var tweets_meta = makeTweetsMeta(tweets)
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
              chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {
          })}
          });
          }
          else{
          console.log("didn't load any tweets!")
          sendResponse();
          }
      })
      break;
    }
  });
  return true
}


function makeTweetsMeta(tweets){
  var tweets_meta = {
    count: tweets.length, 
    max_id: tweets[tweets.length - 1].id, 
    since_id: tweets[0].id, 
    since_time: tweets[0].time}
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

function toTweet(entry) {
  // entry.entities.media is not present if media is not present, hence we need to populate those
  // fields only if media is present. Same with quote.
  let tweet = null
  if (entry != null){
    tweet = {
      // Basic info.
      //id: entry.id_str,
      id: entry.id,
      text: entry.full_text || entry.text,
      name: entry.user.name,
      username: entry.user.screen_name,
      profile_image: entry.user.profile_image_url_https,
      time: new Date(entry.created_at).getTime(),
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


async function saveTweets(res, arch=false){
  //let new_tweets = arch ? res.map(toTweetArch) : res.map(toTweet);
  let new_tweets = res.map(toTweet);
  let all_tweets = []
  if (new_tweets.length > 0){
    // console.log("new_tweets",new_tweets)
    // load all tweets
    chrome.storage.local.get(["tweets"], r =>{
      // console.log("getting tweets from storage")
      // console.log("storage request",r)
      if (typeof r.tweets!=="undefined" && r.tweets != null){
        // console.log("rtweets",r.tweets)
        //all_tweets = r.tweets
        all_tweets = all_tweets.concat(r.tweets)
      }
      // console.log("all_tweets after adding OLD",all_tweets)
      all_tweets = all_tweets.concat(new_tweets)
      // console.log("all_tweets after adding NEW",all_tweets)
      let tweets_meta = makeTweetsMeta(all_tweets)
      // append new tweets and store all tweets'
      if (arch){
        chrome.storage.local.set({ tweets_arch: all_tweets, tweets_meta_arch: tweets_meta}, function() {
          console.log(`added ${new_tweets.length} arch tweets to storage metadata:`, tweets_meta)
          // send message to contentscript to get tweets
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
              chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {})}
          });
        });
      }
      else
      {
        chrome.storage.local.set({ tweets: all_tweets, tweets_meta: tweets_meta}, function() {
          console.log(`added ${new_tweets.length} tweets to storage metadata:`, tweets_meta)
          // send message to contentscript to get tweets
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
              chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {})}
          });
        });
      } 
    });
  }
  else{
    console.log("No new tweets!",res)
  }
  return new_tweets
}



//to call when we have tweets and wish to update just with the lates
async function updateQuery(auth, username, since_id = null, count = 3000, include_rts = true) {
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
  const stop_condition = (res,tweets) => {return (tweets.length < count && res.length > 1) || stop}
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
      console.log(`received total ${tweets.length} tweets`);
      if (since_id < res[0].id){
        since_id = res[0].id
      } else{
        stop = true
        break;
      }
      tweets = tweets.concat(res)
      let new_tweets = await saveTweets(res);
      // pass since_id again only if we got more recent tweets
      //since = since_id >= res[0].id ? '' : `&since_id=${since_id}`
      //since = ''
      // max_id is the max of the next request, so if we received a lower id than max_id, use the new one 
      url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&since=${since_id}&include_rts=${include_rts}`
      console.log(res);
    }
  }  while(stop_condition(res,tweets))
  return tweets
}



async function timelineQuery(auth, username, max_id = null, since_id = null, count = 3000, include_rts = true) {
  console.log("making complete query")
  var tweets = []
  let res = []
  var max = max_id != null ? `&since_id=${max_id}` : ''
  max_id = max_id == null ? -1 : max_id
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
  const stop_condition = (res,tweets) => {return tweets.length < count && res.length > 1}
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
      console.log("max id: ", max_id, "since id: ", since_id )
      throw new Error("res is empty or null")
    } 
    else
    {
      tweets = tweets.concat(res)
      console.log(`received total ${tweets.length} tweets`);
      console.log(res);
      let new_tweets = await saveTweets(res);
      
      let since = ''
      // max_id is the max of the next request, so if we received a lower id than max_id, use the new one 
      max_id = res[res.length - 1].id < max_id || max_id == -1 ? res[res.length - 1].id : max_id
      url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&max_id=${max_id}${since}&include_rts=${include_rts}`
    }
  } while(stop_condition(res,tweets))
  console.log(tweets)
  return tweets
}


// Get ALL the tweets in reverse chronological order. Ambitious. Basically iterate through dates. Save earliest and latest dates in meta.
// experiments show twitter only serves max ~50 tweets per day and you can't specify smaller intervals than 1 day
// so we're stuck with getting at most 50 random tweets from each day
async function archiveQuery(auth, username, count = 200, since_date = "2018-01-01", until_date = formatDate(), include_rts = true){
  console.log("making archive query")
  var tweets = []
  var users = []
  let res = []
  var arch_since = new Date(since_date); //only a placeholder for setting account creation date by consulting a tweet
  var arch_until = new Date(until_date);
  var since = new Date(until_date);
  var until = new Date(until_date);
  const nDays = (n) =>{return n * 24 * 60 * 60 * 1000}
  const nd = 5
  since.setTime(since.getTime() - nDays(nd))
  // console.log("since", since)
  // console.log("since date", since_date)
  // console.log("since formatted", formatDate(since))
  // console.log("until", until)
  // console.log("until date", until_date)
  // console.log("until formatted", formatDate(until))

  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  const outer_stop_condition = (since, arch=arch_since) => {return since.getTime() <= arch.getTime() }
  do
  {
      var query = escape(`from:${username} since:${formatDate(since)} until:${formatDate(until)}`);	  
      let url = `https://api.twitter.com/2/search/adaptive.json?q=${query}&count=${count}&tweet_mode=extended`;
      console.log(`GET: ${url}`)
      try
      {
        res = await fetch(url,init).then(x => x.json())
        console.log(res.globalObjects)
        var res_tweets = Object.values(res.globalObjects.tweets)
        if (res_tweets.length == 0 || res_tweets == null){
          console.log("res is empty or empty")
        }
        else
        {
          users = Object.values(res.globalObjects.users)
          //let user_tweets = res_tweets.filter(t=>{return t.username==username;}).map(t=>{t.user=users.find(u=>{return u.id == t.user_id}); return t})
          let user_tweets = res_tweets.map(t=>{t.user=users.find(u=>{return u.id == t.user_id}); return t})
          console.log("user tweets", user_tweets)
          let new_tweets = await saveTweets(user_tweets,true);
          console.log("new tweets (after saving)", user_tweets)
          tweets = tweets.concat(new_tweets)
          console.log(new_tweets)
          //if (arch_since == 0) arch_since = getAccountCreated(users[0])

          console.log(`GET: ${url}`)
          console.log(`loaded ${tweets.length} tweets`, tweets)
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
