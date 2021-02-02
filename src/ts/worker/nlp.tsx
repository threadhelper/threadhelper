import * as elasticlunr from 'elasticlunr';
import {
  andThen,
  curry,
  filter,
  isNil,
  map,
  pick,
  pipe,
  project,
  prop,
  take,
  values,
} from 'ramda'; // Function
import { User } from 'twitter-d';
import { IndexSearchResult } from '../types/msgTypes';
import { SearchFilters } from '../types/stgTypes';
import { IndexTweet, thTweet, TweetId } from '../types/tweetTypes';
import { makeValidateTweet } from './search';

const tweet_fields = [
  'id',
  'text',
  'name',
  'username',
  'reply_to',
  'mentions',
  'is_bookmark',
  'account',
];

// export const loadIndex = (loadedIndexJson) => {console.log(loadedIndexJson); return isNil(loadedIndexJson) ?  makeIndex() : elasticlunr.Index.load(JSON.parse(loadedIndexJson))}
export const loadIndex = (loadedIndexJson) => {
  //console.log(loadedIndexJson);
  return isNil(loadedIndexJson)
    ? makeIndex()
    : elasticlunr.Index.load(loadedIndexJson);
};

const initIndex = function (this: any) {
  const idx = this;
  idx.setRef('id');
  tweet_fields.forEach((x) => idx.addField(x));
  // idx.saveDocument(false); // this reduces index size but has inconveniences (getDocument always returns null)
};

function _makeIndex(config) {
  var idx = new elasticlunr.Index<IndexTweet>();

  idx.pipeline.add(
    elasticlunr.trimmer,
    elasticlunr.stopWordFilter,
    elasticlunr.stemmer
  );

  if (config) config.call(idx, idx);

  return idx;
}

export const makeIndex = () => _makeIndex(initIndex);

// IMPURE
export const addToIndex = curry(
  async (index: elasticlunr.Index<IndexTweet>, tweets: thTweet[]) => {
    const toDoc = pipe(values, project(tweet_fields));
    toDoc(tweets).forEach((x: IndexTweet) => index.addDoc(x));
    return index;
  }
);

export const removeFromIndex = curry(
  async (index: elasticlunr.Index<IndexTweet>, tweet_ids: string[]) => {
    tweet_ids.forEach((x) => index.removeDocByRef(x));
    return index;
  }
);

export const updateIndex = curry(
  async (
    index: elasticlunr.Index<IndexTweet>,
    tweets_to_add: thTweet[],
    ids_to_remove: TweetId[]
  ) => {
    index = await addToIndex(index, tweets_to_add);
    index = await removeFromIndex(index, ids_to_remove);
    return index;
  }
);
//
//** Find related tweets */
export const getRelated = curry(
  async (
    index: elasticlunr.Index<IndexTweet>,
    query: string
  ): Promise<elasticlunr.SearchResults[]> => {
    //results are of the format {ref, doc}
    return index.search(query, {
      fields: {
        text: { boost: 3 },
        name: { boost: 1 },
        username: { boost: 1 },
        reply_to: { boost: 1 },
        mentions: { boost: 1 },
      },
      boolean: 'OR',
      expand: true,
    });
  }
);

const getDoc = curry(
  (
    index: elasticlunr.Index<IndexTweet>,
    ref: elasticlunr.DocumentReference
  ): IndexTweet => index.documentStore.getDoc(ref)
);
const isFull = curry(
  (n_tweets: number, latest: string | any[]) => latest.length >= n_tweets
);
// getRes :: [idx_tweet] -> [db_tweet]
// export const getTopNResults = curry(async (n_tweets: number, index, filters, accsShown, results: Promise<elasticlunr.SearchResults[]>) => {
//   const isValidTweet = makeValidateTweet(filters, accsShown)
//   const _isFull = isFull(n_tweets)
//   const sample = pipe(
//     inspect('ft getTopNResults'),
//     map(pipe(
//       prop('ref'),
//       getDoc(index))),
//       filter(isValidTweet),
//       take(n_tweets),
//       map(prop('id')),
//   )(results)
//   return sample
// })

export const getTopNResults = curry(
  async (
    n_tweets: number,
    index: elasticlunr.Index<IndexTweet>,
    filters: SearchFilters,
    accsShown: User[],
    results: Promise<elasticlunr.SearchResults[]>
  ): Promise<IndexSearchResult[]> => {
    const isValidTweet = makeValidateTweet(filters, accsShown);
    const sample = pipe(
      map(pick(['ref', 'score'])),
      filter(pipe(prop('ref'), getDoc(index), isValidTweet)),
      take(n_tweets)
    )(results);
    return sample;
  }
);

export const search = curry(
  async (
    filters,
    accsShown,
    n_tweets,
    index,
    query
  ): Promise<IndexSearchResult[]> => {
    return await pipe<
      string,
      Promise<elasticlunr.SearchResults[]>,
      Promise<IndexSearchResult[]>
    >(
      getRelated(index),
      andThen(getTopNResults(n_tweets, index, filters, accsShown))
    )(query);
  }
);
