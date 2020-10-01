import * as elasticlunr from 'elasticlunr'
import { flattenModule, inspect } from '../utils/putils.jsx'
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


// getRes :: [idx_tweet] -> [db_tweet]
export const getTopNResults = curry(async (filters, screen_name, n_tweets, index, results) => {
  const getDocUsername = (ref) => index.documentStore.getDoc(ref).username
  const isRT = (x)=>getDocUsername(x.ref) != screen_name

  const filterRTs = filter(either(_=>filters.getRTs, y=>index.documentStore.getDoc(y.ref).username === screen_name || index.documentStore.getDoc(y.ref).is_bookmark))
  const isNotReply = x => isNil(x.reply_to) || x.reply_to === x.username
  const filterReplies = filter(either(_=>filters.useReplies, y=>isNotReply(index.documentStore.getDoc(y.ref))))
  const isBookmark = prop('is_bookmark')
  const filterBookmarks = filter(pipe(isBookmark, not))
  return pipe(
    // filter(either(_=>filters.useBookmarks, pipe(not,isBookmark))),
    // filter(either(_=>filters.useReplies, pipe(not,isReply))),
    filterRTs,
    filterReplies,
    filterBookmarks,
    take(n_tweets),
    tap(x=>{
      // console.log('hi',{x,pass:filter(y=>filters.getRTs || index.documentStore.getDoc(y.ref).username === screen_name, x), index, getRT:filters.getRTs, username:screen_name, names:map(y=>index.documentStore.getDoc(y.ref).username, x)})
      // console.log('hi',{xdoc:map(y=>index.documentStore.getDoc(y.ref),x) ,pass:map(isNotReply, map(y=>index.documentStore.getDoc(y.ref),x)),  index, useRep:filters.useReplies, username:screen_name, names:map(y=>index.documentStore.getDoc(y.ref).username, x)})
      // console.log('hi',{x,index})
    }),
    map(prop('ref')),
  )(results)
})

export const search = curry (async (filters, screen_name, n_tweets, index, query) => {
  console.log('searching nlp', {filters, screen_name, n_tweets, index, query})
  return await pipe(
    getRelated(index),
    inspect(`related to ${query}`),
    andThen(getTopNResults(filters, screen_name, n_tweets, index)),
    )(query)})
