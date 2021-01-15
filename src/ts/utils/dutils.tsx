import Kefir, { Emitter, Observable, Stream } from 'kefir';
import {StorageChange} from '../types/stgTypes'
import {MsgWrapper, Msg, UrlMsg} from '../types/msgTypes'
import { flattenModule, currentValue, inspect } from './putils';
import { defaultOptions, defaultStorage as _defaultStorage, devStorage } from './defaultStg';
import * as R from 'ramda';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math
import { Option, Options } from '../types/stgTypes';
(Kefir.Property.prototype as any).currentValue = currentValue;
import chromeMock from 'chrome-api-mock';


const DEVING = process.env.DEV_MODE == 'serve'
global.chrome = DEVING ? chromeMock.getChromeInstance() : global.chrome
const defaultStorage = DEVING ? devStorage : _defaultStorage
console.log('dutils defaultStorage', {DEVING, defaultStorage, chrome: global.chrome, chromeMock, mock: chromeMock.getChromeInstance() })

//returns a promise that gets a value from chrome local storage 
export async function getData(key: string) {
    return new Promise(function (resolve, reject) {
        // chrome.storage.local.get(key, function (items: {
        chrome.storage.sync.get([key], function (items: {[x: string]: unknown;}) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            }
            else {
                console.log('stg got', {key,})
                resolve(items[key]);
            }
        });
    });
}
//returns a promise that sets an object with key value pairs into chrome local storage 
export async function setData(key_vals) {
    return new Promise(function (resolve, reject) {
        // chrome.storage.local.set(key_vals, () => {
        chrome.storage.sync.set(key_vals, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            }
            else {
                console.log('[DEBUG] setData', { ...key_vals });
                resolve(key_vals);
            }
        });
    });
}
// Delete data from storage
// takes an array of keys
export async function removeData(keys) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.remove(keys, function () {
        // chrome.storage.local.remove(keys, function () {
            //console.log("removed", keys)
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            }
            else {
                // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
                resolve();
            }
        });
    });
}
export const resetStorage = () => setData(defaultStorage());
export const setStg = curry((key, val) => setData({ [key]: val }));
export const getStg = (key: string) => getData(key).then(pipe(defaultTo(defaultStorage()[key]), addNewDefault(key)));
export const updateStg = curry((key, val) => setData({ [key]: val }));
// TODO: need to reliably return the default if path doesn't exist, see addNewDefaultOptions
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
export const getStgPath = curry((_path: string) => getStg(head(_path)).then(path(tail(_path))));
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Placeholder | __MergeDeep<Placeh... Remove this comment to see the full error message
const addNewDefault = curry((key: string | number, oldItem) => pipe(when(is(Object), mergeDeepLeft(__, defaultStorage()[key])))(oldItem));
const addNewDefaultOptions = oldOptions => mergeDeepLeft(oldOptions, defaultOptions());
export const getOptions = async (): Promise<Options> => getData('options').then(pipe(defaultTo(defaultOptions()), addNewDefaultOptions));
export const getOption = async (name: string): Promise<Option> => getOptions().then(prop(name));
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
export const updateStgPath = curry(async (_path: string, val) => getStg(head(_path)).then(pipe(set(lensPath(tail(_path)), val), tap(setStg(head(_path))), inspect(`updatedStgPath ${_path}`))));
// TODO: this after the abovo TODO
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string[]' is not assignable to p... Remove this comment to see the full error message
export const updateOptionStg = (name: string) => updateStgPath(['options', name, 'value']);
// export const updateOptionStg = curry(async (name, val)=> getOptions().then(pipe(
//       set(lensPath([name,'value']),val),
//       tap(setStg('options')),
//     )))
export const applyToOptionStg = curry(async (name: string | number, fn: (x: unknown) => any) => {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number' is not assignab... Remove this comment to see the full error message
    return getOptions().then(pipe(path([name, 'value']), fn, updateOptionStg(name)));
});
export function msgBG(msg: Msg) {
    chrome.runtime.sendMessage(msg);
    console.log("messaging BG", msg);
}
export function msgCS(tabId: number, msg: Msg) {
    chrome.tabs.sendMessage(tabId, msg);
}
// makes an onStorageChange function given an act function that's usually a switch over item keys that have changed
export function makeOnStorageChanged( act: (stgCh:StorageChange) => any){

    return (changes: {[x: string]: {newValue: {};};}, area: string) => {
        if (!['local', 'sync'].includes(area))
            return null;
        let oldVal = {};
        let newVal = {};
        let changedItems = Object.keys(changes);
        for (let itemName of changedItems) {
            oldVal = (changes[itemName] as any).oldValue;
            newVal = changes[itemName].newValue;
            if (oldVal == newVal)
                break;
            act({itemName, oldVal, newVal});
        }
    };
}
// const makeEventObs = curry((event: {addListener: (arg0: any) => void; removeListener: (arg0: any) => void;}, makeEmit, initVal) => {
const makeEventObs = curry((event: chrome.events.Event<any>, makeEmit, initVal: any): Stream<any,Error> => {
    return Kefir.stream(emitter => {
        // emitter.emit(initVal);
        const emit = makeEmit(emitter);
        event.addListener(emit);
        return () => {
            event.removeListener(emit);
            emitter.end();
        };
    });
});
export const makeStorageChangeObs = ():Observable<StorageChange, Error> => {
    const makeEmitStgCH = (emitter: Emitter<StorageChange, Error>
    ) => makeOnStorageChanged((stgCh: StorageChange): any => emitter.emit(stgCh));
    return makeEventObs(chrome.storage.onChanged, makeEmitStgCH, { itemName: null, oldVal: null, newVal: null });
};
// shallow
const isStgItemSame = (x: StorageChange) => (isNil(x.oldVal) && isNil(x.newVal)) || x.oldVal === x.newVal;
export const makeStgPathObs = (_path: string[]): Observable<any, Error> => makeStorageChangeObs()
    .filter(propEq('itemName', _path[0]))
    .map(path(['newVal', ...slice(1, Infinity, _path)]))
    .toProperty();
