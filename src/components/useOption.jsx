import { h, render, Component } from 'preact';
import { useState, useEffect, useMemo, useContext } from 'preact/hooks';
import {useStream,_useStream} from './useStream.jsx'
import {getData, setData, makeStgPathObs, updateOptionStg, getOptions} from '../utils/dutils.jsx'
import {inspect} from '../utils/putils.jsx'
import {pipe, andThen, prop, path} from 'ramda'
// 

export function useOption(name){
  const useStgObs = useMemo(()=>makeStgPathObs(['options',name,'value']),[name])
  // const [option, setOption] = useState(true);
  const [option, setOption] = _useStream(useStgObs)

  const setOptionBG = pipe(
    updateOptionStg(name),
    andThen(pipe(
      path([name, 'value']),
      inspect(`set ${name}`),
      setOption
      )))

  
    
  useEffect(() => {
    useStgObs.log({name})
    //init
    getOptions().then(pipe(path([name, 'value']), setOption))
    return () => {};
  }, []);

  return [option, setOptionBG]
}

// export function _useOption(name){
//   const [option, setOption] = useState(true);
  
    
//   useEffect(() => {
//     //init
//     getOptions().then(pipe(path([name, 'value']), setOption))
//     return () => {};
//   }, []);
  
  
//   const setOptionBG = pipe(
//     updateOptionStg(name),
//     andThen(pipe(
//       path([name, 'value']),
//       setOption))
//       )

//   return [option, setOptionBG]
// }