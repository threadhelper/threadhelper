import { Options, StorageInterface } from '../types/stgTypes';
import { TweetId } from '../types/tweetTypes';

// DEFAULT OPTIONS V IMPORTANT
export const defaultOptions = (): Options => {
  return {
    name: 'options',
    getRTs: { name: 'getRTs', type: 'searchFilter', value: true },
    useBookmarks: { name: 'useBookmarks', type: 'searchFilter', value: true },
    useReplies: { name: 'useReplies', type: 'searchFilter', value: true },
    idleMode: { name: 'idleMode', type: 'idleMode', value: 'timeline' }, // {'random', 'timeline'}
    roboActive: { name: 'roboActive', type: 'featureFilter', value: false },
    searchMode: { name: 'searchMode', type: 'searchMode', value: 'fulltext' }, // {'fulltext', 'semantic'}
  };
};

export const defaultStorage = (): StorageInterface => {
  return {
    options: defaultOptions(),
    hasArchive: false,
    hasTimeline: {}, // {id_str: Bool}
    activeAccounts: {}, //{id:FullUser}
    currentScreenName: '',
    latest_tweets: [],
    search_results: [],
    api_results: [],
    api_users: [],
    // temp_archive: [],
    queue_tempArchive: [],
    sync: false,
    nTweets: 0,
    lastUpdated: 'never',
    query: '',
    auth: { authorization: null, 'x-csrf-token': null, name: 'empty_auth' },
    userInfo: {},
    doRefreshIdb: false,
    showPatchNotes: false,
    webRequestPermission: true,
    doBigTweetScrape: true,
    doSmallTweetScrape: false,
    doIndexUpdate: false,
    doIndexLoad: false,
    queue_lookupTweets: [],
    queue_lookupRefresh: [],
    queue_lookupBookmarks: [],
    queue_addTweets: [],
    queue_refreshTweets: [], //the same as addTweets, but for when we're refreshing tweets that are already in the idb
    queue_removeTweets: [],
    isMidSearch: false,
    isMidScrape: false,
    isMidStore: false,
    isMidRefresh: false,
    archiveQueueN: 0,
    random_tweets: [],
    lastClickedId: null,
  };
};

import accounts from '../dev/data/accounts.js';
import results from '../dev/data/results.js';
export const devStorage = (): DevStorageInterface => {
  return {
    options: defaultOptions(),
    hasArchive: false,
    hasTimeline: {}, // {id_str: Bool}
    activeAccounts: accounts, //{screen_name: String, id_str: String, showTweets: Bool, ...}
    currentScreenName: 'TestUser',
    latest_tweets: [],
    search_results: [],
    api_results: [],
    api_users: [],
    temp_archive: [],
    stgTweetQueue: [],
    sync: true,
    nTweets: results.length,
    lastUpdated: 'never',
    query: '',
    auth: { authorization: null, 'x-csrf-token': null, name: 'devEmptyAuth' },
    userInfo: {},
    doRefreshIdb: false,
    showPatchNotes: false,
  };
};
