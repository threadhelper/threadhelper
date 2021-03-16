import '@babel/polyfill';
import { isNil, path } from 'ramda';
import { SearchResult } from '../../types/stgTypes';
import { thTweet } from '../../types/tweetTypes';
import { dbOpen } from '../../worker/idb_wrapper';
import { search } from '../../worker/nlp';
import { makeSearchResponse } from '../../worker/stgOps';
import { ThIndexMetadata } from '../components/Search';
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

export const workerRemoveTweets = async (ids) => {
  const db = await dbOpen();
  console.log('workerRemoveTweets', { ids, db });
  const res = await removeTweets(db, ids);
  db.close();
  return res;
};
