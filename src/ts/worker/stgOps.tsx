import * as elasticlunr from 'elasticlunr';
import { IDBPDatabase } from 'idb';
import Kefir, { Subscription } from 'kefir';
import {
  andThen,
  apply,
  assoc,
  both,
  curry,
  filter,
  ifElse,
  includes,
  isEmpty,
  isNil,
  keys,
  last,
  map,
  not,
  path,
  pathEq,
  pipe,
  Pred,
  prop,
  propEq,
  propSatisfies,
  reduce,
  tap,
  tryCatch,
  type,
  __,
} from 'ramda'; // Function
import { User } from 'twitter-d';
import { findInnerDiff } from '../bg/tweetImporter';
import { StoreName, thTwitterDB } from '../types/dbTypes';
import {
  IndexSearchResult,
  ReqDefaultTweetsMsg,
  ReqSearchMsg,
  SearchResult,
  TweetResWorkerMsg,
  WorkerMsg,
  WriteAccMsg,
} from '../types/msgTypes';
import { SearchFilters } from '../types/stgTypes';
import { IndexTweet, thTweet, TweetId } from '../types/tweetTypes';
import {
  currentValue,
  isExist,
  nullFn,
  wInspect,
  inspect,
  wTimeFn,
} from '../utils/putils';
import { dbFilter, dbGet } from './idb_wrapper';
import { loadIndex, makeIndex, search, updateIndex } from './nlp';
import { onWorkerPromise } from './promise-stream-worker';
import { getLatestTweets, getRandomSampleTweets } from './search';
import { doSemanticSearch, reqSemIndexTweets } from './semantic';

export const getRelevantOldIds = async (
  db: IDBPDatabase<thTwitterDB>,
  filterFn: Pred
): Promise<string[]> => {
  return pipe(
    () => dbFilter<thTweet>(db, StoreName.tweets, filterFn),
    andThen(map(prop('id')))
  )();
};

export const findNewTweets = curry(
  async (oldIds: string[], res: thTweet[]): Promise<thTweet[]> =>
    pipe(
      // map(prop('id')),
      // difference(__, oldIds),
      filter(propSatisfies((id) => !includes(id, oldIds), 'id'))
    )(res)
);

export const updateSemanticIndex = async (olds, new_tweets) =>
  pipe<thTweet[], Promise<thTweet[]>, Promise<any>, Promise<any>>(
    () => new_tweets,
    findNewTweets(olds),
    andThen(
      ifElse(
        isEmpty,
        () => {
          info: 'no new tweets';
        },
        reqSemIndexTweets
      )
    ),
    andThen(inspect('[INFO] reqSemIndexTweets'))
  )();

export const storeIndexToDb = async (db, index) => {
  await db.put('misc', index.toJSON(), 'index');
  return index;
};
export const updateIndexAndStoreToDb = curry(
  async (db, index, tweets_to_add, ids_to_remove) => {
    const newIndex = await updateIndex(index, tweets_to_add, ids_to_remove);
    console.log('updateIndexAndStoreToDb', { newIndex });
    storeIndexToDb(db, newIndex);
    return newIndex;
  }
);
// pipe(
//   (index, tweets_to_add, ids_to_remove) =>
//     updateIndex(index, tweets_to_add, ids_to_remove),
//   andThen((index) => index.toJSON()),
//   andThen((index_json) => db.put('misc', index_json, 'index'))
// )(index, tweets_to_add, ids_to_remove)

export const _updateIndex = async (
  db,
  index: elasticlunr.Index<IndexTweet>,
  new_tweets: thTweet[],
  deleted_ids: string[]
) => {
  const olds = await db.getAllKeys('tweets');
  updateSemanticIndex(olds, new_tweets);
  const newIndex = await updateIndexAndStoreToDb(
    db,
    index,
    new_tweets,
    deleted_ids
  );
  return newIndex;
};

export const makeTweetResponse = curry(
  async (db_promise, res: IndexSearchResult): Promise<SearchResult> => {
    const db = await db_promise;
    const tweet = await dbGet(db, 'tweets', res.ref);
    return { tweet, score: res.score };
  }
);

export const makeSearchResponse = curry(
  async (db_promise, results: IndexSearchResult[]): Promise<SearchResult[]> => {
    const _response = await Promise.all(
      map(makeTweetResponse(db_promise), results)
    );
    const missing = filter(pipe(prop('tweet'), isNil), _response);
    const response = filter(pipe(prop('tweet'), isNil, not), _response);
    return response;
  }
);
