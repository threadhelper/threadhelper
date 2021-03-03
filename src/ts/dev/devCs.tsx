// Running extension as proxy for dev environment
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
  const auth = await getData('auth');
  console.log('getAuth1', auth);
  setDataLocalSync(auth);
  return auth;
};

// Talking to serve dev pPlayground
const opts = { targetWindow: window, shouldReceive: (x) => true };
// const msgTransport = ;
const rpc = new WranggleRpc({
  transport: new PostMessageTransport(opts),
  channel: 'bgFetch',
  //   debug: true,
});
rpc.addRequestHandler('fetchBg', fetchBg);

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
const auth$ = makeStorageChangeObs()
  .filter((x: { itemName: string }) => x.itemName == 'auth')
  .map(prop('newVal'));
auth$.onValue((val) => {
  console.log('auth changed', { auth: val });
  setDataLocalSync({ auth: val });
});
