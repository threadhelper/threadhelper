"use strict";

// Stores auth and CSRF tokens once they are captured in the headers.


// Utilities for interacting with storage, meta data, process headers, and act on install
class Utils {
  constructor() {
    this.options = {}
    this.loadOptions()
    this._tabId = null
  }

  // get options(){
  //   return this._options
  // }
  // set options(options){this._options = options}
  
  
  get tabId(){return this._tabId}
  set tabId(tabId){
    Utils.setData({lastTab: tabId}).then(()=>{console.log("set last tab", tabId)}); 
    this._tabId = tabId}
  

  //gets data and changes its attributes that match key_vals, then setts it
  static updateData(key, key_vals){
    this.getData(key).then(val=>{
      for (let k of Object.keys(key_vals)){
        val[k] = key_vals[k]
      }
      let objset = {}
      objset[key] = val
      this.setData(objset)
    })
  }

  //returns a promise that gets a value from chrome local storage 
  static getData(key) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(key, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(items[key]);
        }
      });
    });
  }

  //returns a promise that sets an object with key value pairs into chrome local storage 
  static setData(key_vals) {
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

  // Delete data from storage
  // takes an array of keys
  async removeData(keys){
    return new Promise(function(resolve, reject) {
      chrome.storage.local.remove(keys,function(){
        console.log("removed", keys)
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      }); 
    });
  }
  // gets all twitter tabs
  static getTwitterTabIds(){
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({url: "*://twitter.com/*", currentWindow: true}, function(tabs){
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          console.log("twitter tabs",tabs)
          let tids = tabs.map(tab=>{return tab.id})
          resolve(tids);
        }
      });  
    });
  }

  // Gets the ID of the current tab
  static getActiveTabId(){
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          console.log(tabs)
          resolve(tabs[0].id);
        }
      });  
    });
  }

  // Loads options from storage
  async loadOptions(){
    Utils.getData("options").then(opts=>{
        if (typeof opts !== "undefined"){
          this._options = opts
        }
    })
  }

  // Message content script  
  async msgCS(m){
    //let tabId = await Utils.getTabId()
    try{
    chrome.tabs.sendMessage(this.tabId, m)
    console.log("sending message to cs tab ", m)
    } catch(e){
    console.log(e)
    }
  }

    
  //clears storage of tweets, tweets meta info, and auth
  clearStorage(){
    this.removeData(["tweets","tweets_meta"]).then(()=>{
        this.msgCS({type: "storage-clear"}) 
        wiz.tweets_meta = TweetWiz.makeTweetsMeta(null)
      }
    )
    return true
  }

  // called after reloading, checks if auth exists and if not
  // can't send requests out of here bc sending requests sends a header and makes a feedback loop
  static async processHeaders(headers){
    // on mac there's a bug where updateAuth is called befor auth is defined, so this is checking that
    if (typeof auth  === 'undefined'){
      console.log("auth was undefined, for some reason, gonna define it and do nothing else")
      auth = new Auth();
    }
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
      auth.updateAuth(csrfToken,authorization)
    }
    else{
      console.log("header does not have auth")
    }
  }

  static onInstalled() {
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
    Utils.getTwitterTabIds().then(tids=>{
      utils.removeData("lastTab")
      console.log("reloading twitter tabs", tids)
      for (let tid of tids){
        chrome.tabs.reload(tid);
      }
    })
    // Utils.getData("lastTab").then(tid=>{
    //   utils.removeData("lastTab")
    //   console.log("reloading last tab", tid)
    //   chrome.tabs.reload(tid);
    // })
  }

    
  // to format YYYY-MM-DD
  static formatDate(d = null){
    d = d == null ? new Date() : d;
    return `${''+d.getFullYear()}-${(''+(d.getMonth()+1)).padStart(2,0)}-${(''+d.getDate()).padStart(2,0)}`
  }

}

/*
testAuth: checks if it's null, makes a request about current user
getAuth: load or reload page
updateAuth: turns headers into auth
*/
class Auth {
  constructor(csrfToken = null, authorization = null, since = null) {
    this.csrfToken = csrfToken;
    this.authorization = authorization;
    this.since = since
    
  }
  
