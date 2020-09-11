import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import {getData, setData, initOption, updateOption, getOptions} from '../utils/dutils.jsx'
import {pipe, andThen, prop} from 'ramda'


export function useOption(name){
  const [getOption, setOption] = useState(true);
  
  getOptions().then(pipe(prop(name), setOption))
  
  const setOptionBG = pipe(
    updateOption(name),
    andThen(pipe(
      prop(name),
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