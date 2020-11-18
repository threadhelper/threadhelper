import {curry, isNil} from 'ramda';

//project utilities
export const flattenModule = (window,R)=>Object.entries(R).forEach(([name, exported]) => window[name] = exported);
export const delay = ms => new Promise(res => setTimeout(res, ms));
export const inspect = curry ((prepend, data)=>{console.log(prepend, data); return data;})
export const toggleDebug = (window, debug) => {
  if(!debug){
    console.log("CANCELING CONSOLE")
    if(!isNil(window)) if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "trace", "time", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
  }}
export const currentValue = function() { //doesn't really belong in putils, should be a dedicated filefor extending kefir
  var result;
  var save = function(x) {
    result = x;
  };
  this.onValue(save);
  this.offValue(save);
  return result;
};
export const isExist = x=>!(isNil(x) || isEmpty(x))
export const nullFn = ()=>{}
export const renameKeys = (keysMap) => (obj) => Object.entries(obj).reduce(
  (a, [k, v]) => k in keysMap ? {...a, [keysMap[k]]: v} : {...a, [k]: v},
  {}
)
export const timeFn = curry((text, fn)=>{return (...args)=>{console.time(`[TIME] ${text}`); const res = fn(...args); console.timeEnd(`[TIME] ${text}`); return res}})