  isAuth(){
    let auth = this;
    return ! (typeof auth === 'undefined' || auth.authorization == null || auth.csrfToken == null || auth.authorization == 'null' ||auth.csrfToken == 'null')
  }
  // is auth something rather than null and friend?
  isFresh(stale_thresh=1){
    // auths aren't explicitly expired, but I still don't exactly know what to do when the current one is bad and reloading doesn't get you a new one
    let auth = this;
    let fresh = false;
    if (!auth.isAuth()){
      //console.log("auth does not exist", auth)
      return false
    }
    else{ 
      var now = new Date()
      var msPerH = 60 * 60 * 1000; // Number of milliseconds per day
      //var stale_thresh = 0.05 //3m
      var hours_past = (now.getTime() - auth.since) / msPerH;
      if(hours_past <= stale_thresh) {
        fresh = true
      }
    }
    return fresh
  }
  //make a trivial request to make sure auth works
  //returns false if not good, and user info if good
  async testAuth(){
    let auth = this;
    let _user_info = null;
    if (this.isAuth() /*&& this.isFresh(auth)*/){
      try
      {
        const init = {
          credentials: "include",
          headers: {
            authorization: auth.authorization,
            "x-csrf-token": auth.csrfToken
          }
        };
        var uurl = `https://api.twitter.com/1.1/account/verify_credentials.json`
        console.log("testing auth getting user info")
        let res = await fetch(uurl,init).then(x => x.json())//.catch(throw new Error("caught in fetch")) 
        if(res != null)
        {
          Utils.setData({user_info: res})
          wiz.user_info = res
          _user_info = res
          console.log("auth is good")
        }
      }
      catch(err){
          console.log("auth is stale")
          console.log(err)
      }
    }
    return _user_info
  }

  setParams(auth){
    this.csrfToken = auth.csrfToken;
    this.authorization = auth.authorization;
    this.since = auth.since
  }

  getParams(){
    return {csrfToken: this.csrfToken, authorization: this.authorization, since: this.since}
  }


  // check if good, tries to load, and reloads page if failed (to get an auth)
  // auths are produced when application cookie isn't there
  // reload will only work if cookie's missing
  // 
  async getAuth() {
    //try to get from storage first
    let success = false
    let auth = this
    let fresh = false
    //fresh = await auth.testAuth()
    // test if it's already a good auth
    if (fresh){
      console.log("current auth fresh af")
      success = true
    }
    // otherwise try to load from storage and test if it's good
    else{
      console.log("gonna load auth from storage")
      let data = await Utils.getData("auth");
      if (data != null && data.csrfToken != null && data.authorization != null) auth.setParams(data)

      if (await auth.testAuth()){
        console.log("got it")
        success = true
      }
      // if it's not good, delete it from storage
      else{
        console.log("couldn't or is bad, getting new auth")
        chrome.storage.local.remove(["auth"],function(){
          var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
          console.log("deleted stored auth")
        })
        //chrome.cookies.remove("auth_token")
        //chrome.cookies.getAll({domain: "twitter.com"/*, name:"auth"*/}, (r)=>{console.log("cookies",r)})
        success = false
        //finally reload page to get a new one
        this.getNew();
      }
    }
    return success
  }

  // tries to reload page to get a new auth
  async getNew(){
    var reload_ok = confirm("I'll have to reload the page to get my authorization token :)");
    if (reload_ok){
      chrome.tabs.reload(utils.tabId);
    }
  }

  // Gets auth and csrf token Called before every request. Store only if expired.
  async updateAuth(csrfToken, authorization) {
    let auth_params = {}

    // gather auth params
    auth_params.csrfToken = csrfToken;
    auth_params.authorization = authorization;
    var now = new Date()
    auth_params.since = now.getTime()

    // set em
    this.setParams(auth_params)
    chrome.storage.local.set({ auth: auth_params }, function() {
    })
  }

}

// For all functions related with tweets and getting them
class TweetWiz{
  constructor() {
    this.user_info = {}
    this.midRequest = false
    this.interrupt_query = false
    this.tweets_meta = TweetWiz.makeTweetsMeta(null)
  }

  //get user_info(){return this.user_info}
  //set user_info(user_info){this.user_info = user_info}


  // get interrupt_query(){return this.interrupt_query}
  // set interrupt_query(interrupt_query){this.interrupt_query = interrupt_query}
  
  //get midRequest(){return this.midRequest}
  //set midRequest(midRequest){this.midRequest = midRequest}
  