// export const makeStgItemObs = itemName => {console.log('making stg item obs for ', itemName); return makeStorageObs().filter(propEq('itemName',itemName)).filter(pipe(isStgItemSame, not)).map(prop('newVal')).skipDuplicates()}
export const makeStgItemObs = itemName => makeStgPathObs([itemName]);
// export const makeStgItemObs = itemName => {
//   console.log('making stg item obs for ', itemName); 
//   return makeStorageObs()
//   .filter(propEq('itemName',itemName))
//   .map(prop('newVal')).toProperty()}
// export const makeStorageStream = (type) => makeStoragegObs().filter(propEq('type',type))
export const makeGotMsgObs = (): Observable<MsgWrapper,Error> => {
    const makeEmitMsg = (emitter: Emitter<MsgWrapper, Error>) => (message, sender) => emitter.emit({ m: message, s: sender });
    return makeEventObs(chrome.runtime.onMessage, makeEmitMsg, { m: { type: null }, s: null });
};
export const makeMsgStream = (msgType): Observable<Msg, Error> =>  makeGotMsgObs().map(prop('m')).filter(propEq('type', msgType));
// // optionsChange$ :: change -> change
// export const makeOptionsChangeObs = async (storageChange$) => {
//   const cachedOptions = {oldVal:null, newVal:await getOptions()}
//   return storageChange$.filter(x=>x.itemName=='options').toProperty(()=>cachedOptions)
// }
const isOptionSame = curry((name: string, x: StorageChange): boolean => isStgItemSame(x) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'], x) === path(['newVal', name, 'value'], x))));
// const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )
// makeOptionsObs :: String -> a
export const makeOptionObs = curry((optionsChange$: Observable<StorageChange, any>, itemName: string): Observable<Option, any> => optionsChange$
    .filter(x => !isOptionSame(itemName, x))
    .map(path<any>(['newVal', itemName]))
    .map(defaultTo(prop(itemName, defaultOptions()))));
// const listSearchFilters = pipe(prop('newVal'), values, filter(propEq('type', 'searchFilter')), map(prop('name')), R.map(makeOptionObs), inspect('listsearchfilters'));
// const combineOptions = (...args) => pipe(inspect('combineopt'), reduce((a, b) => assoc(b.name, b.value, a), {}))(args);
// export const makeSearchFiltersObs = () => Kefir.combine([getRT$, useBookmarks$, useReplies$], combineOptions).toProperty();
