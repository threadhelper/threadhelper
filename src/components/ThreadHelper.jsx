import { h, render, Component, createContext } from 'preact';
import { useState, useEffect, useContext, useRef } from 'preact/hooks';
import { memo } from 'preact/compat';
import { getMode } from '../utils/wutils.jsx';
import { Robo } from './Robo.jsx';
import { Header } from './Header.jsx';
import { Search } from './Search.jsx';
import { useStream } from './useStream.jsx';


function useStorageState(){
  const [state, setState] = useState({query: '_query'});
  return { state, onStorageChanged };
}

// light dark or black
const Theme = createContext('light');



// function DisplayTheme() {
//   const theme = useContext(Theme);
//   return <p>Active theme: {theme}</p>;
// }

export const IOStreams = createContext('[placeholder IO stream val]')
// export const RoboStream = createContext('[placeholder robo stream val]')
// export const ComposeQueryStream = createContext('[placeholder compose query stream val]')
// export const ReplyToStream = createContext('[placeholder reply to stream val]')



export default function ThreadHelper(props){

  // Add `name` to the initial state
  const [active, setActive] = useState(true);
  // const isFloatBar = useStream(props.float)
  // const [mode, setMode] = useState(getMode(window.location.href));
  // const currentVal = useStream(props.streams.actions, '[placeholder stream val 2]') //for testing
  const myRef = useRef(null);


  
  // /*Side-Effects are at the heart of many modern Apps. Whether you want to fetch some data from an API or trigger an effect on the document, 
  // you'll find that the useEffect fits nearly all your needs.
  // Think of a component which needs to subscribe to some data when it mounts and needs to unsubscribe when it unmounts. 
  // This can be accomplished with useEffect too. To run any cleanup code we just need to return a function in our callback.*/
  // // To subscribe to storage changes
  // useEffect(() => {
  //   setActive(isFloatBar == 'render' ? false : true)
  //   // console.log(`setting active to ${isFloatBar == 'render' ? 'false' : 'true'}`)
  //   return () => {   
  //     // console.log("master TH unmounting")
  //   };
  // }, [isFloatBar]);

  


  return (
    // <IOStreams.Provider value={props.streams}>
    <div class="ThreadHelper" ref={myRef}>
      {/* {active ? <Sidebar /> : null} */}
      <Sidebar active={active} streams={props.streams}/>
    </div>
    // </IOStreams.Provider>
  );
}

function Sidebar(props){

  return(
    <div class="sidebar">
      <Header streams={props.streams}/>
      <Robo active={props.active} streams={props.streams}/>
      <Search active={props.active} composeQuery={props.streams.composeQuery}/>
    </div>
  );
}