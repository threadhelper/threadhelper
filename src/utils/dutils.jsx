import Kefir from 'kefir';
// let options = {}

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
        resolve();
      }
    });
  });
}

export async function loadOptions(){
  this.getData("options").then((options)=>{this.options = options != null ? options : this.options})
  return this.options
}


export function msgBG(msg = null){
  let message = msg == null ? {type:"query", query_type: "update"} : msg
  chrome.runtime.sendMessage(message);
  console.log("messaging BG", message)
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


export function makeGotMsgObs(){
  return Kefir.stream(emitter => {
  var count = 0;
  emitter.emit(count);

  const emitMsg = m => emitter.emit(m)
  chrome.runtime.onMessage.addListener(emitMsg)

  return () => {
    chrome.runtime.onMessage.removeListener(emitMsg)
    emitter.end()
  }

  });
}
