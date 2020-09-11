import $ from 'jquery'

export const url_regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export const last_tweet_id = 0
export const editorClass = "DraftEditor-editorContainer"
const editorSelector = ".DraftEditor-editorContainer";

// gets all twitter tabs
export function getTwitterTabIds(){
  return new Promise(function(resolve, reject) {
    chrome.tabs.query({url: "*://twitter.com/*", currentWindow: true}, function(tabs){
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(tabs.map(tab=>{return tab.id}));
      }
    });  
  });
}

export const getComposers = ()=>document.querySelectorAll(editorSelector)
export const getActiveComposer = ()=>{
  const comps = [...getComposers()]; 
  let comp = null
  switch(comps.length){
    case 0:
      break;
    case 1:
      comp = comps[comps.length - 1]
      break;
    default:
      comp = comps[comps.length - 2]
      break;
  }
  return comp
}

export const getCurrentUrl = () => window.location.href

export function getMode(url = null){
  var pageURL = url == null ? getCurrentUrl() : url
  var home = 'https://twitter.com/home'
  var compose = 'https://twitter.com/compose/tweet'
  var notifications = 'https://twitter.com/notifications'
  var explore = 'https://twitter.com/explore'
  var bookmarks = 'https://twitter.com/i/bookmarks'
  var status = '/status/'
  // .?
  // console.log("mode is " + pageURL)
  if (pageURL.indexOf(home) > -1){
    return 'home'
  }
  else if (pageURL.indexOf(compose) > -1){
    return "compose"
      }
      else if (pageURL.indexOf(notifications) > -1){
    return "notifications"
      }
      else if (pageURL.indexOf(explore) > -1){
    return "explore"
      }
      else if (pageURL.indexOf(bookmarks) > -1){
    return "bookmarks"
      }
      else if (pageURL.indexOf(status) > -1){
    return "status"
  }
  else{
    return "other"
  }
}

export function isSidebar(mode){
  switch(mode){
    case 'home':
      return document.getElementsByClassName('sug_home').length > 0 
    case 'compose':
      return document.getElementsByClassName('sug_compose').length > 0
    default:
      return false
  }
}


export function containsOrContained(a, b){
  return b.contains(a) || a.contains(b)
}

export function elIntersect(selector, elem){
  return [...document.querySelectorAll(selector)].some((s)=>{
    return containsOrContained(elem, s)
  })
}

// true if active element contains or is contained by the element of interest
export function isFocused(selector){
  return elIntersect(selector, document.activeElement)
}



// export function isComposeFocused(){
//   return activeComposer ? activeComposer.contains(document.activeElement) : false
// }

// get ID from the tweet card DOM element
export function getTweetId(tweet){
  console.log(tweet)
  let date = $(tweet).find('time')[0]
  let linkEl = date.parentNode
  let link = linkEl.href
  let link_spl = link.split('/')
  let tid = link_spl[link_spl.length -1]
  return tid
}

// get tweet id from status url
export function getIdFromUrl(url){
  let link_split = url.split('/')
  let tid = link_split[link_split.length - 1]
  return tid
}

function setTheme(bg_color, txt_color, border_color){
  let root = document.documentElement;
  root.style.setProperty('--main-bg-color', bg_color);
  root.style.setProperty('--main-txt-color', txt_color);
  root.style.setProperty('--main-border-color', border_color);
}

export function updateTheme(bg_color=null){
  const light_theme = "rgb(255, 255, 255)"
  const dim_theme = "rgb(21, 32, 43)"
  const black_theme = "rgb(0, 0, 0)"
  bg_color = bg_color === null ? document.body.style["background-color"] : bg_color
  
  console.log("setting theme", bg_color)
  switch(bg_color){
    case light_theme:
      setTheme("#f5f8fa", "black", "#e1e8ed")
      break;
    case dim_theme:
      setTheme("#192734", "white", "#38444d")
      break;
    case black_theme:
      setTheme("black", "white", "#2f3336")
      break;
    default:
      setTheme("#f5f8fa", "black", "#e1e8ed")
      break;
  }
}

