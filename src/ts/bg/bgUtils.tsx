import Kefir, { Observable } from 'kefir'
import { assoc, curry, defaultTo, filter, ifElse, isNil, map, not, path, pipe, prop, reduce } from 'ramda' // Function
import { Status } from 'twitter-d'
import { apiToTweet, validateTweet } from './tweetImporter'
import { Option, SearchFilters, StorageChange } from '../types/stgTypes'
import { thTweet } from '../types/tweetTypes'
import { Credentials } from '../types/types'
import 'chrome-extension-async';
import * as R from 'ramda';
import {
  andThen,
  either,
  head,
  isEmpty,
  keys,
  propEq,
  values,
} from 'ramda'; // Function

import {
  n_tweets_results,
  update_size,
  queue_load,
  timeline_scrape_interval,
} from '../utils/params';
import {
  currentValue,
  errorFilter,
  inspect,
  isExist,
  nullFn,
  promiseStream,
  toggleDebug,
} from '../utils/putils';
import { dbFilter, dbOpen } from './idb_wrapper';
import { getLatestTweets, getRandomSampleTweets } from './search';
import {
  cleanOldStorage,
  dequeue4WorkStg,
  dequeueWorkQueueStg,
  enqueueStg,
  enqueueStgNoDups,
  enqueueTweetStg,
  enqueueUserStg,
  getData,
  getOption,
  getStg,
  getStgPath,
  makeStorageChangeObs as makeStorageChangeObs,
  modStg,
  msgCS,
  setStg,
  setStgFlag,
  setStgPath,
  softUpdateStorage,
  stgPathObs,
  makeOptionObs,
} from '../stg/dutils';

export const getDateFormatted = () => (new Date()).toLocaleString()
export const twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
export const apiBookmarkToTweet = pipe(apiToTweet, assoc('is_bookmark', true))

export const extractTweetPropIfNeeded = ifElse(
  prop('tweet'),
  prop('tweet'),
  (x) => x
);

export const saferTweetMap = curry((fn: (x:Status) => thTweet, tweets):thTweet[] => pipe(
  (()=>tweets),
  defaultTo([]), 
  filter(pipe(isNil, not)), 
  filter(validateTweet), 
  map(fn),
  )())

  // auth
export const makeInit = (auth: Credentials) : RequestInit => {
    return {
      credentials: "include",
      headers: {
        authorization: auth.authorization,
        "x-csrf-token": auth['x-csrf-token']
      }
    };
  }
export const compareAuths = (a: Credentials, b: Credentials)=>{return a.authorization == b.authorization && a["x-csrf-token"] == b.["x-csrf-token"]}
export const validateAuth = (x: Credentials)=>(prop('authorization', x) != null && prop("x-csrf-token", x) != null)

  //chrome storage
export const isOptionSame = curry ((name: string | number, x: { oldVal: any; newVal: any })=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )
// makeOptionsObs :: String -> a
export const _makeOptionObs = curry (async (optionsChange$: Observable<StorageChange, any>, itemName: string): Promise<Observable<Option, any>>  => {
  const initVal = await getOption(itemName)
  return makeOptionObs(optionsChange$,itemName).toProperty(()=>initVal)
})
export const makeInitOptionsObs = curry((optionsChange$, itemName) => {
  return Kefir.fromPromise(_makeOptionObs(optionsChange$, itemName)).flatMap((x) => x).map(prop('value'))
})
// makeStgObs :: String -> a
export const _makeStgObs = curry (async (storageChange$, itemName) => {
  const initVal = await getStg(itemName)
  return stgPathObs(storageChange$, [itemName]).toProperty(()=>initVal)
  // return makeStgItemObs(itemName).toProperty(()=>initVal)
})
export const makeInitStgObs = (storageChange$, itemName) => {
  return Kefir.fromPromise(_makeStgObs(storageChange$, itemName)).flatMap((x) => x)
}

export const combineOptions = (...args: Option[]): SearchFilters => pipe(reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)


