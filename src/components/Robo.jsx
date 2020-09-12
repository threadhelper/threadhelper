import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import { getData, setData, msgBG, makeOnStorageChanged, requestRoboTweet } from '../utils/dutils.jsx';
import { IOStreams } from './ThreadHelper.jsx';
import { useStream } from './useStream.jsx';



// function useObj(obj) {
//   const [state, setState] = useState(obj);
//   const setObj = useCallback((_state) => {
//     setState((state)=>{return state = Object.assign(state,_state)});
//   }, [state]);
//   return { state, setObj };
// }

// function useObj(obj) {
//   const [state, setState] = useState(obj);
//   const setObj = useCallback((_state) => {
//     setState((_state)=>{console.log({state, _state, newState:Object.assign(state,_state)}); return Object.assign(state,_state)});
//   },[state]);
//   return [ state, setObj ];
// //
// }


const getReplyTo =  async ()=>{return await getData('current_reply_to')}
const getQuery = async ()=>{return await getData('search_query')}

// export async function onRoboClick(){
//   //TODO port reply_to thing
//   let reply_to = getReplyTo()
//   let query = getQuery()
//   // inefficient, if they're in storage, I could just get them in bg
//   let msg = {
//     type:"robo-tweet", 
//     query: query != null ? query : '', 
//     reply_to: reply_to != null ? reply_to : ''
//   }
//   msgBG(msg)
//   console.log(`clicked robo sync`, msg)
// }

export function Robo(props){
  // Add `name` to the initial state
  const [tweet, setTweet] = useState('...');
  const [synced, setSynced] = useState('synced');
  // const IO = useContext(IOStreams); //for testing
  const IO = props.streams
  const robo = IO.robo
  const query = useStream(IO.composeQuery)
  const reply_to = useStream(IO.replyTo)
  
  const roboStorageChange = function(item, oldVal, newVal){
    switch(item){
      case "roboTweet": 
        setTweet(newVal != null ? newVal : tweet)
        break;
      case "roboSync": 
        setSynced(newVal ? 'synced' : 'unsynced')
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
    const onStCh = makeOnStorageChanged(roboStorageChange)
    chrome.storage.onChanged.addListener(onStCh);
    return () => chrome.storage.onChanged.removeListener(onStCh);
  }, []);

  async function onRoboClick(){
    if(props.active) {
      requestRoboTweet(query, reply_to)
      console.log({query,reply_to})
    }
  }

  // useEffect(()=>{
  //   const woop = _=>{onRoboClick(); }
  //   robo.onValue(woop)
  //   return ()=>{
  //     console.log('destructing')
  //     robo.offValue(woop)
  //   }
  // }, [])


  return (
    <div class="robo">
      <div class={`sync ${synced}`} onClick={onRoboClick}>
        <span class="tooltiptext"> {`robo, click to get a completion`} </span>  
      </div>
      <div class="roboTweet"> {`🤖: `}<b>{`${query}`}</b>{`${tweet}`}</div>
    </div>
  );
}



