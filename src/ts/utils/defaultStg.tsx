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
    temp_archive: [],
    syncDisplay: `Hi, I don't have any tweets yet.`,
    sync: false,
    nTweets: 0,
    lastUpdated: '',
    query: '',
  };
};

import accounts from '../dev/accounts.js';
import results from '../dev/results.js';
export const devStorage = (): StorageInterface => {
  return {
    options: defaultOptions(),
    hasArchive: false,
    hasTimeline: {}, // {id_str: Bool}
    activeAccounts: accounts, //{screen_name: String, id_str: String, showTweets: Bool, ...}
    currentScreenName: 'TestUser',
    latest_tweets: results,
    search_results: results,
    api_results: results,
    temp_archive: [],
    syncDisplay: `Hi, I don't have any tweets yet.`,
    sync: true,
    nTweets: results.length,
    lastUpdated: 'never',
    query: '',
  };
};
