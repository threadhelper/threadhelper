import { useContext, useEffect, useMemo } from 'preact/hooks';
import { andThen, defaultTo, path, pipe, prop } from 'ramda';
import { MsgObs, StorageChangeObs } from './BrowserEventObs';
import {
  getStg,
  getStgPath,
  msgStream,
  setStg,
  setStgPath,
  stgPathObs,
} from '../utils/dutils';
import { nullFn } from '../utils/putils';
import { _useStream } from './useStream';

const SERVE = process.env.DEV_MODE == 'serve';
var count = 0;
var renderCount = 0;

export function useMsg(name) {
  const msgObs = useContext(MsgObs);
  const msg$ = useMemo(() => msgStream(msgObs, name), [name]);
  const [msg, setMsg] = _useStream(msg$);
  renderCount += 1;

  // ATTENTION: this is commented out bc it might be needed in chrome. The observer use below needs to be the path one, not the whole stg
  useEffect(() => {
    msg$.log(name);
    return () => {};
  }, []);

  useEffect(() => {
    return () => {};
  }, [msg]);

  return msg;
}