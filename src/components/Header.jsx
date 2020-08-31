import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { makeOnStorageChanged } from '../utils/dutils.jsx';
import { SyncIcon } from './Sync.jsx';
import {SettingsButton} from './Settings.jsx';
import GearIcon from '../../images/gear.svg';



export function Header(){
  // Add `name` to the initial state
  function onLoadArchive(){
    console.log("clicked archive")
  }

  const tooltip = <span class="tooltiptext"> Click here to upload your Twitter Archive here. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select data/tweet.js. </span>  
  
  return (
    <div class="header">
      <SyncIcon />
      <span class="th-title">Thread Helper</span>
      <div class="archive_icon" onClick={onLoadArchive}> 
        <button>{`(load archive)`}</button> 
        {tooltip}
      </div>
      <SettingsButton>
      </SettingsButton>
    </div>
  );
}
