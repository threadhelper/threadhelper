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

function fetchTrump(
  auth,
  cursor = null,
  since = "2018-01-01",
  until = "2018-01-31"
) {
  const query = escape(`from:realdonaldtrump since:${since} until:${until}`);
  let url = `https://api.twitter.com/2/search/adaptive.json?q=${query}&count=20`;
  if (cursor !== null) {
    url += `&cursor=${escape(cursor)}`;
  }
  console.log("fetching url: " + url);
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

//** Finds 'cursor' value which corresponds to scroll in the search results */
function parseCursor(response) {
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

function parseTweets(response) {
  // collect users:
  let users = new Map();
  for (const userId in response.globalObjects.users) {
    const user = response.globalObjects.users[userId];
    users.set(userId, {
      handle: user.screen_name,
      name: user.name
    });
  }

  // collect tweets:
  let tweets = [];
  for (const [id, entry] of Object.entries(response.globalObjects.tweets)) {
    const user = users.get(entry.user_id_str);
    const tweet = {
      id: id,
      text: entry.full_text || entry.text,
      name: user.name,
      username: user.handle,
      parent: entry.in_reply_to_status_id_str,
      time: new Date(entry.created_at).getTime(),
      replies: entry.reply_count,
      urls: entry.entities.urls.map(x => x.expanded_url), // TODO
      media: null // TODO
    };
    tweets.push(tweet);
  }

  return tweets;
}
