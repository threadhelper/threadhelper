import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { makeOnStorageChanged, msgBG } from '../utils/dutils';
import { SyncIcon } from './Sync';
import { SettingsButton } from './Settings';
import { AccountsButton } from './Accounts';
import { ArchiveUploader } from './LoadArchive';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <div>
      <div class="header">
        {/* <SyncIcon/> */}
        <div class="title-container">
          <span class="th-title">Thread Helper</span>
          <span class="version text-gray-500">{` v${process.env.VERSION}`}</span>
        </div>
        <AccountsButton />
        {/* {!hasArchive ? <ArchiveUploader /> : null} */}
        <SettingsButton />
      </div>
      {/* {process.env.NODE_ENV == 'development' ? <SearchBar /> : null} */}
    </div>
  );
}