  //get tweets_meta(){return this.tweets_meta}
  //set tweets_meta(tweets_meta){this.tweets_meta = tweets_meta}
  
  getMetaData(){
    return this.tweets_meta != null ? this.tweets_meta : TweetWiz.makeTweetsMeta(null)
  }

  static makeTweetsMeta(tweets, update_type = "update"){
    let meta = {}
    if (tweets != null){
      meta = {
        count: tweets.length, 
        max_id: tweets[tweets.length - 1].id, 
        max_time: tweets[tweets.length - 1].time,
        since_id: tweets[0].id, 
        since_time: tweets[0].time,
        last_updated: (new Date()).getTime(),
        has_archive: update_type == "archive" ||wiz.tweets_meta.has_archive ,
        has_timeline: wiz.tweets_meta.has_timeline, //update_type == "timeline"
      }
    } else{
      meta = {
        count: 0, 
        max_id: null, 
        max_time: null,
        since_id: null, 
        since_time: null,
        last_updated: null,
        has_archive: false,
        has_timeline: false,
      }
    }
    return meta
  }

    
  // TODO: maximal efficiency would consider the origin with the old tweets but that's more than I want to do
  static priorityConcat(_old, _new, update_type = "update"){
    let overwrite = (sub,dom,dom_meta) => {
      //I only want sub with id > dom.since_id and sub with id < dom.max_id
      let reverse_sub = sub.slice().reverse()
      // start looking in reverse because it's supposed to be faster
      let overlap_n = (reverse_sub.findIndex((t)=>{return t.id > dom_meta.since_id}))
      let cap = sub.slice(0,(sub.length - 1) - overlap_n)
      let shoes = sub.slice((sub.findIndex((t)=>{return t.id < dom_meta.max_id})),(sub.length - 1))
      // console.log("OVERWRITE")
      // console.log("SUB", sub)
      // console.log("CAP", cap)
      // console.log("DOM", dom)
      // console.log("SHOES", shoes)
      console.log(`OVERWRITTEN ${overlap_n} tweets`)
      return cap.concat(dom).concat(shoes)
    }
    let priority = {
      timeline: 5,
      update: 4, //there are reasons for update to be higher priority than timeline (deleted recent tweets) but like this is more efficient
      archive: 3,
      old: 2,
      history: 1
    }
    let new_tweets = []
    let old_meta = TweetWiz.makeTweetsMeta(_old, update_type)
    let new_meta = TweetWiz.makeTweetsMeta(_new, update_type)
    if (priority[update_type] > priority.old){
      new_tweets = overwrite(_old, _new, new_meta)
    } else{
      new_tweets = overwrite(_new, _old, old_meta)
    }
    return new_tweets
  }


  // Convert request results to tweets and save them
  // TODO  : deal with archive RTs which are listed as by the retweeter and not by the original author
  static async saveTweets(res, update_type = "update"){
    console.log(`${update_type} saveTweets res`, res);
    let arch = update_type == "archive"
    let toTweet = (t)=>{return TweetWiz.toTweet(t,false)}
    let archToTweet = (t)=>{return TweetWiz.toTweet(t,true)}
    let new_tweets = arch ? res.map(archToTweet) : res.map(toTweet);
    let all_tweets = []
    if (new_tweets.length > 0){
      // load all tweets
      let old_tweets = await Utils.getData("tweets")
      old_tweets = old_tweets != null ? old_tweets : []

      
      // all_tweets = all_tweets.concat(new_tweets)
      if (typeof old_tweets !== "undefined" && old_tweets != null && old_tweets.length > 0){
        all_tweets = TweetWiz.priorityConcat(old_tweets, new_tweets)
      } else {
        all_tweets = new_tweets
      }
    
      all_tweets = TweetWiz.removeDuplicates(all_tweets)
      wiz.tweets_meta = TweetWiz.makeTweetsMeta(all_tweets, update_type)
      console.log(update_type)
      // append new tweets and store all tweets'
      let data = {tweets: all_tweets, tweets_meta: wiz.tweets_meta}
      await Utils.setData(data)
      console.log("Saved!",data)
      utils.msgCS({type: "tweets-loaded"})
    }
    else{
      console.log("No new tweets!",res)
    }
    return new_tweets
  }

  
  // removes duplicate tweets
  static removeDuplicates(myArr, prop ='id') {
    let unique_arr = myArr
    if(myArr != null) unique_arr = myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
    return unique_arr
  }

