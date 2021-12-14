// only for development with `npm run serve`, to take advantage of HMR
import '@babel/polyfill';
// import "core-js/stable";
// import "regenerator-runtime/runtime";
import { createContext, h, options, render } from 'preact';
import 'preact/debug';
import * as css from '../../style/cs.css';
import * as pcss from '../../styles.css';
import ThreadHelper from '../components/ThreadHelper';
import { MsgObs, StorageChangeObs } from '../hooks/BrowserEventObs';
import { initStg, makeStorageChangeObs, setData } from '../stg/dutils';
import { makeGotMsgObs } from '../stg/msgUtils';
import { nullFn } from '../utils/putils';
import { updateTheme } from '../write-twitter/setTheme';
import { dbOpen } from '../bg/idb_wrapper';
import Scraper from './components/Scraper';
import Search from './components/Search';
import Storage from './components/Storage';
import TtReader from './components/TtReader';
import { WranggleRpc, PostMessageTransport } from '@wranggle/rpc';

console.log('hi pcss', pcss);
console.log('hi css', css);

const db = dbOpen();
const stgObs$ = makeStorageChangeObs();
stgObs$.onValue(nullFn);

// const extensionId = 'caagnlhofaohggbecamlnnnflghgeeip'; // th dev build

const opts = { targetWindow: window, shouldReceive: (x) => true };
const rpc = new WranggleRpc({
  postMessage: opts,
  channel: 'bgFetch00',
  // debug: true,
});
const remote = rpc.remoteInterface();
remote.getAuth().then(setData('auth'));

const msgObs$ = makeGotMsgObs();

export const Query = createContext({});

export default function Space(props: any) {
  // const [stgObs, setStgObs] = useState<Observable<any, any>>(Kefir.never());

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
          <div class="flex-1 max-w-full  overflow-x-auto ">
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
let root = document.getElementById('root');
let root2 = document.getElementById('root2');
updateTheme();

initStg();

console.log('initializing dev environment', {
  DEV_MODE: process.env.DEV_MODE,
  stgObs$,
});
render(<Space />, root);
render(
  <div
    class="bg-green-300"
    onClick={() => {
      stgObs$.offValue(nullFn);
      console.log('refreshing', { stgObs$ });
      stgObs$.onValue(nullFn);
      render(null, root);
      render(<Space />, root);
    }}
  >
    Refresh
  </div>,
  root2
);
