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
    // interface options
    hideTtSidebarContent: true,
    hideTtSearchBar: true,
    minimizeTweetActions: true,
    // search options
    options: defaultOptions(),
    // Important data
    auth: { authorization: null, 'x-csrf-token': null, name: 'empty_auth' },
    userInfo: {},
    activeAccounts: {}, //{id:FullUser}
    query: '',
    lastClickedId: null,
    //meta data
    pageMetadata: {}, //
    currentScreenName: '',
    nTweets: 0,
    lastUpdated: 0,
    sync: false,
    // api results
    api_results: [],
    api_users: [],
    // index tweets
    latest_tweets: [],
    search_results: [],
    context_results: [],
    random_tweets: [],
    // data flags
    hasArchive: false,
    hasTimeline: {}, // {id_str: Bool}
    // application info/flags
    showApiSearchTooltip: false,
    webRequestPermission: true,
    bgOpLog: [],
    patchUrl: null,
    startRefreshIdb: false,
    // queues
    queue_tempArchive: [],
    queue_lookupTweets: [],
    queue_lookupRefresh: [],
    queue_lookupBookmarks: [],
    queue_addTweets: [],
    queue_refreshTweets: [], //the same as addTweets, but for when we're refreshing tweets that are already in the idb
    queue_removeTweets: [],
    queue_lookupUsers: [],
    queue_addUsers: [],
    queue_removeUsers: [],
    // bg work flags
    doRefreshIdb: false,
    doBigTweetScrape: true,
    doSmallTweetScrape: false,
    doIndexUpdate: false,
    doIndexLoad: false,
    isMidSearch: false,
    isMidScrape: false,
    isMidStore: false,
    isMidRefresh: false,
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
    lastUpdated: 0,
    query: '',
    auth: { authorization: null, 'x-csrf-token': null, name: 'devEmptyAuth' },
    userInfo: {},
    doRefreshIdb: false,
  };
};
