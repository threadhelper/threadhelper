import { h, render, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import GearIcon from '../../images/gear.svg';
import { msgBG } from '../utils/dutils';




export function SettingsButton(props){
  const [open, setOpen] = useState(false);

  const closeMenu = ()=>{setOpen(false)}

  return (
    <div className="nav-item" >
      <div class="options icon-button" > 
        < GearIcon onFocus={() => {setOpen(true); console.log('settings focused');}} onBlur={
          (e) => {
            // console.log("focusout (self or child)");
            if (e.currentTarget === e.target) {
              console.log("blur (self)");
            }
            if (!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) {
              console.log("focusleave");
              console.log(e.currentTarget);
              console.log(e.relatedTarget);
              setOpen(false)
            }
          }} /> 
      </div>
      {open && <DropdownMenu closeMenu={closeMenu}/>}
      
    </div>
  )
}


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
        effect={onClearStorage}>
        Clear Storage
      </DropdownItem>
      <DropdownItem
        // leftIcon={<GearIcon />}
        effect={onAssessStorage}>
        Assess Storage
      </DropdownItem>
      <DropdownItem
        // leftIcon={<GearIcon />}
        effect={onGetBookmarks}>
        Get Bookmarks
      </DropdownItem>
    </div>
  );
}