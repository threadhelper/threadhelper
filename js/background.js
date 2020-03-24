"use strict";

chrome.pageAction.onClicked.addListener(clickAction);
chrome.webRequest.onBeforeSendHeaders.addListener(
  c => {
    updateAuth(c.requestHeaders);
  },
  { urls: ["https://api.twitter.com/*"] },
  ["requestHeaders"]
);
chrome.runtime.onInstalled.addListener(onInstalled);

const matchTweetURL = "https?://(?:mobile\\.)?twitter.com/(.+)/status/(\\d+)";

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

function clickAction(tab) {
  let tabId = tab.id;
  if (auth.authorization === null) {
    // If authorization hasn't been captured yet, we need to reload the page to get it
    waiting.tabId = tabId;
    chrome.tabs.reload(tab.id);
    setTimeout(ensureLoaded, 2000);
  } else {
    // Inject scripts here
  }
}

function ensureLoaded() {
  if (waiting.tabId != null) {
    alert("Could not read authentication tokens");
    waiting.tabId = null;
  }
}

function onInstalled() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              urlMatches: matchTweetURL
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
}

function getUrlForTweetId(tweetId) {
  let params = new URLSearchParams({
    include_reply_count: "1",
    tweet_mode: "extended"
  });
  // if (cursor !== null && cursor !== undefined) {
  //   params.set("cursor", cursor);
  // }
  return `https://api.twitter.com/2/timeline/conversation/${tweetId}.json?${params.toString()}`;
}

function fetchTweets(tweetId, auth) {
  let url = getUrlForTweetId(tweetId);
  let fetch = typeof content === "undefined" ? window.fetch : content.fetch;
  return fetch(url, {
    credentials: "include",
    headers: {
      "x-csrf-token": auth.csrfToken,
      authorization: auth.authorization
    }
  })
    .then(x => x.json())
    .catch(e => console.error("Failed to load tweets", e));
}
