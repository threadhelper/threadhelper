import * as elasticlunr from 'elasticlunr'
import { take, values, curry, project, forEach, map, reduce, reduceWhile, append, filter, isNil, difference, prop, pipe, andThen } from 'ramda'
import {inspect} from '../utils/dutils.jsx'


const tweet_fields = [
  "id",
  "text", 
  "name", 
  "username", 
  //"time", 
  "reply_to",
  "mentions"
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

//** Find related tweets */
export const getRelated = curry( async (n_tweets, index, query) => {
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

const getDocUsername = (index, ref) => index.documentStore.getDoc(ref).username

// getRes :: [idx_tweet] -> [db_tweet]
export const getTopNResults = curry(async (getRTs, screen_name, n_tweets, index, results) => {
  return pipe(
    filter(x => getRTs ? true : getDocUsername(index, x.ref) === screen_name),
    take(n_tweets),
    inspect('hi gettopn'),
    x=>{console.log("getTopN", {index}); return x},
    map(prop('ref')),
  )(results)


  // const isFull = (acc, x) => acc.length >= n_tweets
  // reduceWhile(isFull, append), [], results)

  // const related = getRTs ? await getRes(results) : await getResRT(results)
  

  // for (let res of results){
  //   if(res.doc.username === screen_name) related.push(await getDB(res.ref,'tweets'))    
  //   if(related.length >= n_tweets) break;
  // }    
  // return related
})
// 
export const search = curry (async (getRTs, screen_name, n_tweets, index, query) => {
  return await pipe(
    getRelated(n_tweets, index),
    andThen(getTopNResults(getRTs, screen_name, n_tweets, index)),
    )(query)})
