import { User } from 'twitter-d';
import { thTweet } from './tweetTypes';
import { Credentials } from './types';

export interface StorageInterface {
  options: Options;
  hasArchive: boolean;
  hasTimeline: object; // {id_str: Bool}
  activeAccounts: object; //{screen_name: String, id_str: String, showTweets: Bool, ...}
  currentScreenName: string;
  latest_tweets: SearchResult[];
  search_results: SearchResult[];
  api_results: SearchResult[];
  temp_archive: object;
  syncDisplay: string;
  sync: boolean;
  query: string;
  nTweets: number;
  lastUpdated: string;
  auth: Credentials;
}

export interface SearchResult {
  tweet: thTweet;
  score?: number;
}
[];

export interface StorageChange {
  itemName: string;
  oldVal: any;
  newVal: any;
}

export interface Option {
  name: string;
  type: string;
  value: any;
}

export enum IdleMode {
  random = 'random',
  timeline = 'timeline',
}

export enum SearchMode {
  fulltext = 'fulltext',
  semantic = 'semantic',
}

export enum OptionName {
  name = 'name',
  getRTs = 'getRTs',
  useBookmarks = 'useBookmarks',
  useReplies = 'useReplies',
  idleMode = 'idleMode',
  roboActive = 'roboActive',
  searchMode = 'searchMode',
}

export interface Options {
  name: string;
  getRTs: Option;
  useBookmarks: Option;
  useReplies: Option;
  idleMode: Option;
  roboActive: Option;
  searchMode: Option;
}

export interface SearchFilters {
  getRTs: { name: string; value: boolean };
  useBookmarks: { name: string; value: boolean };
  useReplies: { name: string; value: boolean };
}
