import { h, render, Component } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga';
import AccountIcon from '../../images/account.svg';
import { DropdownMenu } from './Dropdown';
import { FilterButton } from './Console';
import {
  __,
  curry,
  pipe,
  andThen,
  map,
  filter,
  reduce,
  tap,
  apply,
  tryCatch,
} from 'ramda'; // Function
import {
  prop,
  propEq,
  propSatisfies,
  path,
  pathEq,
  hasPath,
  assoc,
  assocPath,
  values,
  mergeLeft,
  mergeDeepLeft,
  keys,
  lens,
  lensProp,
  lensPath,
  pick,
  project,
  set,
  length,
} from 'ramda'; // Object
import {
  head,
  tail,
  take,
  isEmpty,
  any,
  all,
  includes,
  last,
  dropWhile,
  dropLastWhile,
  difference,
  append,
  fromPairs,
  forEach,
  nth,
  pluck,
  reverse,
  uniq,
  slice,
} from 'ramda'; // List
import {
  equals,
  ifElse,
  when,
  both,
  either,
  isNil,
  is,
  defaultTo,
  and,
  or,
  not,
  T,
  F,
  gt,
  lt,
  gte,
  lte,
  max,
  min,
  sort,
  sortBy,
  split,
  trim,
  multiply,
} from 'ramda'; // Logic, Type, Relation, String, Math
import { inspect } from '../utils/putils';
import { useStorage } from '../hooks/useStorage';
import { FullUser } from 'twitter-d';

const accountFilterAvi = (url: string) => {
  const FilterAvi = props => {
    return <img class="icon-img" src={url} />;
  };
  return FilterAvi;
};
const makeAccItems = pipe(
  values,
  map((acc: FullUser) => {
    return {
      id: acc.id_str,
      screen_name: acc.screen_name,
      leftIcon: accountFilterAvi(acc.profile_image_url_https),
      effect: () => {},
    };
  })
);

export function AccountsButton(props) {
  const [open, setOpen] = useState(false);
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);
  //
  const [sync, setSync] = useStorage('sync', false);
  const [syncDisplay, setSyncDisplay] = useStorage(
    'syncDisplay',
    'default sync display msg'
  );
  //
  const closeMenu = pipe(defaultTo(null), (e: MouseEvent) => {
    return !(e.currentTarget as Node).contains(document.activeElement)
      ? () => {
          console.log('[DEBUG] Setting onBlur', { e });
          setOpen(false);
        }
      : null;
  });

  // const closeMenu = pipe(defaultTo(null), (e: Event) => { return (!(e.currentTarget as HTMLElement).parentNode.parentNode.contains(e.currentTarget as HTMLElement)) ? setOpen(false) : null; });
  const clickButton = () => {
    csEvent('User', 'Clicked Accounts button', '');
    setOpen(!open);
  };
  const onClickButton = useCallback(clickButton, [open]);
  return (
    <div id="accounts-menu" className="nav-item">
      <div class={`options icon-button`}>
        <AccountIcon
          class={`account-icon hoverHighlight  ${sync ? 'synced' : 'unsynced'}`}
          onClick={onClickButton}
          onBlur={closeMenu}
        ></AccountIcon>
      </div>
      <span class="tooltiptext"> {syncDisplay} </span>
      {open && (
        <DropdownMenu
          name={'Accounts'}
          componentItems={[]}
          filterItems={makeAccItems(activeAccounts)}
          items={[]}
          debugItems={[]}
          closeMenu={() => setOpen(false)}
          itemClickClose={false}
        />
      )}
    </div>
  );
}
