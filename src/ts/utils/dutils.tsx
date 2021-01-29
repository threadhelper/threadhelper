import Kefir, { Emitter, Observable, Stream } from 'kefir';
import {
  curry,
  defaultTo,
  head,
  is,
  isNil,
  lensPath,
  mergeDeepLeft,
  path,
  pipe,
  prop,
  propEq,
  set,
  slice,
  tail,
  tap,
  when,
  __,
} from 'ramda'; // Function
import chromeMock from 'sinon-chrome/extensions';
import { Msg, MsgWrapper } from '../types/msgTypes';
import {
  Option,
  Options,
  StorageChange,
  StorageInterface,
} from '../types/stgTypes';
import {
  defaultOptions,
  defaultStorage as _defaultStorage,
  devStorage,
} from './defaultStg';
import { currentValue, inspect } from './putils';
(Kefir.Property.prototype as any).currentValue = currentValue;

let defaultStorage: () => StorageInterface = _defaultStorage;

/* Development experience */

const DEVING = process.env.DEV_MODE == 'serve';
if (!DEVING) {
  console.log('not DEVING');
  // defaultStorage = _defaultStorage
} else {
  global.chrome = chromeMock;
  defaultStorage = devStorage;
  const makeStub = (x) => {
    chrome.storage.local.get.withArgs([x[0]]).yields(x[1]);
    chrome.storage.local.get.withArgs(x[0]).yields(x[1]);
  };
  Object.entries(devStorage()).forEach(makeStub);

  console.log('dutils', {
    DEVING,
    chrome: global.chrome,
    defaultStorage: defaultStorage(),
  });
  setData(defaultStorage());
}

/* Storage API */

//returns a promise that gets a value from chrome local storage
export async function getData(key: string | null): Promise<any> {
  return new Promise(function (resolve, reject) {
    // chrome.storage.local.get([key], function (items: {[x: string]: unknown;}) {
    chrome.storage.local.get(key, function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(DEVING ? result : result[key]);
        // resolve(result);
      }
    });
  });
}
export async function setData(key_vals: Object): Promise<any> {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(key_vals, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        console.log('setData', { ...key_vals, time: Date.now() });
        resolve(key_vals);
      }
    });
  });
}
export async function removeData(keys: string[]): Promise<any> {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.remove(keys, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(true);
      }
    });
  });
}

export const updateStorage = () => {
  setData(defaultStorage());
};

export const resetStorage = () => setData(defaultStorage());
export const resetStorageField = (key) =>
  setData({ [key]: defaultStorage()[key] });

export const getStg = (key: string) =>
  getData(key).then(pipe(defaultTo(defaultStorage()[key]), addNewDefault(key)));
export const setStg = curry((key, val) => setData({ [key]: val }));

export const getStgPath = curry((_path: string) =>
  getStg(head(_path)).then(path(tail(_path)))
);
export const setStgPath = curry(async (_path: string, val) =>
  getStg(head(_path)).then(
    pipe(
      set(lensPath(tail(_path)), val),
      tap(setStg(head(_path))),
      inspect(`updatedStgPath ${_path}`)
    )
  )
);

/* Options API */

export const getOptions = async (): Promise<Options> =>
  getData('options').then(
    pipe(defaultTo(defaultOptions()), addNewDefaultOptions)
  );

export const getOption = async (name: string): Promise<Option> =>
  getOptions().then(prop(name));

export const setOption = (name: string) =>
  setStgPath(['options', name, 'value']);
export const applyToOptionStg = curry(
  async (name: string | number, fn: (x: unknown) => any) => {
    return getOptions().then(pipe(path([name, 'value']), fn, setOption(name)));
  }
);

/* msg API */

export function msgBG(msg: Msg) {
  chrome.runtime.sendMessage(msg);
  console.log('messaging BG', { ...msg, time: Date.now() });
}
export function msgCS(tabId: number, msg: Msg) {
  chrome.tabs.sendMessage(tabId, msg);
}

/* Helper functions */

const addNewDefault = curry((key: string | number, oldItem) =>
  pipe(when(is(Object), mergeDeepLeft(__, defaultStorage()[key])))(oldItem)
);

const addNewDefaultOptions = (oldOptions) =>
  mergeDeepLeft(oldOptions, defaultOptions());

// makes an onStorageChange function given an act function that's usually a switch over item keys that have changed
export function makeOnStorageChanged(act: (stgCh: StorageChange) => any) {
  return (changes: { [x: string]: { newValue: {} } }, area: string) => {
    if (!['local', 'sync'].includes(area)) return null;
    let oldVal = {};
    let newVal = {};
    let changedItems = Object.keys(changes);
    for (let itemName of changedItems) {
      oldVal = (changes[itemName] as any).oldValue;
      newVal = changes[itemName].newValue;
      if (oldVal == newVal) break;
      act({ itemName, oldVal, newVal });
    }
  };
}

const isStgItemSame = (x: StorageChange) =>
  (isNil(x.oldVal) && isNil(x.newVal)) || x.oldVal === x.newVal;

const isOptionSame = curry(
  (name: string, x: StorageChange): boolean =>
    isStgItemSame(x) ||
    (!isNil(x.oldVal) &&
      !isNil(x.newVal) &&
      path(['oldVal', name, 'value'], x) === path(['newVal', name, 'value'], x))
);

/* Observers */

const makeEventObs = curry(
  (
    event: chrome.events.Event<any>,
    makeEmit,
    initVal: any
  ): Stream<any, Error> => {
    return Kefir.stream((emitter) => {
      // emitter.emit(initVal);
      const emit = makeEmit(emitter);
      event.addListener(emit);
      return () => {
        event.removeListener(emit);
        emitter.end();
      };
    });
  }
);
export const makeStorageChangeObs = (): Observable<StorageChange, Error> => {
  const makeEmitStgCH = (emitter: Emitter<StorageChange, Error>) =>
    makeOnStorageChanged((stgCh: StorageChange): any => emitter.emit(stgCh));
  return makeEventObs(chrome.storage.onChanged, makeEmitStgCH, {
    itemName: null,
    oldVal: null,
    newVal: null,
  });
};
export const makeStgPathObs = (_path: string[]): Observable<any, Error> =>
  makeStorageChangeObs()
    .filter(propEq('itemName', _path[0]))
    .map(path(['newVal', ...slice(1, Infinity, _path)]))
    .toProperty();
export const makeStgItemObs = (itemName) => makeStgPathObs([itemName]);
export const makeGotMsgObs = (): Observable<MsgWrapper, Error> => {
  const makeEmitMsg = (emitter: Emitter<MsgWrapper, Error>) => (
    message,
    sender
  ) => emitter.emit({ m: message, s: sender });
  return makeEventObs(chrome.runtime.onMessage, makeEmitMsg, {
    m: { type: null },
    s: null,
  });
};
export const makeMsgStream = (msgType): Observable<Msg, Error> =>
  makeGotMsgObs().map(prop('m')).filter(propEq('type', msgType));

export const makeOptionObs = curry(
  (
    optionsChange$: Observable<StorageChange, any>,
    itemName: string
  ): Observable<Option, any> =>
    optionsChange$
      .filter((x) => !isOptionSame(itemName, x))
      .map(
        path<any>(['newVal', itemName])
      )
      .map(defaultTo(prop(itemName, defaultOptions())))
);
