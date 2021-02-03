// only for development with `npm run serve`, to take advantage of HMR
import '@babel/polyfill';
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import { h, render, Fragment, createContext } from 'preact';
import ThreadHelper from '../components/ThreadHelper';
import * as pcss from '../../styles.css';
console.log('hi pcss', pcss);
import * as css from '../../style/cs.css';
console.log('hi css', css);
import { updateTheme } from '../utils/wutils';
import { devStorage } from '../utils/defaultStg';
import { initStg, makeStorageChangeObs, makeGotMsgObs } from '../utils/dutils';
import { dbOpen } from '../worker/idb_wrapper';
import Scraper from './components/Scraper';
import Search from './components/Search';
import TtReader from './components/TtReader';
import Storage from './components/Storage';
import { StorageChangeObs, MsgObs } from '../hooks/BrowserEventObs';
import Kefir, { Observable } from 'kefir';
import { useEffect } from 'react';
import { useState } from 'preact/hooks';
import { nullFn } from '../utils/putils';

const db = dbOpen();
const stgObs$ = makeStorageChangeObs();
const msgObs$ = makeGotMsgObs();

export const Query = createContext({});

export default function Space(props: any) {
  // const [stgObs, setStgObs] = useState<Observable<any, any>>(Kefir.never());
  const [query, setQuery] = useState('');

  // useEffect(() => {
  //   const obs = makeStorageChangeObs();
  //   obs.onValue(nullFn);
  //   setStgObs(obs);
  //   console.log('dev makeStorageChangeObs', { obs, stgObs });
  //   return () => {
  //     obs.offValue(nullFn);
  //   };
  // }, []);

  return (
    <div class="container flex m-4">
      <StorageChangeObs.Provider value={stgObs$}>
        <MsgObs.Provider value={msgObs$}>
          <div class="flex-1">
            <TtReader />
            <Scraper />
            <Search />
            <Storage />
          </div>
          <div class="flex-none w-96 w-max-lg">
            <ThreadHelper />
          </div>
        </MsgObs.Provider>
      </StorageChangeObs.Provider>
    </div>
  );
}
// document.addEventListener('localStorage', console.log);
console.log('Console DEVING', { DEV_MODE: process.env.DEV_MODE });
let bar = document.getElementById('root');
updateTheme();

initStg();

render(<Space />, bar);
