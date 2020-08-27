/* CS is here to manage the presence of components and events they're not supposed to access.

Layout:
x Process messages from BG

x Create Sidebar
- Inject Sidebar into twitter pages when appropriate
  x home
  - compose
- Remove Sidebar from twitter pages when appropriate
  x home
  x compose

- manage information about twitter use (inited in initLocalStorage)
  x last_tweet_id // the last tweet whose page we were in
  x current_reply_to // could be last_tweet_id, but could be a direct reply outside of a tweet page
- manage inputs in twitter use
  x tweet, 
  x reply, 
  x rt, 
  x undo rt, 
  x delete

x define destruction and dispatch its event on start up
*/

import "@babel/polyfill";
import { h, render, Component } from 'preact';
// import { useState, useCallback } from 'preact/hooks';
import { updateTheme, getMode, isSidebar, getIdFromUrl, getCurrentUrl } from './utils/wutils.jsx'
import { getData, setData, msgBG, makeGotMsgObs } from './utils/dutils.jsx';
import { compose, curry, prop } from './utils/fp.jsx';
import { makeRoboStream, makeActionStream, makeComposeFocusObs, makeReplyObs, replyToWhom } from './ui/inputsHandler.jsx'
import { makeSidebarHome, makeSidebarCompose, makeHomeSidebarObserver, makeFloatSidebarObserver, injectSidebarHome, injectDummy } from './ui/sidebarHandler.jsx'
import { makeComposeObs } from './ui/composeHandler.jsx'

import { makeLastStatusObs, makeModeObs, makeBgColorObs } from './ui/tabsHandler.jsx'
import css from '../style/cs.scss'
import Kefir, { sequentially } from 'kefir';
import ThreadHelper from './components/ThreadHelper.jsx'


let thBarHome = makeSidebarHome()
let thBarComp = makeSidebarCompose()
const _onLoad = () => onLoad(thBarHome, thBarComp)
function main(){
  // Create Sidebar
  

  // Process messages from BG
  // Includes:
  // - Tab URL Change
  // chrome.runtime.onMessage.addListener(onMessage);  
  // chrome.storage.onChanged.addListener(onStorageChanged);
  window.addEventListener('load', _onLoad, true);
  
  msgBG({type:"cs-created"})
  
}

//onMessage and onStorageChanged should process stuff from BG and Twitter and send custom DOM events


//** Handles messages sent from background */
// async function onMessage(m) {
//   // console.log("message received:", m);
//   switch (m.type) {
//     case "tab-change-url":
//       onURLChange(m.url)
//       break;  
//   }
//   return true
// }

// on chrome storage changes
// function onStorageChanged(changes, area){
  
//   function csOnStorageChanged(item, oldVal, newVal){
//     switch(item){
      
//     }
//   }

//   return makeOnStorageChanged(csOnStorageChanged)
// }

// hande twitter posting actions like tweets, rts and deletes
function handlePosting(){
  msgBG({type:'query', query_type:'update'})
}

const subscriptions = []

