  import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import { getData, msgBG, makeOnStorageChanged } from '../utils/dutils.jsx';
import { Console } from './Console.jsx';
import { Tweet } from './Tweet.jsx';
import { IOStreams } from './ThreadHelper.jsx';
import { useStorage } from './useStorage.jsx';
import { useStream } from './useStream.jsx';
import { eqProps } from 'ramda';
import { flattenModule } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)

const isMidSearch = (query)=>query!=null && query.length>0
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
  
  // const decideShow = (searchResults, latestTweets)=>R.defaultTo([],!(isNil(searchResults) || isEmpty(searchResults)) ? searchResults : latestTweets)
  // const decideShow = (searchResults, latestTweets)=>{const sh = R.defaultTo([],!(isNil(searchResults) || isEmpty(searchResults) || R.isEmpty(query))  ? tap(()=> console.log('decided', {searchResults}),searchResults) : tap(()=> console.log('decided', {latestTweets}),searchResults));  return sh}
  const showSearchRes = (searchResults, latestTweets)=>!(isNil(searchResults) || R.isEmpty(query))


  // const searchStorageChange = async function(item, oldVal, newVal){
  //   if(!props.active) return
  //   switch(item){
  //     case "search_results":
  //       if(newVal != null && newVal.length > 0){
  //         console.log(`new search results `, newVal)
  //         _setTweets(newVal)  
  //       } else{
  //         console.log('showing latest instead of search')
  //         const latest = await getData("latest_tweets")
  //         _setTweets( latest != null ? latest : [])
  //       }
  //       break;
  //     case "latest_tweets":
  //       console.log(`new latest tweets `, newVal)
  //       // _setTweets(newVal != null ? newVal : [])
  //       if(isMidSearch()){
  //         const search_results = await getData("search_results")
  //         if(search_results != null){
  //           console.log('showing search results instead of latest')
  //           _setTweets( search_results != null ? search_results : [])
  //           break
  //         }
  //       }
  //       console.log('showing latest')
  //       _setTweets( newVal != null ? newVal : [])
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // // To subscribe to storage changes
  // useEffect(() => {
  //   // console.log("adding search storage listener")
  //   const onStCh = makeOnStorageChanged(searchStorageChange)
  //   chrome.storage.onChanged.addListener(onStCh);
  //   return () => {
  //     // console.log("removing search storage listener")
  //     chrome.storage.onChanged.removeListener(onStCh)
  //   };
  // }, []);

  useEffect(async () => {
    const initTweets = await getData('latest_tweets') 
    setTweets(initTweets != null ? initTweets : [])
  }, []);



  useEffect(()=>{
    if(props.active && query != null) reqSearch(query)
    return ()=>{  };
  },[query]);

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
      <Console composeQuery={props.composeQuery}/>
      {showSearchRes(searchResults, latestTweets) ? <SearchResults tweets={searchResults} /> : <SearchResults tweets={latestTweets} /> }
    </div>
  );
}

function SearchResults(props){
  return(
  <div class="searchTweets"> 
        {(defaultTo([],props.tweets)).map(tweet => (
          // Without a key, Preact has to guess which tweets have
          // changed when re-rendering.
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
  </div>)
}

