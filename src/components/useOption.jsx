import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import {getData, setData, initOption, updateOptionStg, getOptions} from '../utils/dutils.jsx'
import {pipe, andThen, prop, path} from 'ramda'


export function useOption(name){
  const [getOption, setOption] = useState(true);
  
  getOptions().then(pipe(path([name, 'value']), setOption))
  
  const setOptionBG = pipe(
    updateOptionStg(name),
    andThen(pipe(
      path([name, 'value']),
      setOption))
      )

  // const setOptionBG = (new_val)=>{
  //   getData("options").then((options)=>{
  //     options = options != null ? options : {}
  //     options[name] = new_val; 
  //     setData({options:options}).then(()=>{
  //       setOption(new_val)
  //       console.log("updated get retweets to",new_val)
  //     })
  //   })
  // }
  return [getOption, setOptionBG]
}