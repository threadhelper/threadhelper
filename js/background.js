"use strict";

// Stores auth and CSRF tokens once they are captured in the headers.
let auth = {
  csrfToken: null,
  authorization: null
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


// is auth something rather than null and friend?
function isAuth(auth){
  if (typeof auth === 'undefined' || auth.authorization == null || auth.csrfToken == null || auth.authorization == 'null' ||auth.csrfToken == 'null'){
    return false
  }
  else{
    return true
  }
}
//make a trivial request to make sure auth works
async function isAuthFresh(auth){
  if (isAuth(auth)){
    try{
      const init = {
        credentials: "include",
        headers: {
          authorization: auth.authorization,
          "x-csrf-token": auth.csrfToken
        }
      };
      var uurl = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=Twitter&count=1`
      var res = await fetch(uurl,init).then(x => x.json())//.catch(throw new Error("caught in fetch"))
      console.log("auth is good")
    }catch(err){
        console.log("auth is stale")
        console.log(err)
        return false
  }}
  return true
}

// TODO: We only need to get a fresh auth when the old one is stale
async function loadAuth(tabId) {
  //try to get from storage first
  if (isAuth(auth)){
    console.log("current auth fresh af")
    return auth
  }
  else{
    console.log("gonna load auth from storage")
    chrome.storage.local.get(["auth"], r =>{
      if(isAuth(r.auth)){
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
  var reload_ok = confirm("I'll have to reload the page to get my authorization token :)");
  if (reload_ok){
    chrome.tabs.reload(tabId);
  }
}

// called after reloading, checks if auth exists and if not 
async function processHeaders(headers){
  // on mac there's a bug where updateAuth is called befor auth is defined, 
  // so this is checking that
  console.log("processing headers")
  if (typeof auth  === 'undefined'){   
    console.log("auth was undefined, for some reason, gonna define it and do nothing else")
    auth = {
      csrfToken: null,
      authorization: null
    };
  } 
  if (!isAuth(auth)){
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
    }
  }

  console.log("ran updateAuth")
  //store it don't forget it
  if(isAuth(auth)){
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
}

//** Handles messages sent from popup or content scripts */
async function onMessage(m, sender, sendResponse) {
  console.log("message received:", m);
  switch (m.type) {
    case "auth":
      console.log("got auth message from popup, gonna load Auth")
      loadAuth(m.tabId).then(() => {sendResponse();});
      break;

    case "load":
      if(isAuth(auth)){
        console.log("auth good")
        updateTweets(m, sendResponse);
      }
      else{
        console.log("auth bad, loadin")
        await loadAuth(m.tabId).then(updateTweets(m, sendResponse))
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
  //console.log("updating tweets");
  chrome.storage.local.get(["tweets_meta"], r =>{
    var since_id = null
    var max_id = null
    if (typeof r.tweets_meta !== 'undefined' && typeof r.tweets_meta.since_id !== 'undefined'  && r.tweets_meta.since_id != null && typeof r.tweets_meta.max_id !== 'undefined'  && r.tweets_meta.max_id != null){
      since_id = r.tweets_meta.since_id
      max_id = r.tweets_meta.max_id
    }
    //console.log(`querying with max id: ${max_id} and since id: ${since_id}`)
    completeQuery(auth, m.username, m.tabId, max_id, since_id).then(function(tweets) {
      if (tweets.length > 0){
        var tweets_meta = {count: tweets.length, max_id: tweets[tweets.length - 1].id, since_id: tweets[0].id, since_time:tweets[0].time}
        chrome.storage.local.set({ tweets: tweets, tweets_meta: tweets_meta}, function() {
          //console.log("set storage with tweets and meta info!")
          sendResponse();
        });
        //console.log("sending message to cs after load")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          //console.log(tabs)
          if (tabs != null && tabs.length < 1 && typeof tabs[0] !== 'undefined'){
            chrome.tabs.sendMessage(tabs[0].id, {type: "tweets-loaded"}, function(response) {
              //console.log("tweet-load-received");
        })}
          else{
            //console.log("tabs are null")
          }
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
  //console.log("handling tweet query error")
  switch (err.code){
    case 353: //"This request requires a matching csrf cookie and header."
      console.log("auth is bad, getting new")
      getNewAuth(tabId);
    case 215: //""Bad Authentication data.""
      console.log("auth is bad, getting new")
      getNewAuth(tabId);
    default:
      console.log(err)
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
  if (await isAuthFresh(auth)){
    const stop_condition = (res,tweets) => {return tweets.length < count && res.length > 1}
    do
    { 
      console.log(`GET: ${uurl}`)
      try
      {
        res = await fetch(uurl,init).then(x => x.json())
        //res = x.json()
        if (res.length == 0){throw new Error("res is empty")}
        console.log(res)
        tweets = tweets.concat(res)
        
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
  }

  function toTweet(entry) {
    // entry.entities.media is not present if media is not present, hence we need to populate those
    // fields only if media is present. Same with quote.
    let tweet = {
      // Basic info.
      id: entry.id_str,
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
      // Quote info. Tweets quoting deleted tweets will have is_quote_status true but undefined
      // quoted_status.
      has_quote: entry.is_quote_status && (typeof entry.quoted_status !== "undefined"),
      quote: null,
    }
    // Add media info.
    if (tweet.has_media) {
      tweet.media = entry.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
    }
    // Add full quote info.
    if (tweet.has_quote) {
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

    return tweet
  }
  
console.log(tweets)
var tweets_normal = tweets.map(toTweet)
return tweets_normal
}
