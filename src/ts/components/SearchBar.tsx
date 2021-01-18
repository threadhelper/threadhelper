import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { makeOnStorageChanged } from '../utils/dutils';
import { useStream } from '../hooks/useStream';
import { useStorage, useOption } from '../hooks/useStorageStorage';
import Kefir, { sequentially } from 'kefir';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch} from 'ramda' // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda' // Object
import { head, tail, take, isEmpty, any, all,  includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice} from 'ramda' // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda' // Logic, Type, Relation, String, Math

import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga'


export function FilterButton(props: { Icon: any; name: string; useFilter: boolean; setFilter: any; }){
  const Icon = props.Icon
  // console.log('FilterButton', {Icon})
  // useEffect(()=>console.log('FilterButton', {props, Icon}), []);
  return (
    <span class={props.name}> 
        <input id={props.name} name={props.name} class='filter-checkbox' type="checkbox" checked={props.useFilter} onChange={(event)=>handleInputChange(props.setFilter, event)}></input> 
        <label for={props.name} >< Icon class='filter-icon hoverHighlight' onClick={_ => _} /> </label>
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
  
  const idle2Shuffle = (idleMode: string) => idleMode === 'random' ? true : false // String -> Bool
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

const getTargetVal = (target: { type: string; checked: any; value: any; })=>(target.type === 'checkbox' ? target.checked : target.value)
const handleInputChange = curry((_set: (x: any) => unknown, event) => {
  csEvent('User', `Toggled filter ${event.target.id} to ${getTargetVal(event.target)}`, event.target.id, getTargetVal(event.target) ? 1 : 0,);
  pipe(
    prop('target'),
    getTargetVal,
    _set
  )(event)
})