  static toTweet(entry, arch = false){
    console.log("user info:", wiz.user_info)
    let tweet = null;
    entry = arch ? entry.tweet : entry;
    if (entry != null){
      tweet = {
        // Basic info.
        id: entry.id_str,
        //id: entry.id,
        text: entry.full_text || entry.text,
        name: arch ? wiz.user_info.name : entry.user.name,
        username: arch ? wiz.user_info.screen_name : entry.user.screen_name,
        profile_image: arch ? wiz.user_info.profile_image_url_https : entry.user.profile_image_url_https,
        time: new Date(entry.created_at).getTime(),
        human_time: new Date(entry.created_at).toLocaleString(),
        // Replies/mentions.
        reply_to: entry.in_reply_to_screen_name, // null if not present.
        mentions: entry.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})),
        // URLs.
        urls: entry.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
        // Media.
        has_media: typeof entry.entities.media !== "undefined",
        media: null,
        // Quote info.
        has_quote: entry.is_quote_status,
        is_quote_up: typeof entry.quoted_status !== "undefined",
        quote: null,
      }
      // Add media info.
      if (tweet.has_media) {
        tweet.media = entry.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
      }
      // Add full quote info.
      if (tweet.has_quote && tweet.is_quote_up) {
        tweet.quote = {
          // Basic info.
          text: entry.quoted_status.text,
          name: entry.quoted_status.user.name,
          username: entry.quoted_status.user.screen_name,
          time: new Date(entry.quoted_status.created_at).getTime(),
          profile_image: entry.quoted_status.user.profile_image_url_https,
          // Replies/mentions.
          reply_to: entry.quoted_status.in_reply_to_screen_name,
          mentions: entry.quoted_status.entities.user_mentions.map(x => ({username: x.screen_name, indices: x.indices})),
          // URLs.
          urls: entry.quoted_status.entities.urls.map(x => ({current_text: x.url, display: x.display_url, expanded: x.expanded_url})),
          has_media: typeof entry.quoted_status.entities.media !== "undefined",
          media: null,
        }
        if (tweet.quote.has_media) {
          tweet.quote.media = entry.quoted_status.entities.media.map(x => ({current_text: x.url, url: x.media_url_https}))
        }
      }
    }
    return tweet
  }
    
  // Catches errors and sometimes reloads the page to get a new auth
  static handleError(err){
    //console.log("handling tweet query error")
    switch (err.code){
      case 353: //"This request requires a matching csrf cookie and header."
        console.log("auth is bad, getting new")
        auth.getNew();
      case 215: //""Bad Authentication data.""
        console.log("auth is bad, getting new")
        auth.getNew();
      default:
        console.log(err)
    }
  }
}




//** Handles messages sent from popup or content scripts */
async function onMessage(m, sender) {
  console.log("message received:", m);
  let auth_good = null
  switch (m.type) {
    case "cs-created":
      let tid = sender.tab.id
      utils.tabId = tid
      break;

    case "saveOptions":
      utils.loadOptions()
      utils.msgCS({type:"saveOptions"})
      break;

    case "loadArchive":
      utils.msgCS({type: "loadArchive"})
      // console.log(await nlp.getRelated("meme magic"))
      // console.log("archive loading", archive_tweets.slice(0,50))
      break;
    
    case "tempArchiveStored":
      updateTweets(m, "archive");
      break;

    case "saveArchive":
      utils.msgCS({type: "save_archive"})
      break;
      

    case "update":
      auth_good = await auth.testAuth()
      if(await auth_good != null){
        console.log("auth good", auth_good)
        updateTweets(m);
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, "update")
      }
      break;

    case "timeline":
      auth_good = await auth.testAuth()
      if(await auth_good != null){
        console.log("auth good", auth_good)
        updateTweets(m, "timeline");
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, "timeline")
      }
      break;

    case "load_history":
      auth_good = await auth.testAuth()
      if(auth_good  != null){
        console.log("auth good", auth_good)
        updateTweets(m, "archive");
      }
      else{
        console.log("auth bad, loadin")
        auth_good = await auth.getAuth()
        if (auth_good) updateTweets(m, "archive")
      }
      break;
    case "interrupt-query":
      wiz.interrupt_query = true;
      break;

    case "clear":
      utils.clearStorage()
      break;
  }
  return //Promise.resolve('done');
  ;
}


