
// Utilities for interacting with storage, meta data, process headers, and act on install
class Utils {
  constructor() {
    this.db = {}
    this._options = {getRetweets: true, getArchive: false}
    this._tabId = null
    this.twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  }

  async init(){
    await this.openDB()
    await this.loadOptions()
  }
  async openDB(){
    console.log("OPENING DB")
    const db = await idb.openDB('ThreadHelper', 1, {
      upgrade(db) {
        console.log("version ",db.oldVersion)
        let oldV = db.oldVersion != null ? db.oldVersion : 0
        switch (oldV) {
          case 0:
            // Create a store of objects
            const store = db.createObjectStore('tweets', {
              // The 'id' property of the object will be the key.
              keyPath: 'id',
              // If it isn't explicitly set, create a value by auto incrementing.
              // autoIncrement: true,
            });
            const misc = db.createObjectStore('misc', {
              // The 'id' property of the object will be the key.
              // keyPath: 'key',
              // If it isn't explicitly set, create a value by auto incrementing.
              // autoIncrement: true,
            });
            // Create an index on the 'date' property of the objects.
            store.createIndex('time', 'time');
            // a placeholder case so that the switch block will
            // execute when the database is first created
            // (oldVersion is 0)
            break;
          default:
            break;
          }
      },
    });
    this.db = db
    return db
  }
  
  
  get tabId(){return this._tabId}
  set tabId(tabId){
    this._tabId = tabId}
  
  get options(){return this._options}
  set options(options){
    if(this._options.getRetweets != options.getRetweets){
      console.log("option getRetweets changed", options.getRetweets)
      wiz.getLatestTweets().then((latest)=>{
        wiz.latest_tweets = latest
        utils.msgCS({type:"toggled-retweets"})
      })

    }
    this._options = Object.assign(this._options,options)
  }
  

  onTabActivated(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
      //console.log("tab", tab)
      try{
        let url = tab.url;
        if (url.match(utils.twitter_url)) {
          utils.tabId = tab.id
          utils.msgCS({type:"tab-activate", url:url, cs_id: tab.id})
        }
      }catch(e){
        console.log(e)
      }
    });
  }
  
  onTabUpdated(tabId, change, tab){
    if (tab.active && change.url) {
      if (change.url.match(utils.twitter_url)){
        utils.tabId = tab.id
        utils.msgCS({type:"tab-change-url", url:change.url, cs_id: tab.id})
      }
    }
  }    

//   async updateDB(storeName, key_vals){
//     if(storeName == "tweets" || storeName == "staged_tweets"){
//         let storeName = storeName;      
//         const tx = this.db.transaction(storeName, 'readwrite');
//         const store = tx.objectStore('tweets');
//         let value = await this.db.get(storeName, storeName);
//         value = value != null ? value : {}
//         Object.assign(value,key_vals)
//         await store.put(value);
//         await tx.done;
//       }  
//   }

  //gets data and changes its attributes that match key_vals, then sets it
  async updateData(key, key_vals){
    let objset = {}
    this.getData(key).then(val=>{
      if (val !=null){
        val = Object.assign(val,key_vals)
        objset[key] = val
      } else{
        objset[key] = key_vals
      }
      this.setData(objset)
    })
  }

  async getDB(key, storeName = 'tweets'){
    return this.db.get(storeName, key);
  }

  async deleteFromDB(key_list, storeName = 'tweets'){
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let promises = []
    try{
      for (let k of key_list) {
        promises.push(store.delete(k))
      }
      promises.push(tx.done)
      return await Promise.all(promises)        
    } catch(e){
      console.log(promises)
      throw(e)
    }
    return this.db.get(storeName, key);
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
  
  // list as input
  // used only to add tweets to the store
  async putDB(item_list, storeName = 'tweets'){
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let promises = []
    try{
      for(let item of item_list){
        promises.push(store.put(item))
      }
      promises.push(tx.done)
      return await Promise.all(promises)        
    } catch(e){
      console.log(promises)
      throw(e)
    }
  }

  //returns a promise that sets an object with key value pairs into chrome local storage 
  async setData(key_vals) {
    if(Object.keys(key_vals)[0] == "latest_tweets") console.trace("|||||||| SET DATA LATEST TWEETS")
    return new Promise(function(resolve, reject) {
      chrome.storage.local.set(key_vals, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
          // if(Object.keys(key_vals).includes('search_results'))console.log(key_vals)
        }
      });
    });
  }

  // Delete data from storage
  // takes an array of keys
  async removeData(keys){
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

      
  async clearDB(){
    let storeNames = ["tweets", "misc"]
    for (let storeName of storeNames){
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
    }
  }
  //clears storage of tweets, tweets meta info, and auth
  async clearStorage(){
    // utils.db.clear('tweets')
    this.clearDB().then(()=>{
      nlp.init()
    })
    this.removeData(["tweets_meta","latest_tweets","search_results","has_timeline","has_archive","sync"]).then(()=>{
        // wiz.tweet_ids = []
        // wiz.users = {}
        // wiz.has_timeline = false
        // wiz.has_archive = false
        // wiz.tweets_meta = wiz.makeTweetsMeta(null)
        wiz.init()
        this.msgCS({type: "storage-clear"}) 
      }
    )
    return true
  }

  // gets all twitter tabs
  getTwitterTabIds(){
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({url: "*://twitter.com/*", currentWindow: true}, function(tabs){
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          //console.log("twitter tabs",tabs)
          let tids = tabs.map(tab=>{return tab.id})
          resolve(tids);
        }
      });  
    });
  }

  // Gets the ID of the current tab
  getActiveTabId(){
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          //console.log(tabs)
          resolve(tabs[0].id);
        }
      });  
    });
  }

  // Loads options from storage
  async loadOptions(){
    this.getData("options").then(opts=>{
      this.options = opts != null ? opts : this.options
    })
  }


  // Message content script  
  async msgCS(m){
    //let tabId = await utils.getTabId()
    try{
    chrome.tabs.sendMessage(this.tabId, m)
    // console.log("sending message to cs tab ", m)
    } catch(e){
    //console.log(e)
    }
  }

  // called every time headers are sent, if they contain the auth, take it and update our auth
  async processHeaders(headers){
    let csrfToken = null
    let authorization = null
    for (let header of headers) {
      if (header.name.toLowerCase() == "x-csrf-token") {
        csrfToken = header.value;
      } else if (header.name.toLowerCase() == "authorization") {
        authorization = header.value;
      }
    }
    if (csrfToken && authorization && csrfToken != "null" && authorization != "null"){
      // console.log(headers)
      auth.updateAuth(csrfToken,authorization)
    }
    else{
      //console.log("header does not have auth")
    }
  }

  onInstalled() {
    console.log("On Installed!")
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { urlContains: "twitter.com" }
            })
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]);
    });
    //
    utils.getTwitterTabIds().then(tids=>{
      console.log("reloading twitter tabs", tids)
      for (let tid of tids){
        chrome.tabs.reload(tid);
      }
    })
  }

    
  // to format YYYY-MM-DD
  formatDate(d = null){
    d = d == null ? new Date() : d;
    return `${''+d.getFullYear()}-${(''+(d.getMonth()+1)).padStart(2,0)}-${(''+d.getDate()).padStart(2,0)}`
  }

}
