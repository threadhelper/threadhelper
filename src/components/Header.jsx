import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { makeOnStorageChanged, msgBG } from '../utils/dutils.jsx';
import { SyncIcon } from './Sync.jsx';
import {SettingsButton} from './Settings.jsx';
import {ArchiveUploader} from './LoadArchive.jsx';
import GearIcon from '../../images/gear.svg';
import { useOption } from './useOption.jsx';



export function Header(props){
  const [hasArchive, setHasArchive] = useOption('hasArchive')
  const tooltip = <span class="tooltiptext"> Click here to upload your Twitter Archive here. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select data/tweet.js. </span>  
  
  return (
    <div class="header">
      <SyncIcon streams={props.streams}/>
      <span class="th-title">Thread Helper</span>
      {!hasArchive ? <ArchiveUploader /> : null}
      <SettingsButton>
      </SettingsButton>
    </div>
  );
}
