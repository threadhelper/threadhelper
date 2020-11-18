  import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import { getData, setStg, msgBG, makeOnStorageChanged } from '../utils/dutils.jsx';
import { Console } from './Console.jsx';
import { Tweet } from './Tweet.jsx';
import { IOStreams } from './ThreadHelper.jsx';
import { useStorage } from './useStorage.jsx';
import { useStream } from './useStream.jsx';
import { flattenModule, isExist, inspect } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)


function reqSearch(query){
  msgBG({type:'search', query:query})
}

export function Search(props){
  const [tweets, setTweets] = useState([]);
  const query = useStream(props.composeQuery)
  const myRef = useRef(null);
  const _setTweets = (t)=>{setTweets(t);}
  
  const [searchResults, setSearchResults] = useStorage('search_results',[]);
  const [latestTweets, setLatestTweets] = useStorage('latest_tweets',[]);
  
  // const showSearchRes = (searchResults)=>!(isExist(searchResults) || R.isEmpty(query.trim()))
  const showSearchRes = (searchResults)=>isExist(searchResults)


  useEffect(async () => {
    const initTweets = await getData('latest_tweets') 
    setTweets(initTweets != null ? initTweets : [])
  }, []);

  
  // // To subscribe to storage changes
  // useEffect(() => {
  //   // console.log("adding search storage listener")
  //   const onStCh = makeOnStorageChanged(inspect('storage changed'))
  //   chrome.storage.onChanged.addListener(onStCh);
  //   return () => { 
  //     // console.log("removing search storage listener")
  //     chrome.storage.onChanged.removeListener(onStCh)
  //   };
  // }, []);



  useEffect(()=>{
    setStg('boop', 1)
    R.pipe(
      defaultTo(''),
      R.trim,
      // when(
      //   pipe(either(isNil, isEmpty), not),
      //   pipe(reqSearch)
      //   ),
      pipe(reqSearch),
    )(query)
    // const msg = (query.trim()) ? null : query.trim()
    // if(props.active && msg != null) reqSearch(msg)
    return ()=>{  };
  },[query]);

  useEffect(()=>{
    console.log({searchResults})
    return ()=>{  };
  },[searchResults]);
  // useEffect(()=>{
  //   console.log({latestTweets})
  //   return ()=>{  };
  // },[latestTweets]);


  return (
    <div class="searchWidget" ref={myRef}>
      <Console/>
      {showSearchRes(searchResults) 
      ? <SearchResults tweets={searchResults} /> 
      : <SearchResults tweets={latestTweets} /> }
    </div>
  );
}

function prepTweets(list){
  return defaultTo([],list)
}

function SearchResults(props){
  return(
  <div class="searchTweets"> 
        {isEmpty(prepTweets(props.tweets)) 
        ? "No search results."
        : prepTweets(props.tweets).map(tweet => (
          // Without a key, Preact has to guess which tweets have
          // changed when re-rendering.
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
  </div>)
}

