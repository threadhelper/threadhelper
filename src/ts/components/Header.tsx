import { h } from 'preact';
import ReactTooltip from 'react-tooltip';
import { AccountsButton } from './Accounts';
import { ApiSearchBar } from './ApiSearchBar';
import { SettingsButton } from './Settings';

export function Header() {
  return (
    <div>
      <div class="header">
        {/* <SyncIcon/> */}
        <div class="title-container">
          <span class="th-title">Thread Helper</span>
          <span class="version text-gray-500">{` v${process.env.VERSION}`}</span>
        </div>
        <ApiSearchBar />
        <AccountsButton />
        <SettingsButton />
      </div>
    </div>
  );
}
//
