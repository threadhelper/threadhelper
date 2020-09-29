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
import { flattenModule, inspect, toggleDebug, currentValue } from './utils/putils.jsx'
import { updateTheme, getMode, isSidebar, getIdFromUrl, getCurrentUrl } from './utils/wutils.jsx'
import { getData, setData, msgBG, makeGotMsgObs, makeStorageObs, getOptions, requestRoboTweet } from './utils/dutils.jsx';
import { makeRoboStream, makeActionStream, makeComposeFocusObs, makeReplyObs, getHostTweetId, makeLastClickedObs, makeAddBookmarkStream, makeRemoveBookmarkStream, makeDeleteEventStream } from './ui/inputsHandler.jsx'
import { makeSidebarHome, makeSidebarCompose, makeHomeSidebarObserver, makeFloatSidebarObserver, injectSidebarHome, injectDummy } from './ui/sidebarHandler.jsx'
import { makeComposeObs } from './ui/composeHandler.jsx'
import { makeLastStatusObs, makeModeObs, makeBgColorObs } from './ui/tabsHandler.jsx'
import css from '../style/cs.scss'
import Kefir from 'kefir';
import * as R from 'ramda';
flattenModule(window,R)
import ThreadHelper from './components/ThreadHelper.jsx'

// Project business 
var DEBUG = true;
toggleDebug(window, DEBUG)
Kefir.Property.prototype.currentValue = currentValue

// Sidebar functions
let thBarHome = makeSidebarHome()
let thBarComp = makeSidebarCompose()
const activateSidebar = curry( (floatSidebarStream, inject, bar, thStreams) => {
  inject(bar); render(<ThreadHelper streams={thStreams} float={floatSidebarStream}></ThreadHelper>, bar); })
const activateFloatSidebar = activateSidebar(Kefir.never())
const activateHomeSidebar = activateSidebar
const deactivateSidebar = (bar) => { render(null, bar) }


// Webpage events
const makeIdObsMsg = curry((lastClickedId$, type) => {return {type:type, id:lastClickedId$.currentValue()}})
const getBgColor = x=>x.style.backgroundColor
const minIdleTime = 3000;

// Effects 
const handlePosting = ()=>msgBG({type:'update-tweets'}) // handle twitter posting actions like tweets, rts and deletes


// Stream clean up
const subscriptions = []
function rememberSub(sub){
  subscriptions.push(sub)
  return sub
}
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect}))

const _onLoad = () => onLoad(thBarHome, thBarComp)
function main(){
  window.addEventListener('load', _onLoad, true);  
  msgBG({type:"cs-created"})
}

async function onLoad(thBarHome, thBarComp){
  // Define streams
    // messages
  const gotMsg$ = makeGotMsgObs().map(x=>x.m)
  const mode$ = gotMsg$.filter(m => m.type == "tab-change-url").map(m=>getMode(m.url))
    // storage
  const storageChange$ = makeStorageObs()
  const latest$ = storageChange$.filter(x=>x.itemName=='latest_tweets').map(prop('newVal'))
  const sync$ = storageChange$.filter(x=>x.itemName=='sync').map(prop('newVal'))
  const syncDisplay$ = storageChange$.filter(x=>x.itemName=='syncDisplay').map(prop('newVal')).toProperty(()=>'')
    // webpage events
      // theme
  const bgColor$ = makeBgColorObs()
  const theme$ = bgColor$.map(getBgColor).skipDuplicates().toProperty(()=>getBgColor(document.body))
      // tweet ids
  const lastStatus$ = makeLastStatusObs(mode$)
  const getTargetId = getHostTweetId(lastStatus$)
  const lastClickedId$ = makeLastClickedObs().map(getTargetId).filter(x=>!isNil(x)).toProperty()
  const makeIdMsg = makeIdObsMsg(lastClickedId$) // function
      // actions
  const actions$ = makeActionStream() // post, rt, unrt
  const reply$ = makeReplyObs(mode$)  
  const replyTo$ = reply$.map(getTargetId).toProperty(()=>null)
  const addBookmark$ =  makeAddBookmarkStream().map(inspect('add bookmark')).map(_=>'add-bookmark')
  const removeBookmark$ = makeRemoveBookmarkStream().map(inspect('remove bookmark')).map(_=>'remove-bookmark')
  const delete$ = makeDeleteEventStream().map(inspect('delete')).map(_=>'delete-tweet')
  const targetedTweetActions$ = Kefir.merge([addBookmark$, removeBookmark$, delete$])
  const composeFocus$ = makeComposeFocusObs(); // stream for focus on compose box
  const composeQuery$ = composeFocus$.filter(x => x != 'unfocused').flatMapLatest(e=>makeComposeObs(e.target)).toProperty(()=>'')
  const stoppedWriting$ = composeQuery$.skipDuplicates().filter(x=>!isEmpty(x)).debounce(minIdleTime)  // to detect when writing has stopped for a bit
  const robo$ = Kefir.merge([makeRoboStream(), stoppedWriting$]).throttle(minIdleTime, {trailing: false})
  const thStreams = {
    actions : actions$,
    robo : robo$,
    composeQuery : composeQuery$,
    replyTo : replyTo$,
    syncDisplay : syncDisplay$,
  }
  
  // Sidebar control
  const updateFloat = value => value == 'render' ? activateFloatSidebar(injectDummy, thBarComp, thStreams) : deactivateSidebar(thBarComp) //function
  const updateHome = value => value == 'render' ? activateHomeSidebar(floatSidebar$, injectSidebarHome, thBarHome, thStreams) : deactivateSidebar(thBarHome) //function
  const floatSidebar$ = makeFloatSidebarObserver(thBarComp) // for floating sidebar in compose mode
  const homeSidebar$ = makeHomeSidebarObserver(thBarHome) // for main site sidebar over recent trends


  // Effects from streams
    // Actions
  subObs(actions$.delay(1000), (_)=>{handlePosting()})
  subObs(targetedTweetActions$, pipe(makeIdMsg, msgBG))
  subObs(theme$, updateTheme)
  subObs(robo$, _=>requestRoboTweet(composeQuery$.currentValue(), replyTo$.currentValue()))
    // Render Sidebar 
  subObs(floatSidebar$, updateFloat)
  subObs(homeSidebar$, updateHome)

  
  // const _sub_actions = actions$.delay(2000).observe({value:,}); rememberSub(_sub_actions);
  // const _sub_targetedActions = targetedTweetActions$.observe({value:pipe(makeIdMsg, msgBG)}); rememberSub(_sub_targetedActions);
  // const _sub_theme = theme$.observe({value: updateTheme,}); rememberSub(_sub_theme);
  // const _sub_robo = robo$.observe({value: _=>requestRoboTweet(composeQuery$.currentValue(), replyTo$.currentValue())}); rememberSub(_sub_robo);
  //   // Render Sidebar 
  // const _sub_float = floatSidebar$.observe({value: updateFloat,}); rememberSub(_sub_float);
  // const _sub_home = homeSidebar$.observe({ value: updateHome, }); rememberSub(_sub_home);

  // if(!await getData('sync')){
  //   // msgBG({type:"query", query_type: "update"})
  //   msgBG({type:"update-tweets"})
    
  // }
}

  
function destructor(destructionEvent) {
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
  window.removeEventListener('load', _onLoad, true);
  subscriptions.forEach(x=>x.unsubscribe())
  render(null,thBarHome)
  render(null,thBarComp)
  console.log("DESTROYED")
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

setDestruction(destructor); // destroys previous content script
main() // Let's go