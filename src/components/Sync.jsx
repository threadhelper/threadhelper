import { h, render, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useStream } from './useStream.jsx';
import { msgBG, makeOnStorageChanged, getData } from '../utils/dutils.jsx';
import { isNil } from 'ramda'



export function SyncIcon(props){
  // Add `name` to the initial state
  // let state_template = {
  //   synced:'unsynced',
  //   user_info:{username: "No user"},
  //   has_archive:false,
  //   options:{getRTs: true},
  //   tweets_meta:{count: 0, last_updated: "never"}
  // }
  const [synced, setSynced] = useState('unsynced');
  const [meta, setMeta] = useState({count: 0, last_updated: "never"});
  const [user_info, setUserInfo] = useState({username: "No user"});
  const syncDisplay = useStream(props.streams.syncDisplay,'')

  // syncDisplay
  

  const syncStorageChange = async function(item, oldVal, newVal){
    switch(item){
      case "options": 
        // setState({options: newVal != null ? newVal : state.options})
        break;
      case "user_info":
        setUserInfo( isNil(newVal) ? user_info : newVal )
        break;
      // case "has_archive":
      //   wiz.has_archive = newVal;
      //   break;
      case "sync":
        setSynced( (isNil(newVal) || !newVal ) ? 'unsynced' : 'synced' )
        break;
      case "tweets_meta":
        console.log(`meta changed ${newVal}`)
        setMeta( isNil(newVal) ? meta : newVal )
        // setMeta(newVal)
        break;
      default:
        break;
    }
  };
  /*Side-Effects are at the heart of many modern Apps. Whether you want to fetch some data from an API or trigger an effect on the document, 
  you'll find that the useEffect fits nearly all your needs.
  Think of a component which needs to subscribe to some data when it mounts and needs to unsubscribe when it unmounts. 
  This can be accomplished with useEffect too. To run any cleanup code we just need to return a function in our callback.*/
  // To subscribe to storage changes
  useEffect(() => {
    // console.log("adding sync storage listener")
    const onStCh = makeOnStorageChanged(syncStorageChange)
    chrome.storage.onChanged.addListener(onStCh);
    return () => {
      chrome.storage.onChanged.removeListener(onStCh)
      // console.log("removed sync storage listener")
    };
  }, []);

  //init 
  useEffect(async () => {
    setMeta(await getData('tweets_meta'))
    setSynced((await getData('sync')) ? 'synced' : 'unsynced')
    setUserInfo(await getData('user_info'))
  }, []);


  function onSyncClick(){
    console.log("clicked sync")
    msgBG({type:"query", query_type: "update"})
  }

  return (
    <div class={`sync ${synced}`} onClick={onSyncClick}>
      <span class="tooltiptext"> {syncDisplay} </span>  
    </div>
  );
}



