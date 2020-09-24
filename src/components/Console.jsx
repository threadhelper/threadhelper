import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { makeOnStorageChanged } from '../utils/dutils.jsx';
import { useOption } from './useOption.jsx';
import { useStream } from './useStream.jsx';
import Kefir, { sequentially } from 'kefir';
import {pipe, prop, curry} from 'ramda'
import BookmarkIcon from '../../images/bookmark.svg';
import ReplyIcon from '../../images/reply.svg';
import RetweetIcon from '../../images/retweet.svg';



export function Console(props){
  // Add `name` to the initial state
  const query = useStream(props.composeQuery,'')
  // const [text, setText] = useState('[console text]');
  const [text, setText] = useState('[console text]');
  // TODO make these generate themselves
  const [getRTs, setGetRTs] = useOption('getRTs')
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks')
  const [useReplies, setUseReplies] = useOption('useReplies')
  
  
  const consoleStorageChange = async function(item, oldVal, newVal){
    switch(item){
      case "search_query":
        // console.log('console storage change: ', {item, newVal})
        setQuery(newVal);
        break;
      case "search_results":
        // wiz.search_results = newVal;
        // console.log("search results: ",newVal)
        // ui.showConsoleMessage("Found these related tweets")
        // updateWithSearch(newVal)
        break;
      case "latest_tweets":
        // console.log("new latest tweets", newVal)
        // wiz.latest_tweets = newVal != null ? newVal : []
        // ui.refreshSidebars()
        break;
      case "roboTweet":
        // // console.log("roboTweet changed in storage, newVal")
        // ui.showRoboTweet(newVal)  
        break;
      case "tweets_meta":
        // // wiz.tweets_meta = newVal != null ? newVal : wiz.makeTweetsMeta(null)
        // wiz.tweets_meta = newVal
        // ui.refreshSidebars()
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
    // console.log('adding console storage listener')
    const onStCh = makeOnStorageChanged(consoleStorageChange)
    chrome.storage.onChanged.addListener(onStCh);
    return () => {chrome.storage.onChanged.removeListener(onStCh); 
      // console.log('removing console storage listener')
    };
  }, []);

  return (
    <div class="console">
      <span>{`Filters:`}</span>      
      <span class="getRTs"> 
        <input id="getRTs" name="getRTs" class='filter-checkbox' type="checkbox" checked={getRTs} onChange={(e)=>handleInputChange(setGetRTs, e)}></input> 
        <label for="getRTs" >< RetweetIcon class='filter-icon' onClick={_ => _} /> </label>
      </span>
      <span class="useBookmarks"> 
        <input id="useBookmarks" name="useBookmarks" class='filter-checkbox' type="checkbox" checked={useBookmarks} onChange={(e)=>handleInputChange(setUseBookmarks, e)}></input> 
        <label for="useBookmarks" > < BookmarkIcon class='filter-icon' onClick={_ => _} /> </label>
      </span>
      <span class="useReplies"> 
        <input id="useReplies" name="useReplies" class='filter-checkbox' type="checkbox" checked={useReplies} onChange={(e)=>handleInputChange(setUseReplies, e)}></input> 
        <label for="useReplies" > < ReplyIcon class='filter-icon' onClick={_ => _} /> </label>
      </span>
    </div> 
  );
}

// function handleInputChange(set, event) {
//   const target = event.target;
//   const value = target.type === 'checkbox' ? target.checked : target.value;
//   const name = target.name;
  
//   set(value)
// }

const handleInputChange = curry((_set, event) => {
  console.log('handling input change', {event, _set})
  pipe(
    prop('target'),
    target=>(target.type === 'checkbox' ? target.checked : target.value),
    _set
  )(event)
})
