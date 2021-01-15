import { h, render, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { setStg,  msgBG } from '../utils/dutils';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch} from 'ramda' // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda' // Object
import { head, tail, take, isEmpty, any, all, find, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice} from 'ramda' // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda' // Logic, Type, Relation, String, Math

import { useStorage } from '../hooks/useStorage';
import { initGA, csEvent, csException, PageView, UA_CODE } from '../utils/ga'


function LoadArchiveIcon(){  
  const tooltip = <span class="tooltiptext"> Click here to upload your Twitter Archive. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select data/tweet.js. </span>  
  
  return (
    <div class="archive_icon"> 
        <button>{`🧾 Load Archive`}</button> 
        {/* <button>{`(load archive)`}</button>  */}
        {tooltip}
      </div>
  );
}

export const ArchiveUploader = props => {
  const [hasArchive, setHasArchive] = useStorage('hasArchive', false)
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    console.log('load archive clicked')
    csEvent('User', 'Load Archive click', '');
    // ts-migrate(2531) FIXME: Object is possibly 'null'.
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  
  // const handleChange = (e: { target: { files: any; }; }) => {
  const handleChange = (e: Event) => {
    const files:FileList = ((e.target as HTMLInputElement).files as FileList);
    {/* const files = e.target.files; */}
    console.log('arch files', files)
    const reader = new FileReader();
    reader.onload = importArchive;
    const file = find(propEq('name', "tweet.js"))(Array.from(files)) as File;
    console.log('arch file', file)
    try{
      reader.readAsText(file);  
    } catch(e){
      console.log('ERROR: Couldn\'t load archive')
      csException('Couldn\'t load archive', false);
    }
  }

  
  // Parses json and stores in temp to be processed by BG
  function importArchive(this: any){
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
      {/* @ts-expect-error ts-migrate(2559) FIXME: Type '{ children: never[]; }' has no properties in... Remove this comment to see the full error message */}
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




