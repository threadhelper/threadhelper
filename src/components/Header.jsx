import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { makeOnStorageChanged, msgBG } from '../utils/dutils.jsx';
import { SyncIcon } from './Sync.jsx';
import {SettingsButton} from './Settings.jsx';
import {AccountsButton} from './Accounts.jsx';
import {ArchiveUploader} from './LoadArchive.jsx';
import GearIcon from '../../images/gear.svg';
import { useStorage, useOption } from './useStorage.jsx';



export function Header(){
  const [hasArchive, setHasArchive] = useStorage('hasArchive')
  
  return (
    <div class="header">
      <SyncIcon/>
      <AccountsButton/>
      <div class="title-container"> <span class="th-title">ThreadHelper</span></div>
      {!hasArchive ? <ArchiveUploader /> : null}
      <SettingsButton/>
    </div>
  );
}
