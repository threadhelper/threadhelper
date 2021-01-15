import { h, render, Component } from 'preact';
import { useState, useEffect, useMemo, useContext } from 'preact/hooks';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import {useStream,_useStream} from '../components/useStream.tsx'
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import {getData, setData, makeStgPathObs, updateOptionStg, getOptions} from '../utils/dutils.tsx'
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import {inspect, nullFn} from '../utils/putils.tsx'
import {pipe, andThen, prop, path} from 'ramda'


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
    useStgObs.onValue(nullFn)
    //init
    getOptions().then(pipe(path([name, 'value']), setOption))
    return () => {useStgObs.offValue(nullFn)};
  }, []);

  return [option, setOptionBG]
}
