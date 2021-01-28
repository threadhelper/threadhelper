import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { defaultTo, map, pipe, values } from 'ramda'; // Function
import ReactTooltip from 'react-tooltip';
import { FullUser } from 'twitter-d';
import AccountIcon from '../../images/account.svg';
import { useStorage } from '../hooks/useStorage';
import { csEvent } from '../utils/ga';
import { DropdownMenu } from './Dropdown';
import { getTimeDiff } from './Tweet';

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
  const [nTweets, setNTweets] = useStorage('nTweets', 0);
  const [lastUpdated, setLastUpdated] = useStorage('lastUpdated', 'never');
  const [currentScreenName, setCurrentScreenName] = useStorage(
    'currentScreenName',
    'user'
  );

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
      <a data-tip="React-tooltip" data-for="accountsMenu">
        <div
          class={`options icon-button`}
          onClick={onClickButton}
          onBlur={closeMenu}
        >
          <AccountIcon
            class={`box-content account-icon hoverHighlight  ${
              sync ? 'synced' : 'unsynced'
            }`}
          ></AccountIcon>
        </div>
      </a>
      <ReactTooltip
        id="accountsMenu"
        delayShow={300}
        place="bottom"
        type="dark"
        effect="solid"
      >
        <span style="color: var(--main-txt-color);">
          {`Hi ${currentScreenName}, I have ${nTweets} tweets available. \n` +
            (sync ? `Last synced: ${getTimeDiff(lastUpdated)}.` : `Syncing...`)}
        </span>
      </ReactTooltip>
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
