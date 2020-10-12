import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useStream } from './useStream.jsx';
import { useStorage } from './useStorage.jsx';
import { msgBG, makeOnStorageChanged, getData } from '../utils/dutils.jsx';
import { isNil } from 'ramda'



export function SyncIcon(){

  const [sync, setSync] = useStorage('sync', false)
  const [syncDisplay, setSyncDisplay] = useStorage('syncDisplay', 'default sync display msg')


  function onSyncClick(){
    msgBG({type:"query", query_type: "update"})
  }

  useEffect(()=>{
    return ()=>{  };
  },[sync]);


  return (
    <div class={`sync ${sync ? 'synced' : 'unsynced'}`} onClick={onSyncClick}>
      <span class="tooltiptext"> {syncDisplay} </span>  
    </div>
  );
}



