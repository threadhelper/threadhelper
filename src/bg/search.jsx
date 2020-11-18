import {sortKeys} from '../bg/tweetImporter.jsx'
import {inspect} from '../utils/putils.jsx'
const getDocUsername = (index, ref) => index.documentStore.getDoc(ref).username

const isFull = curry((n_tweets, latest) => latest.length >= n_tweets)
const isBookmark = prop('is_bookmark')
const isRT = curry((activeAccNames, t) => (!includes(t.username, activeAccNames) && !t.is_bookmark))
const isReply = t=>!isNil(t.reply_to) && t.reply_to != t.username  

// filterTweet :: filters, screen_name, t -> Bool
export const filterTweet = curry((filters, activeAccNames, t) => 
  (filters.getRTs || !isRT(activeAccNames, t)) && 
  (filters.useBookmarks || !isBookmark(t)) && 
  (filters.useReplies || !isReply(t)))
export const accFilterTweet = curry((activeAccIds, t)=>includes(t.account, activeAccIds))
export const makeValidateTweet = (filters, accsShown) => pipe(both(filterTweet(filters, map(prop('screen_name'), accsShown)), accFilterTweet(map(prop('id_str'), accsShown))))

// genRandomSample :: [id] -> generator(id)
export function* genRandomSample(keys){
  for(const key of keys){
    const rnd = Math.random()
    yield pipe(length, multiply(rnd), Math.floor, nth(__,keys))(keys)
  }
}
// genLatestSample :: [id] -> generator(id)
export function*  genLatestSample(keys){
  console.log('genLatestSample', {keys})
  console.time('reverse(sortKeys(keys))')
  const sorted_keys = reverse(sortKeys(keys))
  console.timeEnd('reverse(sortKeys(keys))')
  for (let key of sorted_keys){
    yield key
  }
}


// get random tweets as a serendipity generator
// TODO make functional
// gets one by one
export const getDefaultTweets = curry(async (sampleFn, n_tweets, filters, db_get, accsShown, getKeys) => {
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

// getRandomSample :: fn -> int -> [id]
// export const getRandomSample = curry( async (getKeys, n_tweets)=>{
//   const keys = await getKeys()
//   return pipe(range(0),_=>map(genRandomSample(keys)))(n_tweets)
// })


// // To see if a tweet can be sampled according to search filters
// export const makeValidityTest = (filters, screen_name)=>{
//   const isRT = t=>((t.username != screen_name) && !t.is_bookmark)
//   const isBookmark = prop('is_bookmark')
//   const isReply = t=>!isNil(t.reply_to) && t.reply_to != t.username  
//   const isValidTweet = t => 
//   (filters.getRTs || !isRT(t)) && 
//   (filters.useBookmarks || !isBookmark(t)) && 
//   (filters.useReplies || !isReply(t))
//   return isValidTweet
// }


// // filterSample :: (fn, filters, String, [id]) -> [tweet]
// export const filterSample = curry( async (db_get, filters, screen_name, ids)=>{
//   let sample = []
//   const _isFull = isFull(n_tweets)  
//   const isValidTweet = filterTweet(filters, screen_name)
//   while(!_isFull(sample)){
//     await pipe(
//       db_get('tweets'),
//       andThen(pipe(when(
//           isValidTweet, 
//           t=>sample.push(t))))
//       )(ids)
//   }
//   return sample
// })


// // TODO make functional
// export async function _getLatestTweets(n_tweets, filters, db_get, screen_name, getKeys){
//   let sample = []
//   const keys = await getKeys()
//   const _isFull = isFull(n_tweets)
//   const isValidTweet = filterTweet(filters, screen_name)
//   for (const k of reverse(sortKeys(keys))){
//     const t = await db_get('tweets',k)
//     isValidTweet(t) ? sample.push(t) : null
//     if(_isFull(sample)) break;
//   }
//   return sample
// }