import { h, render, Component, createContext } from 'preact';
import { useState, useEffect, useContext, useRef } from 'preact/hooks';
import { memo } from 'preact/compat';
import ReactGA from 'react-ga';
import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga'
import { getMode } from '../utils/wutils';
import { Header } from './Header';
import { Search } from './Search';
import { useStream } from '../hooks/useStream';
import { useOption } from '../hooks/useStorage';


export default function ThreadHelper(props: any){
  const [active, setActive] = useState(true);
  const myRef = useRef(null);
  
  return (
    <div class="ThreadHelper" ref={myRef}>
      <Sidebar active={active}/>
    </div>
  );
}

function Sidebar(props: { active: any;}){
  return(
    <div class="sidebar">
      <Header />
      {/* {roboActive ? <Robo active={props.active} streams={props.streams}/> : null} */}
      <Search />
    </div>
  );
}