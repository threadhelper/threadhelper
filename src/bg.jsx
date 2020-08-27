import * as idb from 'idb'

console.log("hi I'm background")

let twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

function main(){
  chrome.runtime.onInstalled.addListener(onInstalled);
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.tabs.onUpdated.addListener(onTabUpdated);
}


function onInstalled() {
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
}

function onTabActivated(activeInfo){
  chrome.tabs.get(activeInfo.tabId, function(tab){
    if(tab.url != null){
      try{
        let url = tab.url;
        if (url.match(twitter_url)) {
          console.log("tab activated", tab)
          // utils.tabId = tab.id
          // utils.msgCS({type:"tab-activate", url:url, cs_id: tab.id})
        }
      }catch(e){
        console.log(e)
      }
    }
  });
}

function onTabUpdated(tabId, change, tab){
  if (tab.active && change.url) {
    if (change.url.match(twitter_url)){
      console.log(`url changed: ${change.url}`)
      // utils.tabId = tab.id
      // utils.msgCS({type:"tab-change-url", url:change.url, cs_id: tab.id})
    }
  }
}    


//** Handles messages sent from popup or content scripts */
async function onMessage(m, sender) {
  console.log("message received:", m);
  let auth_good = null
  let auth_wrapper = async function(func, arg){
    auth_good = await auth.testAuth()
    if(auth_good != null){
      wiz.user_info = auth_good
      func(arg);
    }
    else{
      //console.log("auth bad, loadin")
      auth_good = await auth.getAuth()
      if (auth_good){
        wiz.user_info = auth_good
        func(arg)
      }
    }
  }
  switch (m.type) {
    case "cs-created":
      let tid = sender.tab.id
      utils.tabId = tid
      if(!wiz.inited) wiz.init()
      if(!nlp.inited) nlp.init()
      auth_wrapper(wiz.handleQuery, 'update')
      break;

    case "query":
      auth_wrapper(wiz.handleQuery,m.query_type)
      break;
    
    case "new-tweet":
      auth_wrapper(wiz.handleQuery, 'update')
      break;
    
    case "search":
      nlp.nextSearch = m.query
      break;

    case "robo-tweet":
      robo.handleRoboTweet(m)
      break;
    
    case "get-thread":
      wiz.getThreadAbove(m.tid)
      break;

    case "interrupt-query":
      wiz.interrupt_query = true;
      break;

    case "temp-archive-stored":
      wiz.handleQuery(m);
      break;

    case "clear":
      utils.clearStorage().then(()=>{
        try{
          console.log("reloading")
          utils.getTwitterTabIds().then(tids=>{
            //console.log("reloading twitter tabs", tids)
            for (let tid of tids){
              chrome.tabs.reload(tid);
            }
          })
        } catch(e){
          console.log("couldn't reload twitter tab. None open?")
        }
      })
      break;
  }
  return //Promise.resolve('done');
  ;
}
 