// only for development with `npm run serve`, to take advantage of HMR
import '@babel/polyfill';
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import { h, render, Fragment } from 'preact';
import ThreadHelper from '../components/ThreadHelper';
import * as pcss from '../../styles.css';
console.log('hi pcss', pcss);
import * as css from '../../style/cs.css';
console.log('hi css', css);
import { updateTheme } from '../utils/wutils';
import { devStorage } from '../utils/defaultStg';
import { SearchBar } from './SearchBar';

console.log('Console DEVING', { DEV_MODE: process.env.DEV_MODE });
let bar = document.getElementById('root');
console.log('sidebar.tsx', { bar });
updateTheme();

export default function Space(props: any) {
  return (
    <div class="container flex">
      <div class="flex-1">
        <SearchBar show={true} />
      </div>
      <div class="flex-none w-96 w-max-lg">
        <ThreadHelper />
      </div>
    </div>
  );
}

render(<Space />, bar);
