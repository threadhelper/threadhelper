import '@babel/polyfill'
import css from '../style/popup.scss'
import { h, render } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import ReactGA from 'react-ga';
import { Tutorial } from './components/Tutorial.jsx'
import { FeedbackForm } from './components/Feedback.jsx'
import { initGA, Event, PageView, UA_CODE } from './utils/ga.jsx'

export function Welcome2TH(props){
  useEffect(async () => {
    (function initAnalytics() {
      initGA();
    })();
    PageView('/popup.jsx')
    // console.log('initialized GA in CS', ReactGA)
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

