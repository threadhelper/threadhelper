import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { defaultTo, map, pipe, values } from 'ramda'; // Function
import { FullUser } from 'twitter-d';
import AccountIcon from '../../images/account.svg';
import { useStorage } from '../hooks/useStorage';
import { csEvent } from '../utils/ga';
import { DropdownMenu } from './Dropdown';

const accountFilterAvi = (url: string) => {
  const FilterAvi = (props) => {
    return <img class="box-content icon-img" src={url} />;
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
          class={`box-content account-icon hoverHighlight  ${
            sync ? 'synced' : 'unsynced'
          }`}
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
