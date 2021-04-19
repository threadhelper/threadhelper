import * as elasticlunr from 'elasticlunr';
import { IDBPDatabase } from 'idb';
import {
  andThen,
  curry,
  filter,
  ifElse,
  includes,
  isEmpty,
  isNil,
  map,
  not,
  pipe,
  Pred,
  prop,
  propSatisfies,
} from 'ramda'; // Function
import { assocUserProps } from './tweetImporter';
import { StoreName, thTwitterDB } from '../types/dbTypes';
import { IndexSearchResult, SearchResult } from '../types/msgTypes';
import { IndexTweet, thTweet } from '../types/tweetTypes';
import { inspect } from '../utils/putils';
import { dbFilter, dbGet } from './idb_wrapper';
import { updateIndex } from './nlp';
import { reqSemIndexTweets } from './semantic';

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
    const userId = prop('user_id', tweet);
    if (userId) {
      const user = await dbGet(db, 'users', userId);
      // console.log("makeTweetResponse", {tweet, userId, user})
      if (!isNil(user)) {
        const tweetResp = {
          tweet: assocUserProps(tweet, user),
          score: res.score,
        };
        return tweetResp;
      }
    }
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
    console.log('makeSearchResponse', {
      missing,
      response,
      _response,
      results,
    });
    return response;
  }
);
