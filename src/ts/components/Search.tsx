  import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import { getData, setStg, msgBG, makeOnStorageChanged } from '../utils/dutils';
import { Console } from './Console';
import { Tweet as TweetCard } from './Tweet';
import { useStorage as _useStorage } from '../hooks/useStorage';
import { useStream } from '../hooks/useStream';
import { flattenModule, isExist, inspect } from '../utils/putils'
import * as R from 'ramda';``
// flattenModule(global,R)
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch} from 'ramda' // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda' // Object
import { head, tail, take, isEmpty, any, all,  includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice} from 'ramda' // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda' // Logic, Type, Relation, String, Math
import { Status as Tweet } from 'twitter-d';
import { thTweet } from '../types/tweetTypes';
import { SearchResult } from '../types/msgTypes';
import { defaultOptions, defaultStorage as defaultStorage, devStorage } from '../utils/defaultStg';


const DEVING = process.env.DEV_MODE == 'serve'
const useStorage = DEVING ? (name: string, init:any) => useState(devStorage()[name]) : _useStorage


// function reqSearch(query:string){
//   msgBG({type:'search', query:query})
// }

export function Search(props:any){
  const [tweets, setTweets] = useState([]);
  // const query = useStream(props.composeQuery, '')
  const myRef = useRef(null);
  const _setTweets = (t: any[] | ((prevState: any[]) => any[]))=>{setTweets(t);}
  
  const [searchResults, setSearchResults] = useStorage('search_results',[]);
  const [latestTweets, setLatestTweets] = useStorage('latest_tweets',[]);
  
  // const showSearchRes = (searchResults)=>!(isExist(searchResults) || R.isEmpty(query.trim()))
  const showSearchRes = (searchResults:any[])=>isExist(searchResults)


  useEffect(async () => {
    const initTweets : any = await getData('latest_tweets') 
    setTweets(isNil(initTweets) ? [] : initTweets)
    return ()=>{}
  }, []);

// // 
//   useEffect(()=>{
//     R.pipe(
//       defaultTo(''),
//       // R.trim,
//       reqSearch,
//     )(query)
//     return ()=>{  };
//   },[query]);

  useEffect(()=>{
    console.log({searchResults})
    return ()=>{  };
  },[searchResults]);

  useEffect(()=>{
    console.log({latestTweets})
    return ()=>{  };
  },[latestTweets]);


  return (
    <div class="searchWidget" ref={myRef}>
      {/* <Console/> */}
      {showSearchRes(searchResults) 
      ? <SearchResults results={searchResults} /> 
      : <SearchResults results={latestTweets} /> }
    </div>
  );
}

function prepResults(list: SearchResult[]): SearchResult[]{
  const prepped = defaultTo([],list)
  console.log('prepResults', {list, prepped})
  return filter(pipe(prop('tweet'), isNil, not), prepped)
}

function SearchResults(props: { results: SearchResult[]; }){
  return(
  <div class="searchTweets"> 
        {isEmpty(prepResults(props.results)) 
        ? "No search results."
        : prepResults(prop('results', props)).map((res: SearchResult) => (
          // Without a key, Preact has to guess which tweets have
          // changed when re-rendering.
          <TweetCard key={path(['tweet', 'id'])} tweet={prop('tweet', res)} score={prop('score', res)} />
        ))}
  </div>)
}

