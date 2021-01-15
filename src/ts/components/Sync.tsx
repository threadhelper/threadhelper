import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import { useStream } from './useStream.tsx';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import { useStorage } from '../hooks/useStorage.tsxage.tsx';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import { msgBG, makeOnStorageChanged, getData } from '../utils/dutils.tsx';
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



