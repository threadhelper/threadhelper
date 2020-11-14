import {sortKeys} from '../bg/tweetImporter.jsx'
const getDocUsername = (ref) => index.documentStore.getDoc(ref).username

const isBookmark = prop('is_bookmark')
const isFull = curry((n_tweets, latest) => latest.length >= n_tweets)
const isRT = curry((screen_name, t) => ((t.username != screen_name) && !t.is_bookmark))
const isReply = t=>!isNil(t.reply_to) && t.reply_to != t.username  

// filterTweet :: filters, screen_name, t -> Bool
export const filterTweet = curry((filters, screen_name, t) => 
  (filters.getRTs || !isRT(screen_name, t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t)))

// To see if a tweet can be sampled according to search filters
const makeValidityTest = (filters, screen_name)=>{
  const isRT = t=>((t.username != screen_name) && !t.is_bookmark)
  const isBookmark = prop('is_bookmark')
  const isReply = t=>!isNil(t.reply_to) && t.reply_to != t.username  
  const isValidTweet = t => 
  (filters.getRTs || !isRT(t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t))
  return isValidTweet
}
// takeRandomSample :: [id] -> generator(id)
export const genRandomSample = (keys)=>{
  const rnd = Math.random(); 
  return pipe(
    length,
    multiply(rnd), 
    Math.floor, 
    nth(__,keys))(keys)}

// get random tweets as a serendipity generator
// TODO make functional
// gets one by one
export const getDefaultTweets = curry(async (sampleFn, n_tweets, filters, db_get, screen_name, getKeys) => {
  let sample = []
  const keys = await getKeys()
  const _isFull = isFull(n_tweets)  
  const isValidTweet = filterTweet(filters, screen_name)

  while(!_isFull(sample)){
    await pipe(
      sampleFn,
      db_get('tweets'),
      andThen(pipe(
        when(
          isValidTweet, 
          t=>sample.push(t))))
      )(keys)
  }
  return sample
})

// getRandomSample :: fn -> int -> [id]
export const getRandomSample = curry( async (getKeys, n_tweets)=>{
  const keys = await getKeys()
  return pipe(range(0),_=>map(genRandomSample(keys)))(n_tweets)
})


// filterSample :: (fn, filters, String, [id]) -> [tweet]
export const filterSample = curry( async (db_get, filters, screen_name, ids)=>{
  let sample = []
  const _isFull = isFull(n_tweets)  
  const isValidTweet = filterTweet(filters, screen_name)
  while(!_isFull(sample)){
    await pipe(
      db_get('tweets'),
      andThen(pipe(when(
          isValidTweet, 
          t=>sample.push(t))))
      )(ids)
  }
  return sample
})

export const getRandomSampleTweets = getDefaultTweets(genRandomSample)


// TODO make functional
export async function getLatestTweets(n_tweets, filters, db_get, screen_name, getKeys){
  let latest = []
  const _isFull = isFull(n_tweets)
  const isValidTweet = filterTweet(filters, screen_name)
  for (const k of reverse(sortKeys(await getKeys()))){
    const t = await db_get('tweets',k)
    isValidTweet(t) ? latest.push(t) : null
    if(_isFull(latest)) break;
  }
  return latest
}