import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'
import GearIcon from '../../images/gear.svg';
import { msgBG, setStg, applyToOptionStg } from '../utils/dutils';
import { defaultTo, pipe, not} from 'ramda'
import {FilterButton} from './Console.jsx'
import { useStorage, useStgPath, useOption } from './useStorage.jsx';

const debug = true


export function DropdownMenu(_props) {
  const dropdownRef = useRef(null);

  function DropdownItem(props) {
    const onClickItem = e=>{
      csEvent('User', `${_props.name} dropdown click` , props.id);      
      props.effect(); 
      defaultTo(true, _props.itemClickClose) ? _props.closeMenu() : null
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

  function FilterItem(props){
    const [filterItem, setFilterItem] = useStgPath(props.path, true)
    const onClickItem = e=>{
      csEvent('User', `${_props.name} dropdown click` , props.screen_name);      
      props.effect(); 
      defaultTo(true, _props.itemClickClose) ? _props.closeMenu() : null
    }

    return(
      <a href="#" className="menu-item" onClick={onClickItem}>
        {/* <span className="icon-button">{props.leftIcon}</span> */}
        < FilterButton name={props.screen_name} useFilter={filterItem} setFilter={setFilterItem} Icon={props.leftIcon}/>
        {props.screen_name}
        <span className="x-icon" onClick={_=>msgBG({type:'remove-account', id:props.id})}>{"X"}</span>
      </a>
      
    )
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      {isNil(_props.filterItems) ? null : _props.filterItems.map( item => <FilterItem path={['activeAccounts', item.id, 'showTweets']} id={item.id} screen_name={item.screen_name} leftIcon={item.leftIcon} effect={item.effect} /> )}
      {isNil(_props.items) ? null : _props.items.map( item => <DropdownItem id={item.id} leftIcon={item.leftIcon} effect={item.effect} /> )}
      {isNil(_props.debugItems) ? null : _props.debugItems.map( item => <DebugItem id={item.id} leftIcon={item.leftIcon} effect={item.effect} /> )}
    </div>
  );
}