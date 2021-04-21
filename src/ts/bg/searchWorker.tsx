import '@babel/polyfill';
import { isNil, path, curry, map } from 'ramda';
import { SearchResult } from '../types/stgTypes';
import { thTweet } from '../types/tweetTypes';
import { toggleDebug } from '../utils/putils';
import { dbOpen } from './idb_wrapper';
import { search } from './nlp';
import { makeSearchResponse, patchTweetWithUser } from './stgOps';
import { ThIndexMetadata } from '../types/dbTypes';
import { loadIndexFromIdb } from './stgUtils';
import {
  genLatestSample,
  genRandomSample,
  getDefaultTweets,
  getLatestTweets,
} from './search';
import { n_tweets_results } from '../utils/params';

// var DEBUG = process.env.NODE_ENV != 'production';
// toggleDebug(window, DEBUG);

const db_promise = dbOpen();
// var idx_promise = loadIndexFromIdb(db_promise);
var idx_promise = new Promise(() => {});

export async function seek(
  filters,
  accsShown,
  resultN,
  query
): Promise<SearchResult[]> {
  const index = await idx_promise;
  const res = await search(filters, accsShown, resultN, index, query);
  const response = await makeSearchResponse(db_promise, res);
  return response;
}

const idxSize = (index): number | null =>
  isNil(index) ? null : path(['documentStore', 'length'], index);

export async function loadIndex(): Promise<ThIndexMetadata> {
  idx_promise = loadIndexFromIdb(db_promise);
  const index = await idx_promise;
  return { size: idxSize(index) };
}

export const getDefault = curry(async (sampleDefaultFn, accsShown, filters) => {
  const db = await db_promise;
  const dbGet = curry((storeName, key) => db.get(storeName, key));
  const defaultTweets = await getDefaultTweets(
    sampleDefaultFn
  )(n_tweets_results, filters, dbGet, accsShown, () => db.getAllKeys('tweets'));
  const res = await Promise.all(
    map(async (tweet) => {
      return { tweet: await patchTweetWithUser(db_promise, tweet) };
    }, defaultTweets)
  );
  console.log('getDefault', {
    sampleDefaultFn,
    accsShown,
    filters,
    res,
    defaultTweets,
  });
  return res;
});

export const getLatest = getDefault(genLatestSample);

export const getRandom = getDefault(genRandomSample);
