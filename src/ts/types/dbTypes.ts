import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr.js';
import { User } from 'twitter-d';
import { thTweet } from './tweetTypes';

export enum StoreName {
  tweets = 'tweets',
  accounts = 'accounts',
  users = 'users',
  misc = 'misc',
}
export interface thTwitterDB extends DBSchema {
  tweets: {
    key: string;
    value: thTweet;
  };
  accounts: {
    key: string;
    value: User;
  };
  users: {
    key: string;
    value: User;
  };
  misc: {
    key: string;
    value: any;
  };
}

export type ThIndexMetadata = { size: number | null };
