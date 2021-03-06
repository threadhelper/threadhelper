import { FullUser, User } from 'twitter-d';
import { IdleMode, SearchFilters, SearchMode } from './stgTypes';
import { thTweet, TweetId } from './tweetTypes';

// discriminated union type.

// type Action =
//  | { type: 'request' }
//  | { type: 'success', results: HNResponse }
//  | { type: 'failure', error: string };

export interface Msg {
  type: string;
  value?: any;
  query?: string;
  reply_to?: string;
  url?: string;
  id?: TweetId;
}

export interface CsMsg extends Msg {
  cs_id: string;
}

export interface GaMsg extends Msg {
  event: Event;
}
export interface GaException extends Msg {
  exception: any;
}

export interface Msg2Worker extends Msg {
  res?: {};
}

export interface WriteAccMsg extends Msg2Worker {
  res: User | FullUser;
}

export interface ReqDefaultTweetsMsg extends Msg2Worker {
  type: string;
  n_tweets: number;
  filters: SearchFilters;
  idle_mode: IdleMode;
  accsShown: User[];
}

export interface ReqSearchMsg extends Msg2Worker {
  type: string;
  filters: SearchFilters;
  searchMode: SearchMode;
  accsShown: User[];
  n_results: number;
  query: string;
}
export interface WorkerMsg extends Msg {
  res?: {};
  log?: string;
  baggage?: string;
}

export interface WorkerMsg extends Msg {
  res?: {};
  log?: string;
  baggage?: string;
}

export interface WorkerLog extends WorkerMsg {
  log: string;
  baggage: string;
}

export interface UrlMsg extends Msg {
  url: string;
}
export interface MsgWrapper {
  m: Msg; //message
  s: string; //sender
}

export interface IndexSearchResult {
  ref: string;
  score: number;
}

export interface TweetResult {
  tweet: thTweet;
  score?: number;
}
export interface SearchResult extends TweetResult {
  tweet: thTweet;
  score: number;
}

export interface DefaultResult extends TweetResult {
  tweet: thTweet;
}

export interface TweetResWorkerMsg extends WorkerMsg {
  res: TweetResult[];
  msg?: Msg2Worker;
}
