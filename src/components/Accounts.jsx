import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'
import AccountIcon from '../../images/account.svg';
import {DropdownMenu} from './Dropdown.jsx'
import {FilterButton} from './Console.jsx'
import { msgBG, setStg, applyToOptionStg } from '../utils/dutils';
import { defaultTo, pipe, not} from 'ramda'
import {inspect} from '../utils/putils.jsx'
import { useStorage } from './useStorage.jsx';

// 
// const items = [
//   {id: 'Account name', leftIcon: '⛔', effect: ()=>{console.log('clicked account name')}},
// ]

// const toggleAccFilter = (acc) => acc.showTweets = !acc.showTweets
const accountFilterAvi = url => {
    const FilterAvi = props=>{
      return (<img class="icon-img" src={url} />)
    }
    return FilterAvi
  }
const makeAccItems = pipe(values, map(acc => {return {id:acc.id_str, screen_name: acc.screen_name, leftIcon: accountFilterAvi(acc.profile_image_url), effect:()=>{}}}))

export function AccountsButton(props){
  const [open, setOpen] = useState(false);
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts',[]);

  // {key:[usePath, setPath]} = usePath([['activeAccounts', key, 'showTweets']]) for key in activeAccounts
  
  // const closeMenu = (e) => ((!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null)
  const closeMenu = pipe(
    defaultTo(null),
    (e) => {return (!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null}
  )

  const clickButton = ()=>{
    csEvent('User', 'Clicked Accounts button', '')
    setOpen(!open)
  }

  const onClickButton = useCallback(
    clickButton,
    [open]
  );
  
  return (
    <div id="accounts-menu" className="nav-item" >
      <div class="options icon-button" > 
        < AccountIcon class='filter-icon' onClick={onClickButton} onBlur={closeMenu} /> 
      </div>
      {open && <DropdownMenu name={'Accounts'} filterItems={makeAccItems(activeAccounts)} items={[]} debugItems={[]} closeMenu={()=>setOpen(false)} itemClickClose={false}/>}
    </div>
  )
}