async function updateTweets(m, update_type = "update"){
  utils.msgCS({type: "tweets-loading", update_type: update_type})
  let tweets = []
  if (!wiz.midRequest){
    wiz.midRequest = true

    //let tweets = await getData("tweets")
    let meta = await Utils.getData("tweets_meta")

    if (meta != null) {
      wiz.tweets_meta = meta
    }else{
      wiz.tweets_meta = wiz.getMetaData()
    }
    if(update_type == "update" && !wiz.tweets_meta.has_timeline) update_type = "timeline"
    switch(update_type){
      case "archive":
        Utils.getData("temp_archive").then((temp_archive) => {
          TweetWiz.saveTweets(temp_archive, update_type).then((_tweets)=>{
            tweets = _tweets
            utils.msgCS({type: "tweets-done", update_type: update_type})
            wiz.midRequest = false
          })
        })
        utils.removeData(["temp_archive"])
        break;
      case "update":
        query(auth, wiz.tweets_meta, "update").then((_tweets)=>{
          tweets = _tweets
          utils.msgCS({type: "tweets-done", update_type: update_type})
          wiz.midRequest = false
        })
        break;
      case "timeline":
        query(auth, wiz.tweets_meta, "timeline").then(function(_tweets) {
          tweets = _tweets
          utils.msgCS({type: "tweets-done", update_type: update_type})
          Utils.updateData("tweets_meta", {has_timeline:true})
          wiz.midRequest = false
        });
        break;
      case "history":
        query(auth, wiz.tweets_meta, "history").then((_tweets)=>{
          tweets = _tweets
          utils.msgCS({type: "tweets-done", update_type: update_type})
          wiz.midRequest = false
        })
        break;
    }
  console.log(`done with ${update_type}`, tweets)
  }
  return tweets
}
   
      
//to call when we have tweets and wish to update just with the lates
async function query(auth, meta = null, query_type = "update", count = 3000) {
  //start by defining common variables
  wiz.interrupt_query = false
  meta = meta != null ? meta : wiz.tweets_meta
  let vars ={}
  let include_rts = utils.options.getRetweets != null ? utils.options.getRetweets : true//TODO investigate why these are coming up undefined
  const init = {
    credentials: "include",
    headers: {
      authorization: auth.authorization,
      "x-csrf-token": auth.csrfToken
    }
  };
  var username = wiz.user_info.screen_name
  var tweets = []
  var users = []
  let res = []
  let url = ''
  let stop = false

  let new_tweets = []
  
  // Container for a dynamic set of variables dependent on query_type
  
  // Defining functions for setup phase
  let setup ={
    update: (vars)=>{
      vars.since = meta.since_id != null ? `&since_id=${meta.since_id}` : ''
      vars.since_id = 0
      vars.url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}${vars.since}&count=${count}&include_rts=${include_rts}`
      vars.stop_condition = (res,tweets) => {return tweets.length >= count || !(res != null) || res.length < 1 || stop}
      return vars
    },
    timeline: (vars)=>{
      vars.max = meta.max_id != null ? `&since_id=${meta.max_id}` : ''
      vars.max_id = meta.max_id == null ? -1 : meta.max_id;
      vars.url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}${vars.max}&count=${count}&include_rts=${include_rts}`
      vars.stop_condition = (res,tweets) => {return tweets.length >= count || !(res != null) || res.length < 1 || stop}
      return vars
    },
    history: (vars)=>{
      vars.nDays = (n) =>{return n * 24 * 60 * 60 * 1000}
      vars.max_n_reqs = 180;      
      vars.arch_until = metaUtils.formatDate()
      vars.since = new Date(vars.arch_until);
      vars.arch_since = new Date(wiz.user_info.created_at);
      vars.until = new Date(vars.arch_until);
      vars.arch_until = vars.arch_until==null ? new Date() : new Date(vars.arch_until);
      
      // max days we can fit in 180 requests?
      // day span divided by 180 to know how many days to ask per request
      vars.nd = Math.min(5,Math.ceil(Math.floor((vars.arch_until.getTime() - vars.arch_since.getTime())/nDays(1)) / vars.max_n_reqs))
      vars.since.setTime(vars.since.getTime() - vars.nDays(nd))
      vars.stop_condition = (since, arch=arch_since) => {return (vars.since.getTime() <= vars.arch_since.getTime()) || wiz.interrupt_query }
      vars.query = escape(`from:${username} since:${Utils.formatDate(vars.since)} until:${Utils.formatDate(vars.until)}`);	  
      vars.url = `https://api.twitter.com/2/search/adaptive.json?q=${vars.query}&count=${count}&tweet_mode=extended`;
      return vars
    },
  }

  // Functions for Treat phase, treating the request respense
  let treat ={
    update: async (vars)=>{
      if (vars.since_id < res[0].id){
        vars.since_id = res[0].id
      } else{
        stop = true
      }
      vars.url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&since=${vars.since_id}&include_rts=${include_rts}`    
      return vars
    },
    timeline: async (vars)=>{
      tweets = tweets.concat(new_tweets)
      // console.log(`received total ${tweets.length} tweets`);
      // console.log("actual query results:", res);
      
      // max_id is the max of the next request, so if we received a lower id than max_id, use the new one 
      let batch_max = res[res.length - 1].id
      vars.max_id = (batch_max < vars.max_id || vars.max_id == -1) ? batch_max : vars.max_id
      vars.url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&max_id=${vars.max_id}&include_rts=${include_rts}`
      return vars
    },
    history: async (vars)=>{
      var res_tweets = Object.values(res.globalObjects.tweets)
      if (res_tweets.length == 0 || res_tweets == null){// console.log("res is empty or empty")
      }
      else
      {
        users = Object.values(res.globalObjects.users)
        let user_tweets = res_tweets.map(t=>{t.user=users.find(u=>{return u.id == t.user_id}); return t})
        
        console.log(new_tweets)
        console.log(`received total ${tweets.length} tweets`);
      }
      vars.until.setTime(vars.until.getTime() - vars.nDays(vars.nd)) 
      vars.since.setTime(vars.until.getTime() - vars.nDays(vars.nd)) 
      vars.url = `https://api.twitter.com/2/search/adaptive.json?q=${vars.query}&count=${count}&tweet_mode=extended`;
      return vars
    },
  }

  // Prep phase of query, defining variables, defining url for query
  vars = setup[query_type](vars)
  console.log(vars)
  // Query loop
  do
    {
      try
      {
        console.log(`GET: ${vars.url}`)
        res = await fetch(vars.url,init).then(x => x.json())
      }
      catch(err){
        TweetWiz.handleError(err)
      }
      if (res.length <= 0 || res ==null){
        //throw new Error("res is empty")
        console.log("res is empty")
        break;
      } else{ 
        //modifies new_tweets
        vars = await treat[query_type](vars)
        new_tweets = await TweetWiz.saveTweets(res,update_type);
        tweets = tweets.concat(new_tweets)
      }
    }while(!vars.stop_condition(res,tweets))
  return tweets
}


