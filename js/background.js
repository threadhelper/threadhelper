"use strict";

// Stores auth and CSRF tokens once they are captured in the headers.
let auth = {
  csrfToken: null,
  authorization: null,
  expired: true
};

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.webRequest.onBeforeSendHeaders.addListener(
  c => {
    console.log("before sending headers")
    processHeaders(c.requestHeaders);
  },
  { urls: ["https://api.twitter.com/*"] },
  ["requestHeaders"]
);

/*
document.addEventListener("DOMContentLoaded", () => {
  runContentScript()
});*/



// If we have to refresh the page to gather the headers, store the tab and
// tweet to load after we get the headers in this object.
let waiting = {
  tabId: null,
  justUpdated : false
};

function runContentScript(){
  chrome.tabs.executeScript(null, {file: "contentScript.js"});
}

//make a trivial request to make sure auth works
async function isAuthFresh(auth){
  if (typeof auth === 'undefined' || auth.authorization == null || auth.csrfToken == null){
    console.log("auth is null")
    return false
  }
  try{
    const init = {
      credentials: "include",
      headers: {
        authorization: auth.authorization,
        "x-csrf-token": auth.csrfToken
      }
    };
    var uurl = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}${since}${max}&count=${count}&include_rts=${include_rts}`
    res = await fetch(uurl,init).then(x => x.json())//.catch(throw new Error("caught in fetch"))
    console.log("auth is good")
  }catch(err){
    if (err.code == 353){
      console.log("auth is stale")
      return false
    }
  }
  return true
}

function setAuth(auth_){
  auth = auth_
}

// TODO: We only need to get a fresh auth when the old one is stale
async function loadAuth(tabId) {
  //try to get from storage first
  if (await isAuthFresh(auth)){
    return auth
  }
  else{
    console.log("gonna load auth from storage")
    chrome.storage.local.get(["auth"], r =>{
      var def = typeof r.auth !== 'undefined';
      var is_fresh = isAuthFresh(r.auth)
      if(def && is_fresh){
        auth = r.auth;
        console.log("got it")
        console.log(auth)
      }
      else{
        console.log("couldn't, getting new auth")
        getNewAuth(tabId);
      }
    })
  }
}

// tries to reload page to get a new auth
function getNewAuth(tabId){
  waiting.tabId = tabId;
  var reload_ok = confirm("I'll have to reload the page to get my authorization token :)");
  if (reload_ok){
    chrome.tabs.reload(tabId);
  }
}

// called after reloading
async function processHeaders(headers){
  // on mac there's a bug where updateAuth is called befor auth is defined, 
  // so this is checking that
  console.log("processing headers")
  if (typeof auth  === 'undefined'){   
    console.log("auth was undefined, for some reason, gonna define it and do nothing else")
    auth = {
      csrfToken: null,
      authorization: null,
      expired: true
    };
  } 
  if (! await isAuthFresh(auth)){
    console.log("updatingAuth")
    updateAuth(headers)
  }
  else{
    console.log("auth is fresh")
  }
}

// Gets auth and csrf token Called before every request. Store only if expired.
async function updateAuth(headers) {
  for (let header of headers) {
    if (header.name.toLowerCase() == "x-csrf-token") {
      auth.csrfToken = header.value;
    } else if (header.name.toLowerCase() == "authorization") {
      auth.authorization = header.value;
      auth.expired = false;
    }
  }

  console.log("ran updateAuth")
  //store it don't forget it
  if(await isAuthFresh(auth)){
    chrome.storage.local.set({ auth: auth }, function() {
      console.log("auth stored")
      console.log(auth)
    })
  } else{
    console.log("couldn't take auth from header")
    console.log(headers)
  }
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
  //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabs[0].id));
}

//** Handles messages sent from popup or content scripts */
async function onMessage(m, sender, sendResponse) {
  console.log("message received:", m);
  switch (m.type) {
    case "auth":
      console.log("got auth message from popup, gonna load Auth")
      loadAuth(m.tabId).then(() => {sendResponse();});
      break;

    // TODO: fix bug where it takes two clicks for tweets to update
    case "load":
      if(auth.authorization !== null){
        //console.log("auth good")
      }
      else{
        console.log(auth)
        await loadAuth(m.tabId)
      }
      updateTweets(m, sendResponse);
      break;

    case "clear":
      // clear storage
      console.log("clearing storage")
      clearStorage(sendResponse)
      break;
  }
  return true;
}

function clearStorage(sendResponse){
  chrome.storage.local.remove(["tweets","tweets_meta","auth"],function(){
    sendResponse()
    var error = chrome.runtime.lastError;
       if (error) {
           console.error(error);
       }
   })
   return true
}

function updateTweets(m, sendResponse){
  console.log("updating tweets");
  chrome.storage.local.get(["tweets_meta"], r =>{
    var since_id = null
    var max_id = null
    if (typeof r.tweets_meta !== 'undefined' && typeof r.tweets_meta.since_id !== 'undefined'  && r.tweets_meta.since_id != null && typeof r.tweets_meta.max_id !== 'undefined'  && r.tweets_meta.max_id != null){
      since_id = r.tweets_meta.since_id
      max_id = r.tweets_meta.max_id
    }
    console.log(`querying with max id: ${max_id} and since id: ${since_id}`)
    completeQuery(auth, m.username, m.tabId, max_id, since_id).then(function(tweets) {
      if (tweets.length > 0){
        var tweets_meta = {count: tweets.length, max_id: tweets[tweets.length - 1].id, since_id: tweets[0].id, since_time:tweets[0].time}
        chrome.storage.local.set({ tweets: tweets, tweets_meta: tweets_meta}, function() {
          console.log("set storage with tweets and meta info!")
          sendResponse();
        });
        console.log("sending message to cs after load")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          console.log(tabs)
          if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
            chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {
              console.log("tweet-load-received");
        })}
          else{console.log("tabs are null")}
        });
      } 
      else{
        console.log("didn't load any tweets!")
        sendResponse();
      }
    });
  });
  return true
}

function handleError(err, tabId){
  console.log("handling tweet query error")
  console.log(err)
  switch (err.code){
    case 353: //"This request requires a matching csrf cookie and header."
      console.log("auth is bad, getting new")
      auth.expired = true; 
      getNewAuth(tabId);

  }
}

async function completeQuery(auth, username, tabId, max_id = null, since_id = null, count = 3000, include_rts = false) {
  console.log("making complete query")
  var tweets = []
  let res = []
  var max = max_id != null ? `&since_id=${max_id}` : ''
  var since = since_id != null ? `&since_id=${since_id}` : ''
  var uurl = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}${since}${max}&count=${count}&include_rts=${include_rts}`
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
    console.log(`GET: ${uurl}`)
    try
    {
      res = await fetch(uurl,init).then(x => x.json())
      //res = x.json()
      if (res.length == 0){throw new Error("res is empty")}
      tweets = tweets.concat(res)
      console.log(res)
      
      // pass since_id again only if we got more recent tweets
      // since = parseInt(since_id) < parseInt(res[0].id) ? '' : `&since_id=${since_id}`
      // since_id = parseInt(since_id) > parseInt(res[0].id) ? since_id : res[0].id
      since = ''
      max_id = parseInt(max_id) < parseInt(res[res.length - 1].id - 1) ? since_id : res[res.length - 1].id - 1
      uurl = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&max_id=${max_id}${since}&include_rts=${include_rts}`
      console.log(`GET: ${uurl}`)
      console.log(`loaded ${tweets.length} tweets`)
    }
    catch(err){
      handleError(err, tabId)
    }
  }
  while(stop_condition(res,tweets))

  function toTweet(entry) {
    return {
      id: entry.id_str,
      text: entry.full_text || entry.text,
      name: entry.user.name,
      username: entry.user.screen_name,
      parent: entry.in_reply_to_status_id_str,
      time: new Date(entry.created_at).getTime(),
      retweets: entry.retweet_count,
      urls: entry.entities.urls.map(x => x.expanded_url),
      media: null // TODO
    };
  }
var tweets_normal = tweets.map(toTweet)
console.log(tweets_normal)
return tweets_normal
}
