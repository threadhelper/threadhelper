import { h, render, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { makeOnStorageChanged, getData, setData, msgBG } from '../utils/dutils.jsx';
import { SyncIcon } from './Sync.jsx';
import {SettingsButton} from './Settings.jsx';
import GearIcon from '../../images/gear.svg';
import { defaultTo, curry, propEq, find, take } from 'ramda'
import { useStorage } from './useStorage.jsx';


function LoadArchiveIcon(){  
  const tooltip = <span class="tooltiptext"> Click here to upload your Twitter Archive. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select data/tweet.js. </span>  
  
  return (
    <div class="archive_icon"> 
        <button>{`(load archive)`}</button> 
        {tooltip}
      </div>
  );
}

export const ArchiveUploader = props => {
  const [hasArchive, setHasArchive] = useStorage('hasArchive', false)
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    console.log('load archive clicked')
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  
  const handleChange = (e) => {
    const files = e.target.files;
    console.log('arch files', files)
    const reader = new FileReader();
    reader.onload = importArchive;
    const file = find(propEq('name', "tweet.js"))(files);
    console.log('arch file', file)
    reader.readAsText(file);  
  }

  
  // Parses json and stores in temp to be processed by BG
  function importArchive(){
    const result = this.result.replace(/^[a-z0-9A-Z\.]* = /, "");
    const importedTweetArchive = JSON.parse(result);
    // 
    console.log('setting archive', importedTweetArchive)
    setData({temp_archive:importedTweetArchive}).then(()=>{
      setHasArchive(true)
      msgBG({type:"temp-archive-stored"});
      hiddenFileInput.current.value = null;
    })

  }
  return (
    <div onClick={handleClick}>
      <LoadArchiveIcon >
      </LoadArchiveIcon>
      <input
        type="file"
        accept=".json,.js"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}}
      />
    </div>
  );
}




