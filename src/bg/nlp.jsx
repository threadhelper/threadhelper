import * as elasticlunr from 'elasticlunr'
import { flattenModule, inspect } from '../utils/putils.jsx'
import { makeValidateTweet } from './search.jsx'
import * as R from 'ramda';
flattenModule(global,R)


const tweet_fields = [
  "id",
  "text", 
  "name", 
  "username", 
  "reply_to",
  "mentions",
  "is_bookmark",
  "account"
]


// const loadedIndexJson = await db_get('misc', 'index')

// export const loadIndex = (loadedIndexJson) => {console.log(loadedIndexJson); return isNil(loadedIndexJson) ?  makeIndex() : elasticlunr.Index.load(JSON.parse(loadedIndexJson))}
export const loadIndex = (loadedIndexJson) => {console.log(loadedIndexJson); return isNil(loadedIndexJson) ?  makeIndex() : elasticlunr.Index.load(loadedIndexJson)}


const initIndex = function(){
  const idx = this; 
  idx.setRef('id'); 
  // for (let field_name of tweet_fields){
  //   this.addField(field_name);
  // }
  tweet_fields.forEach(x=>idx.addField(x))
}

export const makeIndex = () => elasticlunr(initIndex);

// export const updateIndex = async (tweets_to_add, ids_to_remove) => worker.postMessage({type:'updateIndex', tweets_to_add: tweets_to_add, ids_to_remove: ids_to_remove})
// export const addToIndex = async (tweets) => updateIndex(tweets,[])
// export const removeFromIndex = async (tweet_ids) => updateIndex([],tweet_ids)


// IMPURE
export const addToIndex = curry( async (index, tweets) => {
  const toDoc = pipe(
    values,
    project(tweet_fields)
  );
  console.log('adding to index', {index, docs:toDoc(tweets)});
  // forEach(index.addDoc, toDoc(tweets))
  toDoc(tweets).forEach(x=>index.addDoc(x))
  return index
})

export const removeFromIndex = curry (async (index, tweet_ids) => {
  console.log('removing', {index, tweet_ids}); 
  // forEach(index.removeDocByRef, tweet_ids); 
  tweet_ids.forEach(x=>index.removeDocByRef(x)); 
  return index;
})

export const updateIndex = curry (async (index, tweets_to_add, ids_to_remove) => {
  index = await addToIndex(index,tweets_to_add) 
  index = await removeFromIndex(index,ids_to_remove) 
  return index
})
// 
//** Find related tweets */
export const getRelated = curry( async (index, query) => {
  //results are of the format {ref, doc}
  return index.search(query, {
    fields: {
        text: {boost: 3},
        name: {boost: 1},
        username: {boost: 1},
        reply_to: {boost: 1},
        mentions: {boost: 1}
      },
    boolean: "OR",
    expand: true
  });
  // console.log("bg search results:", results)
})

const getDoc = curry((index, ref) => index.documentStore.getDoc(ref))
const isFull = curry((n_tweets, latest) => latest.length >= n_tweets) 
// getRes :: [idx_tweet] -> [db_tweet]
export const getTopNResults = curry(async (n_tweets, index, filters, accsShown, results) => {
  
  const isValidTweet = makeValidateTweet(filters, accsShown)
  const _isFull = isFull(n_tweets)
  // for(const res of results){
  //   if(_isFull(sample)) break;
  //   await pipe(
  //     prop('ref'),
  //     getDoc(index),
  //     when(isValidTweet, t=>sample.push(t)),
  //     )(res)
  // }
  // return map(prop('id'), sample)
  // console.log('getTopNResults', {sample, docs:map(pipe(prop('ref'),getDoc(index)),results), isValidTweet, filters, accsShown, results})
  const sample = pipe(
    map(pipe(prop('ref'),
    getDoc(index))),
    filter(isValidTweet),
    take(n_tweets),
    map(prop('id')),
  )(results)
  return sample
})

// getRes :: [idx_tweet] -> [db_tweet]
// export const _getTopNResults = curry(async (filters, accsShown, n_tweets, index, results) => {
//   const getDocUsername = (ref) => index.documentStore.getDoc(ref).username
//   const activeAccNames = map(prop('screen_name'), accsShown)
//   const activeAccIds = map(prop('id_str'), accsShown)
  
//   const isBookmark = prop('is_bookmark')
//   const isRT = curry((activeAccNames, t) => (!includes(t.username, activeAccNames) && !t.is_bookmark))
//   const isRT = (x)=>getDocUsername(x.ref) != screen_name
//   const isNotReply = x => isNil(x.reply_to) || x.reply_to === x.username
//   // const filterBookmarks = filter(pipe(isBookmark, not))
//   const filterReplies = filter(either(_=>filters.useReplies, y=>isNotReply(index.documentStore.getDoc(y.ref))))
//   const filterRTs = filter(either(_=>filters.getRTs, y=>index.documentStore.getDoc(y.ref).username === screen_name || index.documentStore.getDoc(y.ref).is_bookmark))
//   const filterBookmarks = filter(either(_=>filters.useBookmarks, y=>!index.documentStore.getDoc(y.ref).is_bookmark))
//   return pipe(
//     inspect('getTopNResults'), 
//     // filter(either(_=>filters.useBookmarks, pipe(not,isBookmark))),
//     // filter(either(_=>filters.useReplies, pipe(not,isReply))),
//     filterRTs,
//     filterReplies,
//     filterBookmarks,
//     take(n_tweets),
//     tap(x=>{
//       // console.log('hi',{x,pass:filter(y=>filters.getRTs || index.documentStore.getDoc(y.ref).username === screen_name, x), index, getRT:filters.getRTs, username:screen_name, names:map(y=>index.documentStore.getDoc(y.ref).username, x)})
//       // console.log('hi',{xdoc:map(y=>index.documentStore.getDoc(y.ref),x) ,pass:map(isNotReply, map(y=>index.documentStore.getDoc(y.ref),x)),  index, useRep:filters.useReplies, username:screen_name, names:map(y=>index.documentStore.getDoc(y.ref).username, x)})
//       // console.log('hi',{x,index})
//     }),
//     map(prop('ref')),
//   )(results)
// })

export const search = curry (async (filters, accsShown, n_tweets, index, query) => {
  console.log('searching nlp', {filters, accsShown, n_tweets, index, query})
  return await pipe(
    getRelated(index),
    inspect(`related to ${query}`),
    andThen(getTopNResults(n_tweets, index, filters, accsShown)),
    )(query)})
