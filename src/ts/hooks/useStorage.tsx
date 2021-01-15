import { h, render, Component } from 'preact';
import { useState, useEffect, useContext, useMemo } from 'preact/hooks';
import {useStream, _useStream} from './useStream'
import {getData, setData, setStg, makeStgItemObs, getStgPath, updateStgPath, makeStgPathObs, updateOptionStg, getOptions} from '../utils/dutils'
import {inspect, nullFn} from '../utils/putils'
import {pipe, andThen, prop, path, isNil, defaultTo} from 'ramda'
import { defaultOptions, defaultStorage as _defaultStorage, devStorage } from '../utils/defaultStg';

const DEVING = process.env.DEV_MODE == 'serve'


export function useStorage(name, default_val){
  const useStgObs = useMemo(()=>makeStgItemObs(name),[name])
  const [storageItem, setStorageItem] = _useStream(useStgObs)

  const setStgItem = pipe(
    setStg(name),
    andThen(pipe(
      prop(name),
      setStorageItem
      )))
    
  useEffect(() => {
    useStgObs.onValue(nullFn)
    //init
    getData(name).then(pipe(defaultTo(DEVING ? devStorage()[name] : default_val), setStorageItem))
    return () => {useStgObs.offValue(nullFn); };
  }, []);

  useEffect(()=>{
    return ()=>{  };
  },[storageItem]);

  return [storageItem, setStgItem]
}

export function useStgPath(_path, default_val: undefined){
  const useStgObs = useMemo(()=>makeStgPathObs(_path),[_path])
  const [storageItem, setStorageItem] = _useStream(useStgObs)

  const setStgItem = pipe(
    updateStgPath(_path),
    andThen(pipe(
      path(_path),
      setStorageItem
      )))
    
  useEffect(() => {
    useStgObs.onValue(nullFn)
    //init
    getStgPath(_path).then(pipe(defaultTo(DEVING ? devStorage()[name] : default_val), setStorageItem))
    return () => {useStgObs.offValue(nullFn); };
  }, []);

  return [storageItem, setStgItem]
}

export const useOption = name => useStgPath(['options',name,'value'])
