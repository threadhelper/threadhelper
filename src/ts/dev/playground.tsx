// for trying out live code. Doesn't support ES6 imports, only require()
// npx babel-node -x .tsx -- ./src/ts/dev/playground.tsx
// npx babel-node -r ./src/ts/dev/playground.tsx
// or maybe npx ts-node -r ./src/ts/dev/playground.tsx
// `.editor` - command for multi-line REPL

import * as elasticlunr from 'elasticlunr';
import * as R from 'ramda';
import {
  andThen,
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
import { IndexTweet, thTweet } from '../types/tweetTypes';
import { makeValidateTweet } from '../worker/search';

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

const initIndex = function (this: any) {
  const idx = this;
  idx.setRef('id');
  tweet_fields.forEach((x) => idx.addField(x));
  // idx.saveDocument(false); // this reduces index size but has inconveniences (getDocument always returns null)
};

function _makeIndex(config) {
  var idx = new elasticlunr.Index();

  idx.pipeline.add(
    elasticlunr.trimmer,
    elasticlunr.stopWordFilter,
    elasticlunr.stemmer
  );

  if (config) config.call(idx, idx);

  return idx as elasticlunr.Index<IndexTweet>;
}

export const makeIndex = () => _makeIndex(initIndex);

export const loadIndex = (
  loadedIndexJson: elasticlunr.SerialisedIndexData<IndexTweet>
) =>
  isNil(loadedIndexJson)
    ? makeIndex()
    : elasticlunr.Index.load(loadedIndexJson);

// IMPURE
export const addToIndex = R.curry(
  async (
    index: elasticlunr.Index<IndexTweet>,
    tweets: thTweet[]
  ): Promise<elasticlunr.Index<IndexTweet>> => {
    const toDoc = R.pipe<thTweet[], any, IndexTweet[]>(
      values,
      project(tweet_fields)
    );
    toDoc(tweets).forEach((x: IndexTweet) => index.addDoc(x));
    return index;
  }
);

export const removeFromIndex = R.curry(
  async (index: elasticlunr.Index<IndexTweet>, tweet_ids: string[]) => {
    tweet_ids.forEach((x) => index.removeDocByRef(x));
    return index;
  }
);

export const updateIndex = R.curry(
  async (index, tweets_to_add, ids_to_remove) => {
    index = await addToIndex(index, tweets_to_add);
    index = await removeFromIndex(index, ids_to_remove);
    return index;
  }
);
//
//** Find related tweets */
export const getRelated = R.curry(
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

const getDoc = R.curry(
  (
    index: elasticlunr.Index<IndexTweet>,
    ref: elasticlunr.DocumentReference
  ): IndexTweet => index.documentStore.getDoc(ref)
);
const isFull = R.curry(
  (n_tweets: number, latest: string | any[]) => latest.length >= n_tweets
);
// getRes :: [idx_tweet] -> [db_tweet]
// export const getTopNResults = R.curry(async (n_tweets: number, index, filters, accsShown, results: Promise<elasticlunr.SearchResults[]>) => {
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

export const getTopNResults = R.curry(
  async (
    n_tweets: number,
    index: elasticlunr.Index<IndexTweet>,
    filters: SearchFilters,
    accsShown: User[],
    results: Promise<elasticlunr.SearchResults[]>
  ): Promise<IndexSearchResult[]> => {
    const isValidTweet = makeValidateTweet(filters, accsShown);
    const sample = pipe<any, any, any, any>(
      map(pick(['ref', 'score'])),
      filter(pipe(prop('ref'), getDoc(index), isValidTweet)),
      take(n_tweets)
    )(results);
    return sample;
  }
);

export const search = R.curry(
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
