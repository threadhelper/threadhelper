import { h, render, Component, createContext } from 'preact';
import { useState, useEffect, useContext, useRef } from 'preact/hooks';
import { memo } from 'preact/compat';
import { getMode } from '../utils/wutils.jsx';
import { Robo } from './Robo.jsx';
import { Header } from './Header.jsx';
import { Search } from './Search.jsx';
import { useStream } from './useStream.jsx';
import { useOption } from './useOption.jsx';


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

export default function ThreadHelper(props){
  const [active, setActive] = useState(true);
  const myRef = useRef(null);
  

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
  const [roboActive, setRoboActive] = useOption('roboActive')
  return(
    <div class="sidebar">
      <Header streams={props.streams}/>
      {!roboActive ? <Robo active={props.active} streams={props.streams}/> : null}
      <Search active={props.active} composeQuery={props.streams.composeQuery}/>
    </div>
  );
}