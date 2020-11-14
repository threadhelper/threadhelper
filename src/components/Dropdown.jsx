import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'
import GearIcon from '../../images/gear.svg';
import { msgBG, setStg, applyToOptionStg } from '../utils/dutils';
import { defaultTo, pipe, not} from 'ramda'

export function DropdownMenu(_props) {
  const dropdownRef = useRef(null);

  function DropdownItem(props) {
    const onClickItem = e=>{
      csEvent('User', `${_props.name} dropdown click` , props.id);      
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

  return (
    <div className="dropdown" ref={dropdownRef}>
      {_props.items.map( item => <DropdownItem id={item.id} leftIcon={item.leftIcon} effect={item.effect} /> )}
      {_props.debugItems.map( item => <DebugItem id={item.id} leftIcon={item.leftIcon} effect={item.effect} /> )}
    </div>
  );
}