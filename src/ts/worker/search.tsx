import { Index } from 'elasticlunr';
import {
  andThen,
  both,
  curry,
  includes,
  isEmpty,
  isNil,
  length,
  map,
  multiply,
  nth,
  pipe,
  prop,
  reverse,
  when,
  __,
} from 'ramda'; // Function
import { User } from 'twitter-d';
import { sortKeys } from '../bg/tweetImporter';
import { SearchFilters } from '../types/stgTypes';
import { IndexTweet, thTweet, TweetId } from '../types/tweetTypes';

const getDocUsername = (index: Index<IndexTweet>, ref) =>
  index.documentStore.getDoc(ref).username;

const isFull = curry(
  (n_tweets: number, latest: string | any[]) => latest.length >= n_tweets
);
const isBookmark = prop('is_bookmark');
const isRT = curry(
  (activeAccNames: string | readonly string[], t): boolean =>
    !includes(t.username, activeAccNames) && !t.is_bookmark
);
const isReply = (t: { reply_to: any; username: any }) =>
  !isNil(t.reply_to) && t.reply_to != t.username;

// filterTweet :: filters, screen_name, t -> Bool
export const filterTweet = curry(
  (filters: SearchFilters, activeAccNames: string[], t: thTweet): boolean =>
    (filters.getRTs || !isRT(activeAccNames, t)) &&
    (filters.useBookmarks || !isBookmark(t)) &&
    (filters.useReplies || !isReply(t))
);
export const accFilterTweet = curry(
  (activeAccIds: string | readonly string[], t) =>
    includes(t.account, activeAccIds)
);
export const makeValidateTweet = (
  filters: SearchFilters,
  accsShown: User[]
): ((t: thTweet | IndexTweet) => boolean) =>
  both(
    filterTweet(filters, map(prop('screen_name'), accsShown)),
    accFilterTweet(map(prop('id_str'), accsShown))
  );

type SampleGen = (keys: TweetId[]) => IterableIterator<TweetId>;

export const genRandomSample: SampleGen = function* (keys) {
  for (const key of keys) {
    const rnd = Math.random();
    yield pipe<TweetId[], number, number, number, TweetId>(
      length,
      multiply(rnd),
      Math.floor,
      // tap(() => console.log('genRandomSample', { keys })),
      (x) => {
        return nth(x, keys);
      }
    )(keys);
  }
};

export const genLatestSample: SampleGen = function* genLatestSample(keys) {
  const sorted_keys = reverse(sortKeys(keys));
  for (let key of sorted_keys) {
    yield key;
  }
};

type DbGet = (storeName: string) => (id: TweetId) => Promise<thTweet>;

// get random tweets as a serendipity generator
// TODO make functional
// gets one by one
export const getDefaultTweets = curry(
  async (
    sampleFn: SampleGen,
    n_tweets: number,
    filters: SearchFilters,
    db_get: DbGet,
    accsShown: User[],
    getKeys: () => Promise<TweetId[]>
  ): Promise<thTweet[]> => {
    let sample: thTweet[] = [];
    const keys = await getKeys();
    const _isFull = isFull(n_tweets);
    const isValidTweet: (t: thTweet) => boolean = makeValidateTweet(
      filters,
      accsShown
    );
    const gen = sampleFn(keys);
    if (isEmpty(accsShown)) return [];
    while (!_isFull(sample)) {
      const next = gen.next();
      if (next.done) break;
      await pipe(
        db_get('tweets'),
        andThen(pipe(when(isValidTweet, (t) => sample.push(t))))
      )(next.value);
    }
    return sample;
  }
);

export const getRandomSampleTweets = getDefaultTweets(genRandomSample);
export const getLatestTweets = getDefaultTweets(genLatestSample);
