import { h, render, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import GearIcon from '../../images/gear.svg';
import { msgBG } from '../utils/dutils';




export function Settings(props){
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-item" >
      <div class="options icon-button" > 
        < GearIcon onFocus={() => {setOpen(true); console.log('settings focused');}} onBlur={() => setOpen(false)} /> 
      </div>
      
      {open && props.children}
    </div>
  )
}


export function DropdownMenu() {
  const dropdownRef = useRef(null);

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={props.effect}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  function onClearStorage(){
    msgBG({type:'clear'})
  }

  function onAssessStorage(){
    chrome.storage.local.getBytesInUse(b=>{console.log(`Storage using ${b} bytes`)})
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
    </div>
  );
}