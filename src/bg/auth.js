import {getData, setData} from '../utils/dutils.jsx'


/*
testAuth: checks if it's null, makes a request about current user
getAuth: load or reload page
updateAuth: turns headers into auth
*/
export class Auth {
    constructor(csrfToken = null, authorization = null, since = null) {

      this.user_info = null

      this.csrfToken = csrfToken;
      this.authorization = authorization;
      this.since = since
      
    }
    
    init(){
      let auth = this
      const init = {
        credentials: "include",
        headers: {
          authorization: auth.authorization,
          "x-csrf-token": auth.csrfToken
        }
      };
      return init
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

    async getUserInfo(){
      let _user_info = null;
      var uurl = `https://api.twitter.com/1.1/account/verify_credentials.json`
      //console.log("testing auth getting user info")
      let res = await fetch(uurl,this.init()).then(x => x.json())//.catch(throw new Error("caught in fetch")) 
      if(!Object.keys(res).includes("errors"))
      {
        setData({user_info: res})
        this.user_info = res
        _user_info = res
        console.log("auth is good", res)
      } else{
        _user_info = null
      }
      return _user_info
    }

    //make a trivial request to make sure auth works
    //returns false if not good, and user info if good
    async testAuth(){
      let auth = this;
      let _user_info = null;
      if (this.isAuth()){
        try
        {
          _user_info = await this.getUserInfo()
        }
        catch(err){
          _user_info = null
          console.log(err)
          // throw(err)
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
      fresh = await auth.testAuth()
      // test if it's already a good auth
      if (fresh){      success = true    }
      // otherwise try to load from storage and test if it's good
      else{
        let data = await getData("auth");
        if (data != null && data.csrfToken != null && data.authorization != null) auth.setParams(data)
  
        if (await auth.testAuth()){
          success = true
        }
        // if it's not good, delete it from storage
        else{
          //console.log("couldn't or is bad, getting new auth")
          chrome.storage.local.remove(["auth"],function(){
            var error = chrome.runtime.lastError;
              if (error) {
                  console.error(error);
              }
            //console.log("deleted stored auth")
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
    // async getNew(){
    //   var reload_ok = confirm("I'll have to reload the page to get my authorization token :)");
    //   if (reload_ok){
    //     chrome.tabs.reload(utils.tabId);
    //   }
    // }

    // tries to reload page to get a new auth
    async getNew(){
      var reload_ok = confirm("No auth yet");
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
      setData({ auth: auth_params})
    }
  
  }
  