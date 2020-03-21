// chrome.pageAction.onClicked.addListener(clickAction);
console.log("background.js started");
chrome.webRequest.onBeforeSendHeaders.addListener(
  c => {
    console.log("onBeforeSendHeaders listener activated!!");
    updateAuth(c.requestHeaders);
  },
  { urls: ["https://api.twitter.com/*"] },
  ["requestHeaders"]
);

chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled event occurred");
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    console.log("onPageChanged event occurred");
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
});

// chrome.runtime.onMessage.addListener(onMessageFromContentScript);

let matchTweetURL = "https?://(?:mobile\\.)?twitter.com/(.+)/status/(\\d+)";
// let matchTweetURLRegex = new RegExp(matchTweetURL);

// function clickAction(tab) {
//   const [_, tweetId] = getUserAndTweetFromURL(tab.url);
//   let tabId = tab.id;
//   if (auth.authorization === null) {
//     // If authorization hasn't been captured yet, we need to reload
//     // the page to do so.
//     waiting.tabId = tabId;
//     waiting.tweetId = tweetId;
//     chrome.tabs.reload(tab.id);
//     setTimeout(ensureLoaded, 2000);
//   } else {
//     injectScripts(tabId, tweetId);
//   }
// }

// function onMessageFromContentScript(request, sender, sendResponse) {
//   if (request.message === "share") {
//     // Handle share button click. The payload is the tree structure.
//     fetch("https://treeverse.app/share", {
//       method: "POST",
//       body: JSON.stringify(request.payload),
//       headers: {
//         "Content-Type": "application/json"
//       }
//     })
//       .then(response => response.text())
//       .then(response => chrome.tabs.create({ url: response }));
//   } else if (request.message == "read") {
//     fetchTweets(request.tweetId, request.cursor, auth).then(x =>
//       sendResponse(x)
//     );
//     return true;
//   }
// }

function getUrlForTweetId(tweetId, cursor) {
  let params = new URLSearchParams({
    include_reply_count: "1",
    tweet_mode: "extended"
  });
  if (cursor !== null && cursor !== undefined) {
    params.set("cursor", cursor);
  }
  return `https://api.twitter.com/2/timeline/conversation/${tweetId}.json?${params.toString()}`;
}

function fetchTweets(tweetId, cursor, auth) {
  let url = getUrlForTweetId(tweetId, cursor);
  let fetch = typeof content === "undefined" ? window.fetch : content.fetch; // eslint-disable-line no-undef
  return fetch(url, {
    credentials: "include",
    headers: {
      "x-csrf-token": auth.csrfToken,
      authorization: auth.authorization
    }
  })
    .then(x => x.json())
    .catch(e => console.error("Failed to load tweets", e)); // eslint-disable-line no-console
}

function updateAuth(headers) {
  for (let header of headers) {
    if (header.name.toLowerCase() == "x-csrf-token") {
      auth.csrfToken = header.value;
      console.log("csrfToken:");
      console.log(header.value);
    } else if (header.name.toLowerCase() == "authorization") {
      auth.authorization = header.value;
      console.log("authorization:");
      console.log(header.value);
    }
  }

  if (auth.authorization !== null && waiting.tabId !== null) {
    // If we previously reloaded the page in order to capture the tokens,
    // initiate Treeverse now.
    // injectScripts(waiting.tabId, waiting.tweetId);
    waiting.tabId = null;
    waiting.tweetId = null;
  }
}
