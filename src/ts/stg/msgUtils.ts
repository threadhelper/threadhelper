import { Emitter, Observable } from 'kefir';
import { curry, defaultTo, path, prop, propEq } from 'ramda';
import { Msg, MsgWrapper } from '../types/msgTypes';
import { Option, StorageChange } from '../types/stgTypes';
import { defaultOptions } from './defaultStg';
import {
  SERVE,
  makeCustomEventObs,
  makeEventObs,
  isOptionSame,
} from './dutils';

/* Obs Msgs */

export const makeGotMsgObs = (): Observable<MsgWrapper, Error> => {
  const makeEmitMsg =
    (emitter: Emitter<MsgWrapper, Error>) =>
    (message, sender, sendResponse) => {
      console.log('emitting msg', { message });
      emitter.emit({ m: message, s: sender });
      sendResponse({ type: 'ok' });
    };
  return SERVE
    ? makeCustomEventObs('message', makeEmitMsg)
    : makeEventObs(chrome.runtime.onMessage, makeEmitMsg);
};
export const msgStream = curry(
  (
    msgObs: Observable<MsgWrapper, Error>,
    msgType: string
  ): Observable<Msg, Error> =>
    msgObs.map(prop('m')).filter(propEq('type', msgType))
);
export const makeMsgStream = msgStream(makeGotMsgObs());

export const makeOptionObs = curry(
  (
    optionsChange$: Observable<StorageChange, any>,
    itemName: string
  ): Observable<Option, any> =>
    optionsChange$
      .filter((x) => !isOptionSame(itemName, x))
      .map(path<any>(['newVal', itemName]))
      .map(defaultTo(prop(itemName, defaultOptions())))
);