function main(){
  chrome.runtime.onMessage.addListener(onMessage);
  chrome.runtime.onInstalled.addListener(Utils.onInstalled);
  chrome.webRequest.onBeforeSendHeaders.addListener(
    c => {
      Utils.processHeaders(c.requestHeaders);
    },
    { urls: ["https://api.twitter.com/*"] },
    ["requestHeaders"]
  );
  // chrome.runtime.onSuspend.addListener(async function() {
  //   console.log("Unloading.");
  //   await setData({lastTab: utils.tabId})
  // });
  
  
  // Basically every time we change tabs or the tab url is updated, update tabId and send msg to CS
  chrome.tabs.onActivated.addListener( function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
      let y = tab.url;
      if (y.match(twitter_url)) {
        console.log("you are here: "+y);
        utils.tabId = tab.id
        utils.msgCS({type:"tab-activate", url:y, cs_id: tab.id})
      }
    });
  });
  chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active && change.url) {
      if (change.url.match(twitter_url)){
        console.log("you are here: "+change.url);
        utils.tabId = tab.id
        utils.msgCS({type:"tab-change-url", url:change.url, cs_id: tab.id})
      }
    }
  });




  window.onload = () => {utils.loadOptions()}
}


// INIT
let utils = new Utils();
let auth = new Auth();
let wiz = new TweetWiz();
let twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
let regex = new RegExp(twitter_url);

main()