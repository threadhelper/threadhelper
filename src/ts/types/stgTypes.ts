import { FullUser, User } from 'twitter-d';
import { thTweet, TweetId } from './tweetTypes';
import { Credentials } from './types';

export interface ActiveAccType extends FullUser {
  lastGotTimeline: number;
  showTweets: boolean;
  timelineBottomCursor: string;
}
export type ActiveAccsType = { [id: TweetId]: ActiveAccType };
export interface StorageInterface {
  options: Options;
  hasArchive: boolean;
  hasTimeline: object; // {id_str: Bool}
  activeAccounts: ActiveAccsType; //{screen_name: String, id_str: String, showTweets: Bool, ...}
  currentScreenName: string;
  latest_tweets: SearchResult[];
  search_results: SearchResult[];
  api_results: SearchResult[];
  api_users: User[];
  temp_archive: object;
  stgTweetQueue: thTweet[];
  sync: boolean;
  query: string;
  nTweets: number;
  lastUpdated: number;
  auth: Credentials;
  userInfo: User;
  doRefreshIdb: boolean;
  patchUrl: string;
}

export interface TweetResult {
  tweet: thTweet;
}
export interface SearchResult extends TweetResult {
  score: number;
}

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
