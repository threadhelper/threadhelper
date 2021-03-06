import Kefir, { Observable } from 'kefir';
import { isNil } from 'ramda';
import { Credentials } from '../types/types';

export function makePermissionsObs() {
  return Kefir.stream((emitter) => {
    const emitPermissions = (permissions) => {
      emitter.emit(permissions);
    };
    chrome.permissions.getAll(emitPermissions);
    chrome.permissions.onAdded.addListener(emitPermissions);
    chrome.permissions.onRemoved.addListener(emitPermissions);
    return () => {
      chrome.permissions.onAdded.removeListener(emitPermissions);
      chrome.permissions.onRemoved.removeListener(emitPermissions);
      emitter.end();
    };
  });
}
export function makeAuthObs(): Observable<Credentials, any> {
  return Kefir.stream((emitter) => {
    let tabId;
    let authorization;
    let csrfToken;
    // emitter.emit({
    //   name: "credentials",
    //   authorization,
    //   csrfToken,
    // })
    // const webRequestOptions = ["requestHeaders", "blocking"]
    const webRequestOptions: string[] = ['requestHeaders'];
    if (typeof (window as any).browser === 'undefined') {
      // For Chrome only
      webRequestOptions.push('extraHeaders');
    }
    const chromePrep = (details: { requestHeaders: any }) => {
      const requestHeaders = details.requestHeaders;
      // This is required for our fetch requests to succeed in Chromes
      if (
        !requestHeaders.find(
          (h: { name: string }) => h.name.toLowerCase() === 'origin'
        )
      ) {
        requestHeaders.push({ name: 'Origin', value: 'https://twitter.com' });
      }
      return {
        requestHeaders,
      };
    };
    //needed for it to work on chrome
    chrome.webRequest.onBeforeSendHeaders.addListener(
      chromePrep,
      { urls: ['https://api.twitter.com/*'] },
      webRequestOptions
    );
    const emitCredentials = () => {
      const _credentials = {
        name: 'credentials',
        authorization,
        'x-csrf-token': csrfToken,
      };
      emitter.emit(_credentials);
    };
    const onSendHeaders = async (details: {
      tabId: any;
      requestHeaders: any[];
      url: string;
    }) => {
      tabId = details.tabId;
      const _authorization = details.requestHeaders.find(
        (h: { name: string }) => h.name.toLowerCase() === 'authorization'
      );
      const _csrfToken = details.requestHeaders.find(
        (h: { name: string }) => h.name.toLowerCase() === 'x-csrf-token'
      );
      // Don't get headers from search requests. infinite loops
      if (details.url.includes('adaptive')) {
        return;
      }
      // just return if fields don't exist
      if (!(_authorization != null) || !(_csrfToken != null)) return;
      authorization = _authorization.value;
      csrfToken = _csrfToken.value;
      emitCredentials();
    };
    chrome.webRequest.onSendHeaders.addListener(
      onSendHeaders,
      { urls: ['https://api.twitter.com/*'] },
      ['requestHeaders']
    );
    return () => {
      chrome.webRequest.onSendHeaders.removeListener(onSendHeaders);
      chrome.webRequest.onBeforeSendHeaders.removeListener(chromePrep);
      emitter.end();
    };
  });
}

// export function makeAuthObs(): Observable<Credentials, any> {
//   console.log('makeAuthObs');
//   const auth$ = Kefir.stream((emitter) => {
//     let tabId;
//     let authorization;
//     let csrfToken;
//     // emitter.emit({
//     //   name: "credentials",
//     //   authorization,
//     //   csrfToken,
//     // })
//     // const webRequestOptions = ["requestHeaders", "blocking"]
//     const webRequestOptions: string[] = ['requestHeaders'];
//     if (typeof (window as any).browser === 'undefined') {
//       // For Chrome only
//       webRequestOptions.push('extraHeaders');
//     }
//     const chromePrep = (details: { requestHeaders: any }) => {
//       const requestHeaders = details.requestHeaders;
//       // This is required for our fetch requests to succeed in Chromes
//       if (
//         !requestHeaders.find(
//           (h: { name: string }) => h.name.toLowerCase() === 'origin'
//         )
//       ) {
//         requestHeaders.push({ name: 'Origin', value: 'https://twitter.com' });
//       }
//       return {
//         requestHeaders,
//       };
//     };
//     //needed for it to work on chrome
//     chrome.webRequest.onBeforeSendHeaders.addListener(
//       chromePrep,
//       { urls: ['https://api.twitter.com/*'] },
//       webRequestOptions
//     );
//     const emitCredentials = () => {
//       const _credentials = {
//         name: 'credentials',
//         authorization,
//         'x-csrf-token': csrfToken,
//       };
//       emitter.emit(_credentials);
//     };
//     const onSendHeaders = async (details: {
//       tabId: any;
//       requestHeaders: any[];
//       url: string;
//     }) => {
//       tabId = details.tabId;
//       const _authorization = details.requestHeaders.find(
//         (h: { name: string }) => h.name.toLowerCase() === 'authorization'
//       );
//       const _csrfToken = details.requestHeaders.find(
//         (h: { name: string }) => h.name.toLowerCase() === 'x-csrf-token'
//       );
//       // Don't get headers from search requests. infinite loops
//       if (details.url.includes('adaptive')) {
//         return;
//       }
//       // just return if fields don't exist
//       if (!(_authorization != null) || !(_csrfToken != null)) return;
//       authorization = _authorization.value;
//       csrfToken = _csrfToken.value;
//       emitCredentials();
//     };
//     chrome.webRequest.onSendHeaders.addListener(
//       onSendHeaders,
//       { urls: ['https://api.twitter.com/*'] },
//       ['requestHeaders']
//     );
//     return () => {
//       chrome.webRequest.onSendHeaders.removeListener(onSendHeaders);
//       chrome.webRequest.onBeforeSendHeaders.removeListener(chromePrep);
//       emitter.end();
//     };
//   });
//   console.log('made AuthObs', { auth$ });
//   auth$.log('makeAuthObs auth$');
//   return auth$;
// }
