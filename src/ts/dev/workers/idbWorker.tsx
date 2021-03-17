import '@babel/polyfill';
import { isNil, map, path } from 'ramda';
import { SearchResult } from '../../types/stgTypes';
import { thTweet } from '../../types/tweetTypes';
import { dbOpen } from '../../worker/idb_wrapper';
import { makeIndex, search } from '../../worker/nlp';
import { makeSearchResponse, storeIndexToDb } from '../../worker/stgOps';
import { ThIndexMetadata } from '../components/Search';
import * as R from 'ramda';
import {
  importTweets,
  removeTweets,
  loadIndexFromIdb,
} from '../storage/devStgUtils';

export const workerImportTweets = async (tweets) => {
  console.log('workerImportTweets', { tweets });
  const db = await dbOpen();
  const res = await importTweets(db, (x) => x, tweets);
  db.close();
  return res;
};

const persistOldAccount = async (t: thTweet): thTweet => {
  const db = await dbOpen();
  const oldT = await db.get('tweets', t.id);
  const newT = R.set(R.lensProp('account'), oldT.account ?? t.account, t);
  db.close();
  return newT;
};

export const workerRefreshTweets = async (tweets: thTweet[]) => {
  const _tweets = await Promise.all(map(persistOldAccount, tweets));
  console.log('[DEBUG] workerRefreshTweets', { _tweets });
  const db = await dbOpen();
  const res = await importTweets(db, (x) => x, _tweets);
  db.close();
  return res;
};

export const workerRemoveTweets = async (ids) => {
  const db = await dbOpen();
  console.log('workerRemoveTweets', { ids, db });
  const res = await removeTweets(db, ids);
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
