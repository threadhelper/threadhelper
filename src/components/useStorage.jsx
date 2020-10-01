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
  // const useStgObs = useMemo(()=>{const stgObs = makeStgItemObs(name); return makeStgItemObs(name)},[name])
  // const stgObs = useStgObs
  // const [storageStream, _] = useState(stgObs)
  const storageItem = useStream(useStgObs)

  const setStgItem = setStg(name)
  // const setStgItem = pipe(
  //   setStg(name), 
  //   andThen(pipe(
  //     // inspect(`set ${name}`), 
  //     _=>getData(name), 
  //     andThen(
  //       // inspect(`got ${name}`)
  //       ))))
  
  useEffect(() => {
    useStgObs.log({name}) // no idea why but THIS IS CRUCIAL for the hook to work
    // initialization
    getData(name).then(pipe(
      inspect(`got ${name} from stg`),
      ifElse(
        isNil,
        ()=>setStgItem(default_val),
        pipe(setStgItem, andThen(inspect('set after getting ')))
        ),
      ))

    return () => {useStgObs.offLog({useStgObs})};
  }, []);

  
  
  // const setStorageBG = pipe(
  //   updateStg(name),
  //   andThen(pipe(
  //     path([name, 'value']),
  //     setStorage))
  //     )

  return [storageItem, setStgItem]
}
