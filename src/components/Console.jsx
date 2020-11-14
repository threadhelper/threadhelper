import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { makeOnStorageChanged } from '../utils/dutils.jsx';
import { useOption } from './useOption.jsx';
import { useStream } from './useStream.jsx';
import { useStorage } from './useStorage.jsx';
import Kefir, { sequentially } from 'kefir';
import {pipe, prop, curry} from 'ramda'
import BookmarkIcon from '../../images/bookmark.svg';
import ReplyIcon from '../../images/reply.svg';
import RetweetIcon from '../../images/retweet.svg';
import ShuffleIcon from '../../images/shuffle.svg';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'

export function Console(){
  // const [text, setText] = useState('[console text]');
  const [text, setText] = useState('[console text]');
  // TODO make these generate themselves
  const [getRTs, setGetRTs] = useOption('getRTs')
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks')
  const [useReplies, setUseReplies] = useOption('useReplies')
  const [idleMode, setIdleMode] = useOption('idleMode')
  
  const idle2Shuffle = idleMode => idleMode === 'random' ? true : false // String -> Bool
  const shuffle2Idle = val => val ? 'random' : 'timeline' // Bool -> String

  return (
    <div class="console">
      <div id='filters'>
        {/* <span>{`Filters:`}</span>       */}
        <span class="useShuffle"> 
          <input id="useShuffle" name="useShuffle" class='filter-checkbox' type="checkbox" checked={idle2Shuffle(idleMode)} onChange={(e)=>handleInputChange(pipe(shuffle2Idle, setIdleMode), e)}></input> 
          <label for="useShuffle" >< ShuffleIcon class='filter-icon' onClick={_ => _} /> </label>
        </span>
        <span>' '</span>
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
    </div> 
  );
}

const getTargetVal = target=>(target.type === 'checkbox' ? target.checked : target.value)
const handleInputChange = curry((_set, event) => {
  csEvent('User', `Toggled filter ${event.target.id} to ${getTargetVal(event.target)}`, event.target.id, getTargetVal(event.target) ? 1 : 0,);
  pipe(
    prop('target'),
    getTargetVal,
    _set
  )(event)
})
