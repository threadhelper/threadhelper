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
  const IO = props.streams
  const robo = IO.robo
  const query = useStream(IO.composeQuery)
  const reply_to = useStream(IO.replyTo)

  async function onRoboClick(){
    if(props.active) {
      // requestRoboTweet(query, reply_to)
      // console.log({query,reply_to})
    }
  }

  const isThere = x => !isNil(x) && !isEmpty(x) 
  return (
   
    <div class="robo"> 
      <div class={`robo-sync ${synced ? 'synced' : 'unsynced'}`} onClick={onRoboClick}>{`🤖`}
        <span class="tooltiptext"> {`robo, click to get a completion`} </span>  
      </div>
       <span><b>{(isThere(roboTweet)) ? `: ${query}` : ''}</b>{(isThere(roboTweet)) ? `${roboTweet}` : ''}</span>
    </div>
  );
}



