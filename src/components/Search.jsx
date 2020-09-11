import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import { getData, msgBG, makeOnStorageChanged } from '../utils/dutils.jsx';
import { Console } from './Console.jsx';
import { Tweet } from './Tweet.jsx';
import { IOStreams } from './ThreadHelper.jsx';
import { useStream } from './useStream.jsx';


export function Search(props){
  // Add `name` to the initial state
  // const [tweets, setTweets] = useState([{id:0,text:'placeholder tweet'}]);
  const [tweets, setTweets] = useState([]);
  // const IO = useContext(IOStreams); //for testing
  const query = useStream(props.composeQuery)
  const myRef = useRef(null);
  // const [synced, setSynced] = useState('synced');
  // setTweets([{text: "memes are great"}, {text: "afkjbasfjbaosufboaubfoaudbfaefaf"}])

  const _setTweets = (t)=>{setTweets(t);}
  const searchStorageChange = async function(item, oldVal, newVal){
    // console.log(` search storage ${item} change active?`, [props.active, myRef])
    if(!props.active) return
    switch(item){
      case "search_results":
        if(newVal != null && newVal.length > 0){
          console.log(`new search results `, newVal)
          _setTweets(newVal != null ? newVal : [])  
        } else{
          console.log('showing latest instead of search')
          const latest = await getData("latest_tweets")
          _setTweets( latest != null ? latest : [])
        }
        break;
      case "latest_tweets":
        console.log(`new latest tweets `, newVal)
        // _setTweets(newVal != null ? newVal : [])
        const isMidSearch = ()=>query!=null && query.length>0
        if(isMidSearch()){
          const search_results = await getData("search_results")
          if(search_results != null){
            console.log('showing search results instead of latest')
            _setTweets( search_results != null ? search_results : [])
            break
          }
        }
        console.log('showing latest')
        _setTweets( newVal != null ? newVal : [])
        break;
      default:
        break;
    }
  };
  /*Side-Effects are at the heart of many modern Apps. Whether you want to fetch some data from an API or trigger an effect on the document, 
  you'll find that the useEffect fits nearly all your needs. 
  Think of a component which needs to subscribe to some data when it mounts and needs to unsubscribe when it unmounts. 
  This can be accomplished with useEffect too. To run any cleanup code we just need to return a function in our callback.*/
  // To subscribe to storage changes
  useEffect(() => {
    // console.log("adding search storage listener")
    const onStCh = makeOnStorageChanged(searchStorageChange)
    chrome.storage.onChanged.addListener(onStCh);
    return () => {
      // console.log("removing search storage listener")
      chrome.storage.onChanged.removeListener(onStCh)
    };
  }, []);

  useEffect(async () => {
    const initTweets = await getData('latest_tweets') 
    setTweets(initTweets != null ? initTweets : [])
  }, []);

  function reqSearch(query){
    // console.log(`requesting search ${query}`)
    msgBG({type:'search', query:query})
  }

  useEffect(()=>{
    if(props.active && query != null) reqSearch(query)
    return ()=>{  };
  },[query]);

  return (
    <div class="searchWidget" ref={myRef}>
      <Console />
      
      <div class="searchTweets"> 
        Search Results for {query}:
        {tweets.map(tweet => (
          // Without a key, Preact has to guess which tweets have
          // changed when re-rendering.
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}


