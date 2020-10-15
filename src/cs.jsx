/* CS is here to manage the presence of components and events they're not supposed to access.

. Process messages from BG
. Create Sidebar
. Inject Sidebar into twitter pages when appropriate
. Remove Sidebar from twitter pages when appropriate
. manage information about twitter use (inited in initLocalStorage)
. manage inputs in twitter use
. define destruction and dispatch its event on start up
*/
// 
import "@babel/polyfill";
import { h, render, Component } from 'preact';
// import { useState, useCallback } from 'preact/hooks';
import { flattenModule, inspect, toggleDebug, currentValue, nullFn } from './utils/putils.jsx'
import { updateTheme, getMode, isSidebar, getIdFromUrl, getCurrentUrl } from './utils/wutils.jsx'
import { getData, setData, msgBG, makeGotMsgObs, makeStorageObs, getOptions, requestRoboTweet } from './utils/dutils.jsx';
import { makeRoboStream, makeActionStream, makeComposeFocusObs, makeReplyObs, getHostTweetId, makeLastClickedObs, makeAddBookmarkStream, makeRemoveBookmarkStream, makeDeleteEventStream } from './ui/inputsHandler.jsx'
import { removeHomeSidebar, makeSidebarHome, makeSidebarCompose, makeHomeSidebarObserver, makeFloatSidebarObserver, injectSidebarHome, injectDummy } from './ui/sidebarHandler.jsx'
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
// const activateSidebar = curry( (floatSidebarStream, inject, bar, thStreams) => {
//   inject(bar); render(<ThreadHelper streams={thStreams} float={floatSidebarStream}></ThreadHelper>, bar); })
const activateSidebar = curry( (inject, bar, thStreams) => {
  inject(bar); render(<ThreadHelper streams={thStreams}></ThreadHelper>, bar); })
const activateFloatSidebar = activateSidebar(injectDummy, thBarComp)
const activateHomeSidebar = activateSidebar(injectSidebarHome, thBarHome)
const deactivateSidebar = (bar) => { render(null, bar) }


// Webpage events
const makeIdObsMsg = curry((lastClickedId$, type) => {return {type:type, id:lastClickedId$.currentValue()}})
const getBgColor = x=>x.style.backgroundColor
const minIdleTime = 3000;

// Effects 
const handlePosting = ()=>msgBG({type:'update-tweets'}) // handle twitter posting actions like tweets, rts and deletes
// 

// Stream clean up
const subscriptions = []
const rememberSub = (sub) => {subscriptions.push(sub); return sub}
const subObs = (obs, effect) => rememberSub(obs.observe({value:effect}))

const _onLoad = () => onLoad(thBarHome, thBarComp)
function main(){
  window.addEventListener('load', _onLoad, true);  
}
async function onLoad(thBarHome, thBarComp){
  msgBG({type:"cs-created"})
  // Define streams
    // messages
  const gotMsg$ = makeGotMsgObs().map(x=>x.m)
  const urlChange$ = gotMsg$.filter(m => m.type == "tab-change-url")
  // urlChange$.log('urlChange$')
  const mode$ = urlChange$.map(m=>getMode(m.url))
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
  // const composeQuery$ = composeFocus$.filter(x => x != 'unfocused').flatMapLatest(e=>makeComposeObs(e.target)).toProperty(()=>'')
  // const composeUnfocused$ = composeFocus$.filter(equals('unfocused')).map(_=>'')
  const composeUnfocused$ = urlChange$.map(_=>'')
  const composeContent$ = composeFocus$.filter(x => x != 'unfocused').flatMapLatest(e=>makeComposeObs(e.target))
  const composeQuery$ = Kefir.merge([composeUnfocused$, composeContent$]).toProperty(()=>'')
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
  // const updateFloat = value => value == 'render' ? activateFloatSidebar(thStreams) : deactivateSidebar(thBarComp) //function
  // const updateHome = value => value == 'render' ? activateHomeSidebar(thStreams) : deactivateSidebar(thBarHome) //function
  const updateFloat = value => value ? activateFloatSidebar(thStreams) : deactivateSidebar(thBarComp) //function
  const updateHome = value => value ? activateHomeSidebar(thStreams) : deactivateSidebar(thBarHome) //function
  const floatSidebar$ = makeFloatSidebarObserver(thBarComp) // floatSidebar$ :: String || Element  // for floating sidebar in compose mode
  floatSidebar$.log('floatSidebar$')
  const floatActive$ = floatSidebar$.map(equals('render')).toProperty(()=>false) // floatActive$ ::Bool
  floatActive$.log('floatActive$')

  const homeSidebar$ = makeHomeSidebarObserver(thBarHome) // homeSidebar$ :: String || Element // for main site sidebar over recent trends
  homeSidebar$.log('homeSidebar$')
  const homeActive$ = homeSidebar$.map(equals('render')).toProperty(()=>false) // homeActive$ ::Bool
  homeActive$.log('homeActive$')

  
  // floatActive$.onValue(x=>x?deactivateSidebar(thBarHome):nullFn)  
  const homeActiveSafe$ = Kefir.combine([homeActive$, floatActive$.map(not)], and)
  homeActiveSafe$.log('homeActiveSafe$')
  

  // Effects from streams
    // Actions
  targetedTweetActions$.log('targetedTweetActions')
  subObs(lastClickedId$, _=>{})
  subObs(composeQuery$, nullFn)
  subObs(actions$.delay(1000), _=>{handlePosting()})
  subObs(targetedTweetActions$, pipe(makeIdMsg, msgBG))
  subObs(theme$, updateTheme)
  // subObs(robo$, _=>requestRoboTweet(composeQuery$.currentValue(), replyTo$.currentValue()))
    // Render Sidebar 
  // subObs(floatSidebar$, updateFloat)
  subObs(floatActive$, updateFloat)
  // subObs(homeSidebar$, updateHome)
  subObs(homeActiveSafe$, updateHome)

  
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