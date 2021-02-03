import * as elasticlunr from 'elasticlunr';
import { IDBPDatabase } from 'idb';
import { curry, difference, filter, isNil, keys, map, tap } from 'ramda';
import { Status } from 'twitter-d';
import { StoreName, thTwitterDB } from '../../types/dbTypes';
import { IndexTweet, thTweet } from '../../types/tweetTypes';
import { dbGetMany, dbPutMany } from '../../worker/idb_wrapper';
import { makeIndex } from '../../worker/nlp';
import { updateIndexAndStoreToDb } from '../../worker/stgOps';

export const loadIndexFromIdb = async (
  db_promise: Promise<IDBPDatabase<thTwitterDB>>
) => {
  const db = await db_promise;
  const indexJson = await db.get(StoreName.misc, 'index');
  console.log('indexJson', { indexJson });
  const index = isNil(indexJson)
    ? makeIndex()
    : elasticlunr.Index.load(indexJson);
  return index;
};

export const importTweets = curry(async (db, prepFn, tweets: Status[]) => {
  const thTweets: thTweet[] = map(prepFn, tweets);
  return await dbPutMany(db, StoreName.tweets, thTweets);
  // updateIndexAndStoreToDb(db, globalIndex, thTweets, []);
  // globalIndex = addToIndex(globalIndex, thTweets);
});

export const findNewIdsInIdb = async (
  index: elasticlunr.Index<IndexTweet>,
  db
) => {
  const idxKeys = keys(index.documentStore.docInfo);
  const idbKeys = await db.getAllKeys('tweets');
  return difference(idbKeys, idxKeys);
};
export const findStaleIdsInIdx = async (
  index: elasticlunr.Index<IndexTweet>,
  db
) => {
  const idxKeys = keys(index.documentStore.docInfo);
  const idbKeys = await db.getAllKeys('tweets');
  return difference(idxKeys, idbKeys);
};

export const updateIdxFromIdb = async (
  index: elasticlunr.Index<IndexTweet>,
  db_promise: Promise<IDBPDatabase<thTwitterDB>>
) => {
  const db = await db_promise;
  const newIds = await findNewIdsInIdb(index, db);
  const staleIds = await findStaleIdsInIdx(index, db);
  const thTweets = await dbGetMany(db, StoreName.tweets, newIds).then(
    filter((x) => !isNil(x))
  );
  return updateIndexAndStoreToDb(db, index, thTweets, staleIds);
};

export const cbTimeFn = async (fn, callback) => {
  const timeStart = performance.now();
  return await fn().then(
    tap((_) => {
      callback(performance.now() - timeStart);
    })
  );
};
