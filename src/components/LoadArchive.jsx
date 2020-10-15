import { h, render, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { makeOnStorageChanged, getData, setData, setStg,  msgBG } from '../utils/dutils.jsx';
import { SyncIcon } from './Sync.jsx';
import {SettingsButton} from './Settings.jsx';
import GearIcon from '../../images/gear.svg';
import { defaultTo, curry, propEq, find, take } from 'ramda'
import { useStorage } from './useStorage.jsx';
import ReactGA from 'react-ga';
import { initGA, csEvent, csException, PageView, UA_CODE } from '../utils/ga.jsx'

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
    csEvent('User', 'Load Archive click', '');

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
    try{
      reader.readAsText(file);  
    } catch(e){
      console.log('ERROR: Couldn\'t load archive')
      csException('Couldn\'t load archive', false);
    }
  }

  
  // Parses json and stores in temp to be processed by BG
  function importArchive(){
    const result = this.result.replace(/^[a-z0-9A-Z\.]* = /, "");
    const importedTweetArchive = JSON.parse(result);
    
    csEvent('User', 'Loaded Archive', defaultTo(0, importedTweetArchive.length));

    console.log('setting archive', importedTweetArchive)
    setStg('temp_archive',importedTweetArchive).then(()=>{
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




