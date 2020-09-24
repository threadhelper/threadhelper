import Kefir from 'kefir';
import { flattenModule, inspect } from './putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)

// DEFAULT OPTIONS V IMPORTANT
export const defaultOptions = () => {return {
  name: 'options',
  getRTs: {name:'getRTs', type:'searchFilter', value:true},
  useBookmarks: {name:'useBookmarks', type:'searchFilter', value:true},
  useReplies: {name:'useReplies', type:'searchFilter', value:true},
  roboActive: {name:'roboActive', type:'featureFilter', value:false},
  hasArchive: {name:'hasArchive', type:'flag', value:false},
}}


//returns a promise that gets a value from chrome local storage 
export async function getData(key) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(key, function(items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        // console.log(items[key])
        resolve(items[key]);
      }
    });
  });
}

//returns a promise that sets an object with key value pairs into chrome local storage 
export async function setData(key_vals) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.set(key_vals, function(items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(key_vals);
      }
    });
  });
}

// Delete data from storage
// takes an array of keys
export async function removeData(keys){
  return new Promise(function(resolve, reject) {
    chrome.storage.local.remove(keys,function(){
      //console.log("removed", keys)
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    }); 
  });
}

export const setStg = curry( (key,val) => setData({[key]:val}) )

const addNewDefaultOptions = (oldOptions) => mergeLeft(oldOptions,defaultOptions())

export const getOptions = async () => getData('options').then(pipe(defaultTo(defaultOptions()), addNewDefaultOptions))

export const updateOptionStg = curry(async (name, val)=>
  {
  return getOptions().then(pipe(
      set(lensPath([name,'value']),val),
      tap(setStg('options')),
    ))
  })


export function msgBG(msg = null){
  let message = isNil(msg) ? {type:"query", query_type: "update"} : msg
  chrome.runtime.sendMessage(message);
  console.log("messaging BG", message)
}

export async function requestRoboTweet(query, reply_to){
  console.log('req robo tweet!', {query, reply_to})
  //TODO port reply_to thing
  // inefficient, if they're in storage, I could just get them in bg
  let msg = {
    type:"robo-tweet", 
    query: query != null ? query : '', 
    reply_to: reply_to != null ? reply_to : ''
  }
  msgBG(msg)
  // console.log(`clicked robo sync`, msg)
}





// makes an onStorageChange function given an act function that's usually a switch over item keys that have changed
export function makeOnStorageChanged(act){
  return (changes, area)=>{
    if (area != 'local') return null 
    let oldVal = {}
    let newVal = {}
    let changedItems = Object.keys(changes)
    for(let item of changedItems){
      oldVal = changes[item].oldValue
      newVal = changes[item].newValue
      if (oldVal == newVal) break;
      act(item, oldVal, newVal)
    }
  }
}




const makeEventObs = curry ((event, makeEmit, initVal) => {
  return Kefir.stream(emitter => {
    emitter.emit(initVal);

    const emit = makeEmit(emitter)
    event.addListener(emit)

    return () => {
      event.removeListener(emit)
      emitter.end()
    }

  });
})


export const makeStoragegObs = () => {
  const makeEmitStgCH = (emitter) =>  makeOnStorageChanged((itemName, oldVal, newVal) => emitter.emit({itemName, oldVal, newVal}))
  return makeEventObs(chrome.storage.onChanged, makeEmitStgCH, {itemName:null, oldVal:null, newVal:null}) 
}


export const makeStorageStream = (type) => makeStoragegObs().filter(propEq('type',type))



export const makeGotMsgObs = () =>{ 
  const makeEmitMsg = (emitter) =>  (message,sender) => emitter.emit({m:message,s:sender})
  return makeEventObs(chrome.runtime.onMessage, makeEmitMsg, {m:{type:null},s:null}) 
}

export const makeMsgStream = (type) => makeGotMsgObs().map(prop('m')).filter(propEq('type',type))

// optionsChange$ :: change -> change
export const makeOptionsChangeObs = async (storageChange$) => {
  const cachedOptions = {oldVal:null, newVal:await getOptions()}
  return storageChange$.filter(x=>x.itemName=='options').toProperty(()=>cachedOptions)
}

// const isOptionSame = x=>(isNil(x.oldVal) && isNil(x.newVal)) || (x.oldVal[itemName] == x.newVal[itemName])
const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )


// makeOptionsObs :: String -> a
export const makeOptionObs = curry ((optionsChange$, itemName) => 
  optionsChange$.filter(x=>!isOptionSame(itemName,x))
  .map(path([['newVal'], itemName]))
  .map(pipe(
    defaultTo(prop(itemName,defaultOptions()))))
  .map(inspect(`make option obs for ${itemName}`))/*.toProperty()*/)

const listSearchFilters = pipe(prop('newVal'), values, filter(propEq('type', 'searchFilter')), map(prop('name')), R.map(makeOptionObs),inspect('listsearchfilters'))
const combineOptions = (...args) => pipe(inspect('combineopt'), reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)


export const makeSearchFiltersObs = ()=>Kefir.combine([getRT$, useBookmarks$, useReplies$], combineOptions).toProperty()

// const searchFilters$ = Kefir.combine(
  // const filters = listSearchFilters(optionsChange$.currentValue())
//   filters,
//   combineOptions
//   ).toProperty()


// export function makeGotMsgObs(){

//   return Kefir.stream(emitter => {
//     emitter.emit({m:{type:null},s:null});

//     const emitMsg = (message,sender) => emitter.emit({m:message,s:sender})
//     chrome.runtime.onMessage.addListener(emitMsg)

//     return () => {
//       chrome.runtime.onMessage.removeListener(emitMsg)
//       emitter.end()
//     }

//   });
// }


