import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import {getData, setData, initOption, updateOptionStg, getOptions} from '../utils/dutils.jsx'
import {pipe, andThen, prop, path} from 'ramda'


export function useOption(name){
  const [option, setOption] = useState(true);
  
    
  useEffect(() => {
    //init
    getOptions().then(pipe(path([name, 'value']), setOption))
    return () => {};
  }, []);
  
  
  const setOptionBG = pipe(
    updateOptionStg(name),
    andThen(pipe(
      path([name, 'value']),
      setOption))
      )

  return [option, setOptionBG]
}