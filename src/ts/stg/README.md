Functions that deal with chrome (browser extension) storage, as well as extension messaging. `dutils.tsx` contains storage, messaging, queues (in storage).

Uses queues in chrome.storage to do things. You can subscribe to a queue with subWorkQueue, passing it the name of the queue and a function that consumes from it.

- queues
  - `queue_lookupTweets`: ids that should be looked up from the twitter API
  - `queue_lookupBookmark`: bookmark ids that should be looked up from the twitter API
  - `queue_lookupRefresh`: ids that we already have but should be refreshed by looking them up from the twitter API
  - `queue_addTweets`: `thTweet`s to add to `IndexedDB`
  - `queue_refreshTweets`: `thTweet`s to be added to `IndexedDB` as refreshers (the difference is that their `account` prop should not be overwritten)
  - `queue_removeTweets`: ids to remove from `IndexedDB`
  - `queue_tempArchive`: archive tweets to be patched and imported to `IndexedDB`
  - `queue_addUsers`: users to be imported to `IndexedDB`
  - `queue_removeUsers`: user ids to remove from `IndexedDB`
