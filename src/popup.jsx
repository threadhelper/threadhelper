import { h, render } from 'preact';
import '@babel/polyfill'
import { useEffect, useCallback } from 'preact/hooks';
import ReactGA from 'react-ga';
import { FeedbackForm } from './components/Feedback.jsx'
import { initGA, Event, PageView, UA_CODE } from './utils/ga.jsx'

export function Welcome2TH(props){
  useEffect(async () => {
    (function initAnalytics() {
      initGA();
    })();
    PageView('/popup.jsx')
    console.log('initialized GA in CS', ReactGA)
  }, []);



  return (
    <div style="width: 200px">
      <spam>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar.</spam>
      <br />
      <br />
      <FeedbackForm/>
    </div>
  )
}


render(<Welcome2TH />, document.body);

