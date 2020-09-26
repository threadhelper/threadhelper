import { h, render, Component } from 'preact';
import { useState, useEffect, useContext, useMemo } from 'preact/hooks';
import {useStream} from './useStream.jsx'
import {getData, setData, setStg, makeStgItemObs} from '../utils/dutils.jsx'
import {inspect} from '../utils/putils.jsx'
import {pipe, andThen, prop, path, isNil} from 'ramda'



export function useStorage(name, default_val){
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
