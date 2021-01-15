import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga'
import { msgBG } from '../utils/dutils';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch} from 'ramda' // Function
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda' // Logic, Type, Relation, String, Math

import {FilterButton} from './Console'
import { useStgPath } from '../hooks/useStorage';

const debug = false

export function DropdownMenu(_props: { name: any; itemClickClose: any; closeMenu: () => any; componentItems: any; filterItems: any; items: any; debugItems: any; }) {
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
  const filterItems = defaultTo([], _props.filterItems)
  const componentItems = defaultTo([], _props.componentItems)
  const items = defaultTo([], _props.items)
  const debugItems = defaultTo([], _props.debugItems)

  return (
    <div className="dropdown" ref={dropdownRef}>
    
      {componentItems.map( (Item) => <Item /> )}
      {filterItems.map( (item: { id: any; screen_name: any; leftIcon: any; effect: any; }) => <FilterItem path={['activeAccounts', item.id, 'showTweets']} id={item.id} screen_name={item.screen_name} leftIcon={item.leftIcon} effect={item.effect} /> )}
      {items.map( (item: { id: any; leftIcon: any; effect: any; }) => <DropdownItem id={item.id} leftIcon={item.leftIcon} effect={item.effect} /> )}
      {debugItems.map( (item: { id: any; leftIcon: any; effect: any; }) => <DebugItem id={item.id} leftIcon={item.leftIcon} effect={item.effect} /> )}
    </div>
  );
}