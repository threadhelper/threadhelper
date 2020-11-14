import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'
import AccountIcon from '../../images/account.svg';
import {DropdownMenu} from './Dropdown.jsx'
import { msgBG, setStg, applyToOptionStg } from '../utils/dutils';
import { defaultTo, pipe, not} from 'ramda'


const items = [
  {id: 'Account name', leftIcon: '⛔', effect: ()=>{console.log('clicked account name')}},
]

export function AccountsButton(props){
  const [open, setOpen] = useState(false);

  // const closeMenu = (e) => ((!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null)
  const closeMenu = pipe(
    defaultTo(null),
    (e) => {return (!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null}
  )

  const clickSettings = ()=>{
    csEvent('User', 'Clicked Accounts button', '')
    setOpen(!open)
  }

  const onClickSettings = useCallback(
    clickSettings,
    [open]
  );
  
  return (
    <div className="nav-item" >
      <div class="options icon-button" > 
        < AccountIcon class='filter-icon' onClick={onClickSettings} onBlur={closeMenu} /> 
      </div>
      {open && <DropdownMenu name={'Accounts'} items={items} debugItems={[]} closeMenu={()=>setOpen(false)} itemClickClose={false}/>}
    </div>
  )
}

