import { h, render, Component } from 'preact';
import { useState, useEffect, useContext, useMemo } from 'preact/hooks';
import {useStream, _useStream} from './useStream.jsx'
import {getData, setData, setStg, makeStgItemObs, getStgPath, updateStgPath, makeStgPathObs, updateOptionStg, getOptions} from '../utils/dutils.jsx'
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
    return () => {useStgObs.offValue(nullFn); };
  }, []);

  useEffect(()=>{
    // console.log({storageItem})
    return ()=>{  };
  },[storageItem]);

  return [storageItem, setStgItem]
}

// export function _useStorage(name, default_val){
//   const useStgObs = useMemo(()=>makeStgItemObs(name),[name])
//   const storageItem = useStream(useStgObs)
//   const setStgItem = setStg(name)

  
//   useEffect(() => {
//     useStgObs.onValue(nullFn) // THIS IS CRUCIAL bc streams don't do things if they aren't active
//     // initialization
//     getData(name).then(pipe(
//       ifElse(
//         isNil,
//         ()=>setStgItem(default_val),
//         pipe(setStgItem)
//         ),
//       ))

//     return () => {useStgObs.offValue(nullFn)};
//   }, []);

  
  
//   // const setStorageBG = pipe(
//   //   updateStg(name),
//   //   andThen(pipe(
//   //     path([name, 'value']),
//   //     setStorage))
//   //     )

//   return [storageItem, setStgItem]
// }

// useStgPath :: [String]
export function useStgPath(_path, default_val){
  const useStgObs = useMemo(()=>makeStgPathObs(_path),[_path])
  const [storageItem, setStorageItem] = _useStream(useStgObs)

  const setStgItem = pipe(
    // inspect(`setting ${name}`),
    updateStgPath(_path),
    andThen(pipe(
      path(_path),
      // inspect(`set ${name}`),
      setStorageItem
      )))
    
  useEffect(() => {
    useStgObs.onValue(nullFn)
    //init
    getStgPath(_path).then(pipe(defaultTo(default_val), setStorageItem))
    return () => {useStgObs.offValue(nullFn); };
  }, []);

  return [storageItem, setStgItem]
}

export const useOption = name => useStgPath(['options',name,'value'])

// export function useOption(name){
//   const useStgObs = useMemo(()=>makeStgPathObs(['options',name,'value']),[name])
//   // const [option, setOption] = useState(true);
//   const [option, setOption] = _useStream(useStgObs)

//   const setOptionBG = pipe(
//     updateOptionStg(name),
//     andThen(pipe(
//       path([name, 'value']),
//       inspect(`set ${name}`),
//       setOption
//       )))
 
//   useEffect(() => {
//     useStgObs.onValue(nullFn)
//     //init
//     getOptions().then(pipe(path([name, 'value']), setOption))
//     return () => {useStgObs.offValue(nullFn)};
//   }, []);

//   return [option, setOptionBG]
// }
