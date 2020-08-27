import { h, render, Component } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import {getData, setData} from '../utils/dutils.jsx'

const initOption = (name, init_val, set) => {
  getData("options").then((options)=>{options != null ? set( options[name] ) : setData({options:{name: init_val}}) })
}

export function useOption(name, init_val = null){
  const [getOption, setOption] = useState(init_val);
  
  initOption(name, init_val, setOption)
  
  const setOptionBG = (new_val)=>{
    getData("options").then((options)=>{
      options = options != null ? options : {}
      options[name] = new_val; 
      setData({options:options}).then(()=>{
        setOption(new_val)
        console.log("updated get retweets to",new_val)
      })
    })
  }
  return [getOption, setOptionBG]
}