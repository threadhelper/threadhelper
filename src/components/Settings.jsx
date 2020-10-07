import { h, render, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import GearIcon from '../../images/gear.svg';
import { msgBG, setStg, applyToOptionStg } from '../utils/dutils';
import { defaultTo, pipe, not} from 'ramda'




export function SettingsButton(props){
  const [open, setOpen] = useState(false);

  // const closeMenu = (e) => ((!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null)
  const closeMenu = pipe(
    defaultTo(null),
    (e) => {return (!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null}
  )
  
  return (
    <div className="nav-item" >
      <div class="options icon-button" > 
        < GearIcon class='settings-icon' onClick={() => setOpen(!open)} onBlur={closeMenu} /> 
      </div>
      {open && <DropdownMenu closeMenu={()=>setOpen(false)}/>}
      
    </div>
  )
}

const debug = false

export function DropdownMenu(_props) {
  const dropdownRef = useRef(null);

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={(e)=>{props.effect(); _props.closeMenu();}}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }
  
  function DebugItem(props) {
    return (debug ? DropdownItem(props) : null)
  }

  function onClearStorage(){
    console.log("clear storage")
    msgBG({type:'clear'})
  }

  function onAssessStorage(){
    console.log("assess storage")
    chrome.storage.local.getBytesInUse(b=>{console.log(`Storage using ${b} bytes`)})
  }

  function onGetBookmarks(){
    console.log("get bookmarks")
    msgBG({type:'get-bookmarks'})
  }


  return (
    <div className="dropdown" ref={dropdownRef}>
      <DropdownItem
        // leftIcon={<GearIcon />}
        effect={()=>{}}>
        Load Archive
      </DropdownItem>
      <DropdownItem
        leftIcon={'⛔'}
        effect={onClearStorage}>
        Clear Storage
      </DropdownItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={onAssessStorage}>
        Assess Storage
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'log-auth'})}}>
        Log Auth
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'get-user-info'})}}>
        Get User Info
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'update-tweets'})}}>
        Update Tweets
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'update-timeline'})}}>
        Update Timeline
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'get-latest'})}}>
        Get Latest
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={onGetBookmarks}>
        Get Bookmarks
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'make-index'})}}>
        Make Index
      </DebugItem>
      <DebugItem
        leftIcon={'🛠'}
        effect={()=>{applyToOptionStg('roboActive', not)}}>
        Toggle roboActive
      </DebugItem>
    </div>
  );
}