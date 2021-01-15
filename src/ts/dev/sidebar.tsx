// only for development with `npm run serve`, to take advantage of HMR
import "@babel/polyfill";
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import { h, render } from 'preact';
import ThreadHelper from '../components/ThreadHelper';
import * as css from '../../style/cs.css'; console.log('hi css', css)
import { updateTheme } from '../utils/wutils';



console.log('Console DEVING', {DEV_MODE: process.env.DEV_MODE})
let bar = document.getElementById('root')
console.log('sidebar.tsx', {bar})
updateTheme()


export default function Space(props: any){
    return (
      <div class="sug_home" style="margin: 0 auto; width: 400px; height:1000px; ">
          <ThreadHelper/>
      </div>
    );
  }

render(<Space/>, bar)