import "@babel/polyfill";
// import "core-js/stable";
// import "regenerator-runtime/runtime";
import css from '../style/popup.css'; console.log('hi css', {css});
import { h, render } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { toggleDebug } from './utils/putils';
import Tutorial from './components/Tutorial'
import { initGA, Event, PageView, UA_CODE } from './utils/ga'

// Project business 
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);


export function Welcome2TH(props){
  useEffect(async () => {
    (function initAnalytics() {
      initGA();
    })();
    PageView('/popup.tsx')
    // console.log('initialized GA in CS', ReactGA)
    return ()=>{}
  }, []);



  return (
    <div id='popup' style="width: 300px; height:150px;">
      {/* <spam>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar.</spam> */}
      <Tutorial></Tutorial>
      <br />
      <br />
      {/* <FeedbackForm/> */}
    </div>
  )
}


render(<Welcome2TH />, document.body);

