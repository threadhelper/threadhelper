import { h, render, Component } from 'preact';
import ThreadHelper from '../components/ThreadHelper.jsx'
import { getMode, isSidebar } from '../utils/wutils.jsx'
import { getData, setData } from '../utils/dutils.jsx'
import { compose, curry, prop } from '../utils/fp.jsx';
import $ from 'jquery'


const trendText = '[aria-label="Timeline: Trending now"]';
const sideBarSelector = '[data-testid="sidebarColumn"]'

const editorClass = "DraftEditor-editorContainer";
const floatingComposeSelector = '[aria-labelledby="modal-header"] .DraftEditor-editorContainer' 

let activeSidebar = {}

// export function setUpSidebarRemovedListener(thBar){
//   var observer = new MutationObserver((mutationRecords, me)=>{onSidebarRemoved(thBar, mutationRecords, me)});
//   // this.observers.push(observer)
//   let dummy = document.getElementsByClassName('dummyContainer')[0]
//   console.log("setting up sidebar removed listener", dummy)
//   observer.observe(dummy, {childList: true});
//   return observer
// }


// export function onSidebarRemoved(thBar, mutationRecords, me){
//   let removed_nodes = [...mutationRecords.map(m=>[...m.removedNodes])]
//   console.log("Removed nodes ", removed_nodes)
//   let removed_sidebars = removed_nodes.flat().filter((r)=>{console.log(`removed sidebar `, r); return (r.getAttribute('class') == "dummyContainer")})
//   removed_sidebars.forEach(bar=>[... bar.getElementsByClassName('suggestionBox')].forEach(bar=>{
//     render(null, bar)
//     console.log("SIDEBAR REMOVED");
//     console.log("removed node", bar);
//   }));
//   if(removed_sidebars.length > 0) {
//     // setUpTrendsListener(thBar)
//     me.disconnect()
//   }
// }

// function setUpElementListener(foo){
//   if(getMode() != "other"){
//     console.log("setting up trends listener")
//     // var observer = new MutationObserver((mutationRecords, me)=>{foo(thBar, mutationRecords, me)});
//     // var observer = new MutationObserver((mutationRecords, me)=>{foo()});
//     var observer = new MutationObserver(()=>{foo()});
//     // this.observers.push(observer)
//     observer.observe(document, { subtree: true, childList: true});
//     return observer
//   }
//   return null
// }


// export const setUpFloatingComposeListener = (thBar, stream) => setUpElementListener(() => onFloatingComposeLoaded(thBar, stream))

// function onFloatingComposeLoaded(thBar, stream){
//   const floating = document.querySelector(floatingComposeSelector)
//   const is_compose = floating && floating.getElementsByClassName(editorClass).length > 0
//   if (is_compose && !isSidebar('compose')){
//     console.log("FLOATING COMPOSE APPEARED")
//     activateComposeSidebar(thBar, stream) //impure
//     // setUpSidebarRemovedListener(thBar)
//   }
// }


// export const setUpTrendsListener = (thBar, stream) => setUpElementListener(() => onTrendsLoaded(thBar, stream))

// export async function onTrendsLoaded(thBar, stream){

//   var trending_block = document.querySelector(trendText)
//   if (!isSidebar('home') && trending_block){
//     // console.log("SIDEBAR APPEARED")
//     activateHomeSidebar(thBar, stream) //impure
//     // setUpSidebarRemovedListener(thBar)
//     // me.disconnect()
//   }
// }


export function makeSidebarHome(){
  let thBar = document.createElement('div')
  thBar.setAttribute("class", 'sug_home');
  return thBar
}

// impure
export function injectSidebarHome(thBar){
  let trending_block = document.querySelector(trendText)
  if(typeof trending_block !== 'undefined' && trending_block != null)
  {
    let sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
    sideBar.insertBefore(thBar,sideBar.children[2])
  } 
}

// // impure
// export async function activateHomeSidebar(thBar = null, stream){
//   thBar = thBar != null ? thBar : makeSidebarHome()
//   injectSidebarHome(thBar) // impure
//   render(<ThreadHelper stream={stream}></ThreadHelper>, thBar);
// }

