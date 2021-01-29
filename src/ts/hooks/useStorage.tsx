import { useEffect, useMemo } from 'preact/hooks';
import { andThen, defaultTo, path, pipe, prop } from 'ramda';
import {
  getData,
  getStgPath,
  makeStgItemObs,
  makeStgPathObs,
  setStg,
  setStgPath,
} from '../utils/dutils';
import { nullFn } from '../utils/putils';
import { _useStream } from './useStream';

export function useStorage(name, default_val) {
  const useStgObs = useMemo(() => makeStgItemObs(name), [name]);
  const [storageItem, setStorageItem] = _useStream(useStgObs);

  const setStgItem = pipe(
    setStg(name),
    andThen(pipe(prop(name), setStorageItem))
  );

  useEffect(() => {
    useStgObs.onValue(nullFn);
    //init
    getData(name).then(pipe(defaultTo(default_val), setStorageItem));
    return () => {
      useStgObs.offValue(nullFn);
    };
  }, []);

  useEffect(() => {
    return () => {};
  }, [storageItem]);

  return [storageItem, setStgItem];
}

export function useStgPath(_path, default_val) {
  const useStgObs = useMemo(() => makeStgPathObs(_path), [_path]);
  const [storageItem, setStorageItem] = _useStream(useStgObs);

  const setStgItem = pipe(
    setStgPath(_path),
    andThen(pipe(path(_path), setStorageItem))
  );

  useEffect(() => {
    useStgObs.onValue(nullFn);
    //init
    getStgPath(_path).then(pipe(defaultTo(default_val), setStorageItem));
    return () => {
      useStgObs.offValue(nullFn);
    };
  }, []);

  return [storageItem, setStgItem];
}

export const useOption = (name) => useStgPath(['options', name, 'value'], null);
