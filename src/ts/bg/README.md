# Background

- `background` talks to `content-script` in 2 ways:

  - it observes and sets to `chrome.storage` and sends messages.
    - It makes a storage observer called storageChange$ that other storage observers derive from
  - It receives RPC function calls and sends messages directly.
    - Receives RPC calls through the messaging interface. This allows `content-script` to make function calls to `background`
    - To add a function to the RPC interface, add it to the `rpcFns` object.
    - Sends messages with `msgCS`

- workers:

  - `scrapeWorker`: `twitterScout.tsx`: Scrapes Twitter API for tweets and users.
  - `idbWorker`: `idbWorker.tsx`: Interacts with IndexedDB
  - `searchWorker`: `searchWorker.tsx`: worker that searches the index

- RPC functions (in `rpcFns`)
  - scraping
    - `updateTimeline`
    - `addBookmark`
    - `removeBookmark`
    - `deleteTweet`
    - `removeAccount`
  - search
    - `seek`: regular index search
    - `getLatest`: gets the latest tweets in TH
    - `getRandom`: gets a random sample of tweets from TH
    - `doUserSearch`: (should be moved to content script) does user search on the twitter api
    - `doSearchApi`: (should be moved to content script) does tweets search on the twitter api

[Queues](../stg/README.md)
