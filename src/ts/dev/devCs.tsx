import '@babel/polyfill';
import {
  getData,
  makeStorageChangeObs,
  msgBG,
  setDataLocalSync,
} from '../utils/dutils';
import {
  WranggleRpc,
  Relay,
  PostMessageTransport,
  BrowserExtensionTransport,
} from '@wranggle/rpc';
import 'chrome-extension-async';
import { defaultTo, prop } from 'ramda';

// Talking to bg
// const bgOpts = {
//   //   permitMessage: (payload, sender) => true,
// };
// const extTransport = new BrowserExtensionTransport(bgOpts);
// const bgRpc = new WranggleRpc({
//   transport: extTransport,
//   channel: 'bgFetch1',
//   //   debug: true,
// });
// const remote = bgRpc.remoteInterface();

const rpcBg = async (fnName, args?) => {
  try {
    return await chrome.runtime.sendMessage({
      type: 'rpcBg',
      fnName,
      args: defaultTo({}, args),
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchBg = async (url, options) => {
  return rpcBg('fetchBg', { url, options });
};
const getAuth = async () => {
  console.log('getAuth');
  const auth = await getData('auth');
  console.log('getAuth1', auth);
  setDataLocalSync(auth);
  return auth;
};
// const fetchBg = async (url, init?) => {
//   console.log('fetchBg in cs', { url });
//   var data = [];
//   try {
//     var dataP = remote.fetchBg('hello');
//     dataP.updateTimeout(5000);
//     console.log({ info: dataP.info() });
//     data = await dataP;
//   } catch (error) {
//     console.error(error);
//   }
//   return data;

//   console.log('got bg response', { data });
//   const response = await remote.fetchBg('memes', '');
//   return response;
// };

// Talking to serve dev pPlayground
const opts = { targetWindow: window, shouldReceive: (x) => true };
// const msgTransport = ;
const rpc = new WranggleRpc({
  transport: new PostMessageTransport(opts),
  channel: 'bgFetch',
  //   debug: true,
});
rpc.addRequestHandler('fetchBg', fetchBg);

// const scrapeRpc = new WranggleRpc({
//   transport: new PostMessageTransport(opts),
//   channel: 'scraper',
//   //   debug: true,
// });
// scrapeRpc.addRequestHandler('getAuth', getAuth);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
});

//init auth
getAuth();
const storageChange$ = makeStorageChangeObs();
storageChange$.log('storageChange$');
const auth$ = storageChange$
  .filter((x: { itemName: string }) => x.itemName == 'auth')
  .map(prop('newVal'));
auth$.onValue((val) => {
  console.log('auth changed', { auth: val });
  setDataLocalSync({ auth: val });
});
