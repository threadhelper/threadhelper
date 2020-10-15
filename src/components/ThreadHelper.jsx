import { h, render, Component, createContext } from 'preact';
import { useState, useEffect, useContext, useRef } from 'preact/hooks';
import { memo } from 'preact/compat';
import ReactGA from 'react-ga';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga.jsx'
import { getMode } from '../utils/wutils.jsx';
import { Robo } from './Robo.jsx';
import { Header } from './Header.jsx';
import { Search } from './Search.jsx';
import { useStream } from './useStream.jsx';
import { useOption } from './useOption.jsx';


export default function ThreadHelper(props){
  const [active, setActive] = useState(true);
  const myRef = useRef(null);
  
  // useEffect(async () => {
  //   // ReactGA.initialize(UA_CODE, {
  //   //   debug: true,
  //   //   titleCase: false,
  //   // });
  //   // ReactGA.ga('set', 'checkProtocolTask', null);
  //   (function initAnalytics() {
  //     initGA();
  //   })();
  //   // ReactGA.pageview('/sidebar.html');
  //   console.log('initialized GA in CS', ReactGA)
  // }, []);

  return (
    <div class="ThreadHelper" ref={myRef}>
      <Sidebar active={active} streams={props.streams}/>
    </div>
  );
}

function Sidebar(props){
  const [roboActive, setRoboActive] = useOption('roboActive')

  return(
    <div class="sidebar">
      <Header/>
      {/* {roboActive ? <Robo active={props.active} streams={props.streams}/> : null} */}
      <Search active={props.active} composeQuery={props.streams.composeQuery}/>
    </div>
  );
}