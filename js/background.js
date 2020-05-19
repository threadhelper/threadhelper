"use strict";

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.webRequest.onBeforeSendHeaders.addListener(
  c => {
    updateAuth(c.requestHeaders);
  },
  { urls: ["https://api.twitter.com/*"] },
  ["requestHeaders"]
);


// Stores auth and CSRF tokens once they are captured in the headers.
let auth = {
  csrfToken: null,
  authorization: null,
  expired: true
};

// If we have to refresh the page to gather the headers, store the tab and
// tweet to load after we get the headers in this object.
let waiting = {
  tabId: null
};

// Gets auth and csrf token Called before every request. 
function updateAuth(headers) {
  if (auth.expired){
    for (let header of headers) {
      if (header.name.toLowerCase() == "x-csrf-token") {
        auth.csrfToken = header.value;
      } else if (header.name.toLowerCase() == "authorization") {
        auth.authorization = header.value;
      }
    }
    console.log("ran updateAuth")
    //store it don't forget it
    chrome.storage.local.set({ auth: auth }, function() {
      console.log("auth stored")
    })
    auth.expired = false;
  }
  // If we previously reloaded the page in order to capture the tokens:
  if (auth.authorization !== null && waiting.tabId !== null) {
    // Inject scripts here
    waiting.tabId = null;
  }
}

// TODO: We only need to get a fresh auth when the old one is stale
async function confirmAuth(tabId) {
  //try to get from storage first
  if (auth.authorization === null) {
    chrome.storage.local.get(["auth"], r =>{
      auth = r.auth;
      console.log("loaded auth from storage")
    });
  }
  if (auth.authorization === null) {
    // If authorization hasn't been captured yet, we need to reload the page to get it
    auth.expired = false;
    waiting.tabId = tabId;
    chrome.tabs.reload(tabId);
    setTimeout(check, 2000);
  } else {
    // Inject scripts here
  }

  function check() {
    if (waiting.tabId != null) {
      alert("Could not read authentication tokens");
      waiting.tabId = null;
    }
  }
  return auth
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

//** Fetches a json search from twitter.com */
function fetchTweets(auth, username, since, until, count = 1000, cursor = null) {
  const query = escape(`from:${username} since:${since} until:${until}`);
  //let url = `https://api.twitter.com/2/search/adaptive.json?q=${query}&count=1000&tweet_mode=extended`;
  //let url = `https://api.twitter.com/2/search/adaptive.json?q=from:${username}&count=1000&tweet_mode=extended`;
  let url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}`;
  console.log(url)
  if (cursor !== null) {
    url += `&cursor=${escape(cursor)}`;
  }
  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  return fetch(url, init)
    .then(x => x.json())
    .catch(e => console.error("Failed to load tweets", e));
}

//** Pulls out cursor value from large json response */
function extractCursor(response) {
  for (let entry of response.timeline.instructions[0].addEntries.entries) {
    if (entry.content.operation && entry.content.operation.cursor) {
      if (entry.content.operation.cursor.cursorType === "Bottom") {
        const cursor = entry.content.operation.cursor.value;
        console.log("found cursor in response:" + cursor);
        return cursor;
      }
    }
  }
  // return cursor.substr(7); // remove 'cursor:'
  return null;
}

function extractTweets(response) {
  // collect users:
  let users = new Map();
  for (const userId in response.globalObjects.users) {
    const user = response.globalObjects.users[userId];
    users.set(userId, {
      handle: user.screen_name,
      name: user.name
    });
  }

  function toTweet([id, entry]) {
    const user = users.get(entry.user_id_str);
    return {
      id: id,
      text: entry.full_text || entry.text,
      name: user.name,
      username: user.handle,
      parent: entry.in_reply_to_status_id_str,
      time: new Date(entry.created_at).getTime(),
      replies: entry.reply_count,
      urls: entry.entities.urls.map(x => x.expanded_url),
      media: null // TODO
    };
  }
  return Object.entries(response.globalObjects.tweets).map(toTweet);
}

//** Handles messages sent from popup or content scripts */
function onMessage(m, sender, sendResponse) {
  console.log("message received:", m);
  switch (m.type) {
    case "auth":
      confirmAuth(m.tabId).then(() => {sendResponse();});
      break;

    // TODO: fix bug where it takes two clicks for tweets to update
    case "load":
      if(auth.authorization !== null){
        completeQuery(auth, m.username, m.since, m.until).then(function(tweets) {
          chrome.storage.local.set({ tweets: tweets }, function() {
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
        });
      }
      break;

    case "clear":
      // clear storage
      console.log("clear");
      break;
  }
  return true;
}


async function completeQuery(auth, username, count = 3000, max_id = 0, include_rts = false) {
  var tweets = []
  let res = []

  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };

  var uurl = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&include_rts=${include_rts}`

  var stop_condition = (res,tweets) => {return tweets.length < count && res.length > 1}

  do{ 
    try{
      res = await fetch(uurl,init).then(x => x.json()).catch(console.log)
      if (res.length == 0){throw "res is enmpty"}
    } catch (err){
      //if it fails, most likely auth has expired so replace it
      console.log(err)
      auth.expired = true;
      break;
    }
    tweets = tweets.concat(res)
    max_id = res[res.length - 1].id
    uurl = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&max_id=${max_id}&include_rts=${include_rts}`
    console.log(`loaded ${tweets.length} tweets`)
  }while(stop_condition(res,tweets))

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
