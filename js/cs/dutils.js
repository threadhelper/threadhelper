

// Data/Storage/Comms utils
class dUtils {
    constructor() {
      // dutils.options
      this.options = {};
      this.loadOptions();
      // Holds observers for eventual destruction
    }
  
      
    
    //returns a promise that gets a value from chrome local storage 
    async getData(key) {
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
    async setData(key_vals) {
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
  
  
    async loadOptions(){
      this.getData("options").then((options)=>{this.options = options != null ? options : this.options})
      return this.options
    }
    
  
    msgBG(msg = null){
      let message = msg == null ? {type:"query", query_type: "update"} : msg
      chrome.runtime.sendMessage(message);
      console.log("messaging BG", message)
    }
  }
  