// Scrape worker can't make requests for some people (TODO: find cause)
// tries one function with the arguments and if it doesn't work tries the other one
export const tryFnsAsync = async (fn1, fn2, ...args) => {
  try {
    return await fn1(...args);
  } catch (e) {
    console.log(`[ERROR] ${fn1.name} failed, trying ${fn2.name}`);
    return await fn2(...args);
  }
};


// observer and queue subscriptions

// Remember subscription for deconstruction
export const _rememberSub = curry((subscriptions, sub) => {
  subscriptions.push(sub);
  return sub;
});
// Subscribe to an observer with a function and remember it for deconstruction later
export const _subObs = curry((
  subscriptions,
  obsObj: { [key: string]: Observable<any, any> },
  effect: any
) => {
  let obs = head(values(obsObj));
  let name = head(keys(obsObj)) as string;
  obs = obs.setName(name);
  _rememberSub(subscriptions, obs.observe({ value: effect }));
});

export const isQueueEmpty = async (name) => {
  const qLen = await getStg(name+"_length");
  // console.log('isWorkQueueBusy', { qLen });
  return isNil(qLen) || qLen <= 0;
};
// Is the work queue corresponding to `name` populated? (means it's busy, waiting for work to be done)
export const isWorkQueueBusy = async (name) => {
  const qLen = await getStg(name + '_work_queue_length');
  // console.log('isWorkQueueBusy', { qLen });
  return !isNil(qLen) && qLen > 0;
};

// Dequeue from `name` to `name`_work_queue
export const maybeDq = async (name) => {
  const busy = await isWorkQueueBusy(name);
  const empty = await isQueueEmpty(name)
  if (!(busy || empty)) {
    const workload = dequeue4WorkStg(name, queue_load);
    // console.log('[DEBUG] dq', { name, workload });
    return workload;
  } else {
    // console.log('[DEBUG] dq: queue busy ', { name });
    return false;
  }
  // dequeue4WorkStg(name, R.length(defaultTo([], queue)));
};

// Subscribes to a queue called `name` in chrome.storage  with a function `workFn`.
// Batches of data are taken from the queue `name` and moved to `name`_work_queue  
export const _subWorkQueueStg = curry((subscriptions, storageChange$, name, workFn) => {
  // Waiting queue
  const queueFn = async (q) => {
    const qLen = R.length(q);
    setStg(name + '_length', qLen);
    console.log('subWorkQueue ' + name, { qLen, q });
    if (qLen > 0) {
      const workload = await maybeDq(name);
      // subtract the length of the workload to the length of the whole queue
      // const newLen = qLen-R.length(workload)
      // console.log('subWorkQueue ' + name, { name, qLen, q, newLen,workload });
      // setStg(name + '_length', newLen);
    }
  };
  // const queue$ = makeInitStgObs(storageChange$, name).filter(isExist);
  const queue$ = makeInitStgObs(storageChange$, name).filter(pipe(isNil, not));
  queue$.log(name + '$');
  _subObs(subscriptions, { [name + '$']: queue$ }, queueFn);

  // Work queue (being worked on right now)
  const workQueueFn = async (queue) => {
    // keep track of the size of the queue because we check it sometimes
    setStg(name + '_work_queue' + '_length', R.length(queue));
    // If there's a queue, work it!
    if (isExist(queue)) {
      try {
        await workFn(queue);
        dequeueWorkQueueStg(name, R.length(queue));
      } catch (e) {
        console.error(
          `couldn't consume ${name + '_work_queue'} with ${workFn.name}`,
          e
        );
      }
    } else {
      //if the work queue is empty, maybe it shouldn't be! Dequeue any queued workload!
      maybeDq(name);
    }
  };
  const workQueue$ = makeInitStgObs(
    storageChange$,
    name + '_work_queue'
  ).filter(pipe(isNil, not));
  // workQueue$.log(name + '_work_queue' + '$');

  _subObs(subscriptions, { [name + '_work_queue' + '$']: workQueue$ }, workQueueFn);
});



