import '@babel/polyfill';
import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
import css from '../style/popup.css';
import Tutorial from './components/Tutorial';
import { initGA, PageView } from './utils/ga';
import { toggleDebug } from './utils/putils';
console.log('hi css', { css });

// Project business
var DEBUG = process.env.NODE_ENV != 'production';
toggleDebug(window, DEBUG);

export function Welcome2TH(props) {
  useEffect(async () => {
    (function initAnalytics() {
      initGA();
    })();
    PageView('/popup.tsx');
    // console.log('initialized GA in CS', ReactGA)
    return () => {};
  }, []);

  return (
    <div id="popup" style="width: 300px; height:150px;">
      {/* <spam>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar.</spam> */}
      <Tutorial></Tutorial>
      <br />
      <br />
      {/* <FeedbackForm/> */}
    </div>
  );
}

render(<Welcome2TH />, document.body);
