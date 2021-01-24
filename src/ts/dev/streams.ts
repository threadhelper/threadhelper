import Kefir, { fromPromise, Observable } from 'kefir';
import { Credentials } from '../types/types';
const fetch = require('node-fetch');
var auth: any = {
  name: 'credentials',
  authorization:
    'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
  'x-csrf-token':
    'fda07f217684f8b73392e0ab10c74c145822bc60b3d494f14093f035aa044fdcbea255ec7f3f9322599c1019ae737048e1c2ba65c9e5f2b3cefe4456c38dc1432bb64f2e27af58b5a2f4ad0c7fe84b6e',
};
var verCreds: string = `https://api.twitter.com/1.1/account/verify_credentials.json`;
const makeInit = (auth: Credentials): RequestInit => {
  return {
    credentials: 'include',
    headers: {
      authorization: auth.authorization,
      'x-csrf-token': auth['x-csrf-token'],
    },
  };
};
const promiseStream = <T, S>(
  promise_fn: (arg0: T) => Promise<S>,
  stream: Observable<T, any>
): Observable<S, any> => {
  return stream.flatMapLatest((x) => Kefir.fromPromise(promise_fn(x)));
};
fetch(makeInit(auth), verCreds)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((x) => console.log(x));

const handleError = (error) => {
  switch (error.status) {
    case 88:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      break; //
    case 401:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      break; // Unauthorized client, lacks valid auth for target resource. Re-auth might make a difference
    case 403:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      break; // Forbidden, server understood but refuses to authorize. re-auth will make no difference.
    case 429:
      console.error(`[ERROR] thFetch ${error.status}, Too Many Requests`, {
        error,
      });
      throw error; // Too many requests.
    default:
      console.error(`[ERROR] thFetch ${error.status}, ${error.statusText}`, {
        error,
      });
      throw error;
  }
};

const handleAuthError = (e) => {};

export const obsRetry = () => Kefir.repeat((i) => {});
export const retryReq = (n_retries, delay, fn, stream) =>
  Kefir.repeat((i) => {
    if (i < n_retries - 1) {
      return promiseStream(fn, stream).skipErrors();
    } else if (i == n_retries) {
      return promiseStream(fn, stream);
    } else {
      return false;
    }
  }).take(1);

var ajaxResult = Kefir.repeat(function (i) {
  if (i < 2) {
    // on first two tries ignore errors
    return ajaxCall().skipErrors();
  } else if (i === 2) {
    // on the third try let the error (if there will be a error) show up in `ajaxResult`
    return ajaxCall();
  } else {
    // on the fourth iteration just return `false` to stop the cycle
    return false;
  }
}).take(1);

fetch('https://github.com/')
  .then((res) => res.text())
  .then((body) => console.log(body));
