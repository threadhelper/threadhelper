import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'
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

  const clickSettings = ()=>{
    csEvent('User', 'Clicked Settings button', '')
    setOpen(!open)
  }

  const onClickSettings = useCallback(
    clickSettings,
    [open]
  );
  
  return (
    <div className="nav-item" >
      <div class="options icon-button" > 
        < GearIcon class='settings-icon' onClick={onClickSettings} onBlur={closeMenu} /> 
      </div>
      {open && <DropdownMenu closeMenu={()=>setOpen(false)}/>}
      
    </div>
  )
}

const debug = false

export function DropdownMenu(_props) {
  const dropdownRef = useRef(null);

  function DropdownItem(props) {


    const onClickItem = e=>{
      csEvent('User', 'Settings click', props.id);      
      props.effect(); 
      _props.closeMenu();
    }

    return (
      <a href="#" className="menu-item" onClick={onClickItem}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.id}
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
      {/* <DropdownItem
        // leftIcon={<GearIcon />}
        effect={()=>{}}>
        Load Archive
      </DropdownItem> */}
      <DropdownItem
        id={'Reset Storage'}
        leftIcon={'⛔'}
        effect={onClearStorage}>
      </DropdownItem>
      <DropdownItem
        id={'Update Timeline'}
        leftIcon={'♻'}
        effect={()=>{msgBG({type:'update-timeline'})}}>
      </DropdownItem>
      <DebugItem
        id={'Assess Storage'}
        leftIcon={'🛠'}
        effect={onAssessStorage}>
      </DebugItem>
      <DebugItem
        id={'Log Auth'}
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'log-auth'})}}>
      </DebugItem>
      <DebugItem
        id={'Get User Info'}
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'get-user-info'})}}>
      </DebugItem>
      <DebugItem
        id={'Update Tweets'}
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'update-tweets'})}}>
      </DebugItem>
      <DebugItem
        id={'Get Latest'}
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'get-latest'})}}>
      </DebugItem>
      <DebugItem
        id={'Get Bookmarks'}
        leftIcon={'🛠'}
        effect={onGetBookmarks}>
      </DebugItem>
      <DebugItem
        id={'Make Index'}
        leftIcon={'🛠'}
        effect={()=>{msgBG({type:'make-index'})}}>
      </DebugItem>
      <DebugItem
        id={'Toggle roboActive'}
        leftIcon={'🛠'}
        effect={()=>{applyToOptionStg('roboActive', not)}}>
      </DebugItem>
    </div>
  );
}