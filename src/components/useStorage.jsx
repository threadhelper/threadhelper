import { h, render, Component } from 'preact';
import { useState, useEffect, useContext, useMemo } from 'preact/hooks';
import {useStream, _useStream} from './useStream.jsx'
import {getData, setData, setStg, makeStgItemObs} from '../utils/dutils.jsx'
import {inspect, nullFn} from '../utils/putils.jsx'
import {pipe, andThen, prop, path, isNil, defaultTo} from 'ramda'


export function useStorage(name, default_val){
  const useStgObs = useMemo(()=>makeStgItemObs(name),[name])
  // const [option, setOption] = useState(true);
  const [storageItem, setStorageItem] = _useStream(useStgObs)

  const setStgItem = pipe(
    // inspect(`setting ${name}`),
    setStg(name),
    andThen(pipe(
      prop([name]),
      // inspect(`set ${name}`),
      setStorageItem
      )))
    
  useEffect(() => {

    useStgObs.onValue(nullFn)
    //init
    getData(name).then(pipe(defaultTo(default_val), setStorageItem))
    return () => {useStgObs.offValue(nullFn)};
  }, []);

  useEffect(()=>{
    // console.log({storageItem})
    return ()=>{  };
  },[storageItem]);

  return [storageItem, setStgItem]
}

export function _useStorage(name, default_val){
  const useStgObs = useMemo(()=>makeStgItemObs(name),[name])
  const storageItem = useStream(useStgObs)
  const setStgItem = setStg(name)

  
  useEffect(() => {
    useStgObs.onValue(nullFn) // THIS IS CRUCIAL bc streams don't do things if they aren't active
    // initialization
    getData(name).then(pipe(
      ifElse(
        isNil,
        ()=>setStgItem(default_val),
        pipe(setStgItem)
        ),
      ))

    return () => {useStgObs.offValue(nullFn)};
  }, []);

  
  
  // const setStorageBG = pipe(
  //   updateStg(name),
  //   andThen(pipe(
  //     path([name, 'value']),
  //     setStorage))
  //     )

  return [storageItem, setStgItem]
}
