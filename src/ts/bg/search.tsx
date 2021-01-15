import { SearchFilters } from '../types/stgTypes'
import { IndexTweet, thTweet } from '../types/tweetTypes'
import {sortKeys} from './tweetImporter'
import {inspect, timeFn} from '../utils/putils'
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch} from 'ramda' // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda' // Object
import { head, tail, take, isEmpty, any, all,  includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice} from 'ramda' // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda' // Logic, Type, Relation, String, Math
import { DocumentStore, Index } from 'elasticlunr'
import { User } from 'twitter-d'


const getDocUsername = (index: Index<IndexTweet>, ref) => index.documentStore.getDoc(ref).username

const isFull = curry((n_tweets: number, latest: string | any[]) => latest.length >= n_tweets)
const isBookmark = prop('is_bookmark')
const isRT = curry((activeAccNames: string | readonly string[], t) => (!includes(t.username, activeAccNames) && !t.is_bookmark))
const isReply = (t: { reply_to: any; username: any })=>!isNil(t.reply_to) && t.reply_to != t.username  

// filterTweet :: filters, screen_name, t -> Bool
export const filterTweet = curry((filters: SearchFilters, activeAccNames:string[], t: thTweet) => 
  (filters.getRTs || !isRT(activeAccNames, t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t)))
export const accFilterTweet = curry((activeAccIds: string | readonly string[], t)=>includes(t.account, activeAccIds))
export const makeValidateTweet = (filters: object, accsShown:User[]): ((t:thTweet|IndexTweet)=>boolean) => both(
    filterTweet(filters, map(prop('screen_name'), accsShown)), 
    accFilterTweet(map(prop('id_str'), accsShown)))

// genRandomSample :: [id] -> generator(id)
export function* genRandomSample(keys){
  for(const key of keys){
    const rnd = Math.random()
    yield pipe(length, multiply(rnd), Math.floor, nth(__,keys))(keys)
  }
}
// genLatestSample :: [id] -> generator(id)
export function* genLatestSample(keys){
  console.time('[TIME] reverse(sortKeys(keys))')
  const sorted_keys = reverse(sortKeys(keys))
  console.timeEnd('[TIME] reverse(sortKeys(keys))')
  for (let key of sorted_keys){
    yield key
  }
}


// get random tweets as a serendipity generator
// TODO make functional
// gets one by one
export const getDefaultTweets = curry(async (sampleFn: (arg0: any) => any, n_tweets, filters, db_get: (arg0: string) => () => Promise<unknown>, accsShown, getKeys: () => any) => {
  let sample = []
  const keys = await getKeys()
  const _isFull = isFull(n_tweets)  
  const isValidTweet = makeValidateTweet(filters, accsShown)
  const gen = sampleFn(keys)
  console.log('getDefaultTweets', {isValidTweet, gen, accsShown})
  if(isEmpty(accsShown)) return []
  while(!_isFull(sample)){
    const next = gen.next()
    if(next.done) break;
    await pipe(
      db_get('tweets'),
      andThen(pipe(when(isValidTweet, t=>sample.push(t)))),
      )(next.value)
  }
  return sample
})


export const getRandomSampleTweets = getDefaultTweets(genRandomSample)
export const getLatestTweets = getDefaultTweets(genLatestSample)
