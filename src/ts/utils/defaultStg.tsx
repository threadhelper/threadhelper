import { Options, StorageInterface } from '../types/stgTypes';

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
    activeAccounts: [], //{screen_name: String, id_str: String, showTweets: Bool, ...}
    currentScreenName: '',
    latest_tweets: [],
    search_results: [],
    api_results: [],
    api_users: [],
    temp_archive: [],
    stgTweetQueue: [],
    sync: false,
    nTweets: 0,
    lastUpdated: '',
    query: '',
    auth: { authorization: null, 'x-csrf-token': null, name: 'empty_auth' },
    userInfo: {},
    doRefreshIdb: false,
  };
};

import accounts from '../dev/data/accounts.js';
import results from '../dev/data/results.js';
export const devStorage = (): StorageInterface => {
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
  };
};
