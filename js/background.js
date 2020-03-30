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
  authorization: null
};

// If we have to refresh the page to gather the headers, store the tab and
// tweet to load after we get the headers in this object.
let waiting = {
  tabId: null
};

function updateAuth(headers) {
  for (let header of headers) {
    if (header.name.toLowerCase() == "x-csrf-token") {
      auth.csrfToken = header.value;
    } else if (header.name.toLowerCase() == "authorization") {
      auth.authorization = header.value;
    }
  }
  // If we previously reloaded the page in order to capture the tokens:
  if (auth.authorization !== null && waiting.tabId !== null) {
    // Inject scripts here
    waiting.tabId = null;
  }
}

// TODO: We only need to get a fresh auth when the old one is stale
function confirmAuth(tabId) {
  if (auth.authorization === null) {
    // If authorization hasn't been captured yet, we need to reload the page to get it
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
function fetchTweets(auth, username, since, until, cursor = null) {
  const query = escape(`from:${username} since:${since} until:${until}`);
  let url = `https://api.twitter.com/2/search/adaptive.json?q=${query}&count=50&tweet_mode=extended`;
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

//** Pulls out the tweet data from the large json response */
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
      confirmAuth(m.tabId);
      break;

    // TODO: fix bug where it takes two clicks for tweets to update
    case "load":
      // load more tweets into storage
      fetchTweets(auth, m.username, m.since, m.until).then(function(r) {
        const tweets = extractTweets(r);
        const cursor = extractCursor(r);
        chrome.storage.local.set({ tweets: tweets }, function() {
          sendResponse();
        });
      });
      break;

    case "clear":
      // clear storage
      console.log("clear");
      break;
  }
}

// need to use chrome.tabs.sendMessage to communicate to content script
// or can use the sendresponse parameter
