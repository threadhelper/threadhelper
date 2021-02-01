import { useContext, useEffect } from 'preact/hooks';
import { andThen, defaultTo, path, pipe, prop } from 'ramda';
import { StorageChangeObs } from './StorageChangeObs';
import {
  getStg,
  getStgPath,
  setStg,
  setStgPath,
  stgPathObs,
} from '../utils/dutils';
import { nullFn } from '../utils/putils';
import { _useStream } from './useStream';

const SERVE = process.env.DEV_MODE == 'serve';

export function useStorage(name, default_val) {
  // const useStgObs = useMemo(() => {
  //   console.log('recomputing stg item observer ' + name);
  //   return makeStgItemObs(name);
  // }, [name]);
  const storageChangeObs = useContext(StorageChangeObs);
  const [storageItem, setStorageItem] = _useStream(
    stgPathObs(storageChangeObs, [name]),
    default_val
  );

  const setStgItem = pipe(
    setStg(name),
    andThen(pipe(prop(name), setStorageItem))
  );
  // ATTENTION: this is commented out bc it might be needed in chrome. The observer use below needs to be the path one, not the whole stg
  useEffect(() => {
    // console.log('useStorage ' + name, { storageItem });
    // storageChangeObs.onValue(nullFn);
    //init
    getStg(name).then(pipe(defaultTo(default_val), setStorageItem));
    return () => {
      console.log('closing useStorage ' + name, {
        storageChangeObs,
        storageItem,
      });
      // storageChangeObs.offValue(nullFn);
    };
  }, []);

  // useEffect(() => {
  //   console.log(name, { storageItem });
  //   return () => {};
  // }, [storageItem]);

  return [storageItem, setStgItem];
}

export function useStgPath(_path, default_val) {
  const storageChangeObs = useContext(StorageChangeObs);
  const [storageItem, setStorageItem] = _useStream(
    stgPathObs(storageChangeObs, _path),
    default_val
  );

  const setStgItem = pipe(
    setStgPath(_path),
    andThen(pipe(path(_path), setStorageItem))
  );

  useEffect(() => {
    // storageChangeObs.onValue(nullFn);
    //init
    getStgPath(_path).then(pipe(defaultTo(default_val), setStorageItem));
    return () => {
      // storageChangeObs.offValue(nullFn);
    };
  }, []);

  return [storageItem, setStgItem];
}

export const useOption = (name) => useStgPath(['options', name, 'value'], null);