function rememberSub(sub){
  subscriptions.push(sub)
}
async function onLoad(thBarHome, thBarComp){
  const gotMsg$ = makeGotMsgObs()
  const mode$ = makeModeObs(gotMsg$)
  
  const actions$ = makeActionStream()
  console.log('action stream created',actions$)
  const _sub_actions = actions$.observe({
    value(value) {
      console.log(`action taken: ${value}`)
      handlePosting()
    },
    error(error) {
      console.log('error:', error);
    },
    end() {
      console.log('end');
    },
  });
  rememberSub(_sub_actions)

  const bgColor$ = makeBgColorObs()
  const getBgColor = x=>x.style.backgroundColor
  const theme$ = bgColor$.map(getBgColor).skipDuplicates().toProperty(()=>getBgColor(document.body))
  const _sub_theme = theme$.observe({
    value(value) {
      updateTheme(value)
    },
    error(error) {
      console.log('error:', error);
    },
    end() {
      console.log('end');
    },
  })
  rememberSub(_sub_theme)

  const robo$ = makeRoboStream()
  // stream for focus on compose box
  // stream writing while focused 
  const composeFocus$ = makeComposeFocusObs();
  // composeFocus$.log('compose focus')
  let composeQuery$ = composeFocus$.filter(x => x != 'unfocused').flatMapLatest(e=>makeComposeObs(e.target))

  // const composeQueryObsFunc = {
  //   value(value) {
  //     // console.log('value:', value);
  //   },
  //   error(error) {
  //     console.log('error:', error);
  //   },
  //   end() {
  //     console.log('end');
  //   },
  // }
  // composeQuery$.observe(composeQueryObsFunc);


  const lastStatus$ = makeLastStatusObs(mode$)
    lastStatus$.log("last status: ")

  const reply$ = makeReplyObs(mode$)

  const replyTo$ = reply$.map(replyToWhom(lastStatus$))
    replyTo$.log("replying to ")

  const input$ = {
    actions : actions$,
    robo : robo$,
    composeQuery : composeQuery$,
    replyTo : replyTo$,
    // lastTw : lastTwStream,
  }
  //
  const activateSidebar = curry( (floatSidebarStream, inject, bar, inputStreams) => { inject(bar); render(<ThreadHelper streams={inputStreams} float={floatSidebarStream}></ThreadHelper>, bar); })
  // const activateFloatSidebar = curry( (inject, bar, inputStreams) => { inject(bar); render(<ThreadHelper streams={inputStreams}></ThreadHelper>, bar); })
  const activateFloatSidebar = activateSidebar(Kefir.never())
  const activateHomeSidebar = activateSidebar
  const deactivateSidebar = (bar) => { render(null, bar) }
  
  const floatSidebar$ = makeFloatSidebarObserver(thBarComp)
  const _sub_float = floatSidebar$.observe({
    value(value) {
      console.log('float sidebar value:', value);
      value == 'render' ? activateFloatSidebar(injectDummy, thBarComp, input$) : deactivateSidebar(thBarComp)
    },
    error(error) {
      console.log('error:', error);
    },
    end() {
      console.log('end');
    },
  });

  const homeSidebar$ = makeHomeSidebarObserver(thBarHome)
  const _sub_home = homeSidebar$.observe({
    value(value) {
      // console.log('home sidebar value:', value);
      value == 'render' ? activateHomeSidebar(floatSidebar$, injectSidebarHome, thBarHome, input$) : deactivateSidebar(thBarHome)
    },
    error(error) {
      console.log('error:', error);
    },
    end() {
      console.log('end');
    },
  });

  rememberSub(_sub_float)
  rememberSub(_sub_home)

  // setUpTrendsListener(thBarHome, inputStreams)
  // setUpFloatingComposeListener(thBarComp, inputStreams)
  // setUpComposeListener()
  // setUpPublishListeners()

  if(!await getData('sync')){
    msgBG({type:"query", query_type: "update"})
  }
}





//for initializing localStorage variables that might not have values and pertain to CS (vs BG)
async function initLocalStorage(){
  // only has anything if a tweet(with a url on the date)'s reply button has been clicked
  if((await getData('current_reply_to')) != null) setData({current_reply_to: null})
  // only has anything if user's been on a status page
  if((await getData('last_tweet_id')) != null) setData({last_tweet_id: null})
}




  
function destructor(destructionEvent) {
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
  // document.removeEventListener('focusin',wutils.onFocusIn);
  // document.removeEventListener('focusout',wutils.onFocusOut);
  window.removeEventListener('load', _onLoad, true);
  // chrome.runtime.onMessage.removeListener(onMessage);
  // chrome.storage.onChanged.removeListener(onStorageChanged);
  // for (let obs of wutils.observers){
  //   if (obs != null) obs.disconnect()
  // }
  subscriptions.forEach(x=>x.unsubscribe())
  render(null,thBarHome)
  render(null,thBarComp)
  //console.log("DESTROYED")
  //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabId));
}

function setDestruction(destructor){
  const destructionEvent = 'destructmyextension_' + chrome.runtime.id;
  // Unload previous content script if needed
  document.dispatchEvent(new CustomEvent(destructionEvent));
  const _destructor = ()=> destructor(destructionEvent)
  document.addEventListener(destructionEvent, _destructor);
  
  
  //let port = chrome.runtime.connect()
  //port.onDisconnect.addListener(destructor)

}

//destroys previous content script
setDestruction(destructor);

main()