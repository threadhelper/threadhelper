import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { makeOnStorageChanged } from '../utils/dutils.jsx';
import { useStream } from './useStream.jsx';
import { useStorage, useOption } from './useStorage.jsx';
import Kefir, { sequentially } from 'kefir';
import {pipe, prop, curry} from 'ramda'
import BookmarkIcon from '../../images/bookmark.svg';
import ReplyIcon from '../../images/reply.svg';
import RetweetIcon from '../../images/retweet.svg';
import ShuffleIcon from '../../images/shuffle.svg';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'


{/* <span class="useShuffle"> 
  <input id="useShuffle" name="useShuffle" class='filter-checkbox' type="checkbox" checked={idle2Shuffle(idleMode)} onChange={(e)=>handleInputChange(pipe(shuffle2Idle, setIdleMode), e)}></input> 
  <label for="useShuffle" >< ShuffleIcon class='filter-icon' onClick={_ => _} /> </label>
</span>
<span></span>
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
</span> */}
export function FilterButton(props){
  const Icon = props.Icon
  // console.log('FilterButton', {Icon})
  // useEffect(()=>console.log('FilterButton', {props, Icon}), []);
  return (
    <span class={props.name}> 
        <input id={props.name} name={props.name} class='filter-checkbox' type="checkbox" checked={props.useFilter} onChange={(event)=>handleInputChange(props.setFilter, event)}></input> 
        <label for={props.name} >< Icon class='filter-icon' onClick={_ => _} /> </label>
        {/* <label for={props.name} >< RetweetIcon class='filter-icon' onClick={_ => _} /> </label> */}
        
    </span>
  )
}
// 
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
        < FilterButton name={"useShuffle"} useFilter={idle2Shuffle(idleMode)} setFilter={pipe(shuffle2Idle, setIdleMode)} Icon={ShuffleIcon}/>
        <span></span>
        < FilterButton name={"getRTs"} useFilter={getRTs} setFilter={setGetRTs} Icon={RetweetIcon}/>
        < FilterButton name={"useBookmarks"} useFilter={useBookmarks} setFilter={setUseBookmarks} Icon={BookmarkIcon}/>
        < FilterButton name={"useReplies"} useFilter={useReplies} setFilter={setUseReplies} Icon={ReplyIcon}/>
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
