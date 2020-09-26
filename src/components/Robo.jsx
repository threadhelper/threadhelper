import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import { getData, setData, msgBG, makeOnStorageChanged, requestRoboTweet } from '../utils/dutils.jsx';
import { IOStreams } from './ThreadHelper.jsx';
import { useStream } from './useStream.jsx';
import { useStorage } from './useStorage.jsx';
import { flattenModule } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)




export function Robo(props){
  // Add `name` to the initial state
  const [roboTweet, setRoboTweet] = useStorage('roboTweet','');
  const [synced, setSynced] = useStorage('roboSync', false);
  // const IO = useContext(IOStreams); //for testing
  const IO = props.streams
  const robo = IO.robo
  const query = useStream(IO.composeQuery)
  const reply_to = useStream(IO.replyTo)

  
  // const roboStorageChange = function(item, oldVal, newVal){
  //   switch(item){
  //     case "roboTweet": 
  //       setTweet(newVal != null ? newVal : tweet)
  //       break;
  //     case "roboSync": 
  //       setSynced(newVal ? 'synced' : 'unsynced')
  //       break;
  //     default:
  //       break;
  //   }
  // };
  /*Side-Effects are at the heart of many modern Apps. Whether you want to fetch some data from an API or trigger an effect on the document, 
  you'll find that the useEffect fits nearly all your needs. 
  Think of a component which needs to subscribe to some data when it mounts and needs to unsubscribe when it unmounts. 
  This can be accomplished with useEffect too. To run any cleanup code we just need to return a function in our callback.*/
  // To subscribe to storage changes
  // useEffect(() => {
  //   const onStCh = makeOnStorageChanged(roboStorageChange)
  //   chrome.storage.onChanged.addListener(onStCh);
  //   return () => chrome.storage.onChanged.removeListener(onStCh);
  // }, []);

  async function onRoboClick(){
    if(props.active) {
      requestRoboTweet(query, reply_to)
      console.log({query,reply_to})
    }
  }

  // useEffect(()=>{
  //   const woop = _=>{onRoboClick(); }
  //   robo.onValue(woop)
  //   return ()=>{
  //     console.log('destructing')
  //     robo.offValue(woop)
  //   }
  // }, [])

  // {(!isNil(tweet) && !isEmpty(tweet)) ? `: ${query} ${tweet}` : ''}
  const isThere = x => !isNil(x) && !isEmpty(x) 
  // const displayRoboTweet = (tweet, query) => (<span><b> {`: ${query}`}</b> {`${tweet}`}</span>)
  return (
   
    <div class="robo"> 
      <div class={`robo-sync ${synced ? 'synced' : 'unsynced'}`} onClick={onRoboClick}>{`🤖`}
        <span class="tooltiptext"> {`robo, click to get a completion`} </span>  
      </div>
       <span><b>{(isThere(roboTweet)) ? `: ${query}` : ''}</b>{(isThere(roboTweet)) ? `${roboTweet}` : ''}</span>
    </div>
  );
}



