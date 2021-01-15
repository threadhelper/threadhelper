import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { makeOnStorageChanged, msgBG } from '../utils/dutils';
import { SyncIcon } from './Sync';
import {SettingsButton} from './Settings';
import {AccountsButton} from './Accounts';
import {ArchiveUploader} from './LoadArchive';



// const DEVING = process.env.DEV_MODE == 'serve'

export function Header(){
  // const [hasArchive, setHasArchive] = DEVING ? useState(true) : useStorage('hasArchive') 
  
  return (
    <div class="header">
      {/* <SyncIcon/> */}
      <AccountsButton/>
      <div class="title-container"> <span class="th-title">ThreadHelper</span></div>
      {/* {!hasArchive ? <ArchiveUploader /> : null} */}
      <SettingsButton/>
    </div>
  );
}
