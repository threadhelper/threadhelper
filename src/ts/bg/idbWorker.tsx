import '@babel/polyfill';
import * as R from 'ramda';
import { map } from 'ramda';
import { StoreName } from '../types/dbTypes';
import { thTweet } from '../types/tweetTypes';
import { dbDelMany, dbGetMany, dbOpen, dbPutMany } from './idb_wrapper';
import { makeIndex } from './nlp';
import { storeIndexToDb } from './stgOps';

// var DEBUG = process.env.NODE_ENV != 'production';
// toggleDebug(window, DEBUG);

/* Users */

export const workerImportUsers = async (users) => {
  console.log('workerImportUsers', { users });
  const db = await dbOpen();
  const res = await dbPutMany(db, StoreName.users, users);
  db.close();
  return res;
};

export const workerRemoveUsers = async (ids) => {
  const db = await dbOpen();
  console.log('workerRemoveUsers', { ids, db });
  const res = await dbDelMany(db, StoreName.users, ids);
  db.close();
  return res;
};

/* Tweets */

const persistOldAccount = async (t: thTweet): Promise<thTweet> => {
  const db = await dbOpen();
  const oldT = await db.get('tweets', t.id);
  const newT = R.set(R.lensProp('account'), oldT.account ?? t.account, t);
  db.close();
  return newT;
};

export const workerImportTweets = async (tweets) => {
  console.log('workerImportTweets', { tweets });
  const db = await dbOpen();
  // const res = await importTweets(db, (x) => x, tweets);
  const res = await dbPutMany(db, StoreName.tweets, tweets);
  db.close();
  return res;
};

export const workerRefreshTweets = async (tweets: thTweet[]) => {
  const _tweets = await Promise.all(map(persistOldAccount, tweets));
  console.log('[DEBUG] workerRefreshTweets', { _tweets });
  const db = await dbOpen();
  // const res = await importTweets(db, (x) => x, _tweets);
  const res = await dbPutMany(db, StoreName.tweets, _tweets);
  db.close();
  return res;
};

export const workerRemoveTweets = async (ids) => {
  const db = await dbOpen();
  console.log('workerRemoveTweets', { ids, db });
  const res = await dbDelMany(db, StoreName.tweets, ids);
  db.close();
  return res;
};

export const getAllIds = async (storeName: StoreName) => {
  const db = await dbOpen();
  const res = await db.getAllKeys(storeName); // getAllIds :: () -> [ids]
  db.close();
  return res;
};

export const resetIndex = async () => {
  const db = await dbOpen();
  const res = storeIndexToDb(db, makeIndex());
  db.close();
  return res;
};