// export function hideComposeSidebar(thBarComp){
//   render(null, thBarComp)
//   let composeSidebars = [...document.getElementsByClassName('sug_compose')]
//   composeSidebars.forEach(c=>c.remove())
// }
/*
// export function manageSidebarPresence(old_mode,new_mode){
//   // console.log("managing sidebar presence", [old_mode, new_mode])
//   handleOldSidebar(old_mode)
//   handleNewSidebar(new_mode)
//   console.log("sidebar managed", activeSidebar)
//   return activeSidebar
// }

// export function handleOldSidebar(old_mode){
//   switch(old_mode){
//     case 'compose':
//       let composeSidebars = document.getElementsByClassName('sug_compose')
//       for (let c of composeSidebars){
//         c.remove()
//       }
//       break;
//     default:
//   }
// }

// export function handleNewSidebar(new_mode){
//   switch(new_mode){
//     case 'other':
//       break;
//     case 'compose':
//       if (!isSidebar('compose')){
//         activateComposeSidebar()
//       }
//       break;
//     default:
//       if(!isSidebar('home')){
//         setUpTrendsListener()
//       }else{
//         activateHomeSidebar()
//         // refreshSidebars()
//       }
//       break;
//   }
// }

*/


function makeDummyCompose(thBar){
  let dummies = document.getElementsByClassName('dummyContainer')
  let dummyUI = {}
  if (!([... dummies].length)) {
    dummyUI = $(`
      <div class="dummyContainer">
        <div class="dummyLeft"></div>
        <div id="suggestionContainer" class="dummyRight"></div>
      </div>
    `)[0]
    //console.log("trying to append dummy")
  } else{
    dummyUI = dummies[0]
  }
  dummyUI.getElementsByClassName("dummyRight")[0].append(thBar)
  return dummyUI
}

//for wutils
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


export function injectDummy(thBar){
  // '[aria-labelledby="modal-header"] .DraftEditor-editorContainer' 
  const floatingSelector = '[aria-labelledby="modal-header"]'
  const dummyUI = makeDummyCompose(thBar)
  // const floating_compose = document.querySelector(floatingComposeSelector)
  const floating_compose = document.querySelector(floatingSelector)
  // floating_compose.append(dummyUI)
  // document.body.append(dummyUI)
  insertAfter(dummyUI,floating_compose)
  return dummyUI
}

export function makeSidebarCompose(){
  let thBar = document.createElement('div')
  thBar.setAttribute("class", 'sug_compose');
  return thBar
}


// // export function activateComposeSidebar(thBar = null, stream){
// export function activateComposeSidebar(thBar = null, stream){
//   console.log("activating compose sidebar")
//   thBar = thBar != null ? thBar : makeSidebarCompose()
//   injectDummy(thBar)
//   render(<ThreadHelper stream={stream}></ThreadHelper>, thBar);
// }



import { obsAdded, obsRemoved } from '../utils/kefirMutationObs.jsx';
import { Kefir, fromEvents, stream } from 'kefir';
// Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
export function makeHomeSidebarObserver(thBar){
  // const trendAdd$ = stream(null)
  const trendAdd$ = obsAdded(document, trendText, true)
  // const trendRemove$ = stream(null)
  const trendRemove$ = obsRemoved(document, trendText, true)
  const sidebarOutDoc$ = fromEvents(thBar, 'DOMNodeRemovedFromDocument')


  const render$ = trendAdd$.filter(_=>!isSidebar('home')).map(_=>'render') //probably not great practice to put a filter that has nothing to do with the data flowing but fuck it
  const unrender$ = Kefir.merge([/*trendRemove$, */sidebarOutDoc$]).filter(_=>isSidebar('home')).map(_=>'unrender')
  
  const homeSidebarObserver$ = Kefir.merge([render$, unrender$])
  return homeSidebarObserver$
}

export function makeFloatSidebarObserver(thBar){

  // const floatAdd$ = stream(null)
  const floatAdd$ = obsAdded(document, floatingComposeSelector, true)//.filter(f=>f.target.getElementsByClassName(editorClass).length > 0)
  floatAdd$.log('float add')
  // const floatRemove$ = stream(null)
  const floatRemove$ = obsRemoved(document, floatingComposeSelector, true)
  const sidebarOutDoc$ = fromEvents(thBar, 'DOMNodeRemovedFromDocument')

  const render$ = floatAdd$.filter(_=>!isSidebar('compose')).map(_=>'render') //probably not great practice to put a filter that has nothing to do with the data flowing but fuck it
  const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).filter(_=>isSidebar('home')).map(_=>'unrender')
  
  const floatSidebarObserver$ = Kefir.merge([render$, unrender$])
  return floatSidebarObserver$
}
