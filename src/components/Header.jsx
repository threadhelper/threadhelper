import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { makeOnStorageChanged, msgBG } from '../utils/dutils.jsx';
import { SyncIcon } from './Sync.jsx';
import {SettingsButton} from './Settings.jsx';
import {AccountsButton} from './Accounts.jsx';
import {ArchiveUploader} from './LoadArchive.jsx';
import GearIcon from '../../images/gear.svg';
import { useOption } from './useOption.jsx';
import { useStorage } from './useStorage.jsx';



export function Header(){
  const [hasArchive, setHasArchive] = useStorage('hasArchive')
  
  return (
    <div class="header">
      <SyncIcon/>
      <div class="title-container"> <span class="th-title">ThreadHelper</span></div>
      {!hasArchive ? <ArchiveUploader /> : null}
      <AccountsButton/>
      <SettingsButton/>
    </div>
  );
}
