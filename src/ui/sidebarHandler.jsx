import { h, render, Component } from 'preact';
import ThreadHelper from '../components/ThreadHelper.jsx'
import { getMode, isSidebar } from '../utils/wutils.jsx'
import { getData, setData } from '../utils/dutils.jsx'
import { flattenModule } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)
import $ from 'jquery'


const trendText = '[aria-label="Timeline: Trending now"]';
const sideBarSelector = '[data-testid="sidebarColumn"]'

const editorClass = "DraftEditor-editorContainer";
const floatingComposeSelector = '[aria-labelledby="modal-header"] .DraftEditor-editorContainer' 

let activeSidebar = {}


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


import { obsAdded, obsRemoved } from '../utils/kefirMutationObs.jsx';
import { Kefir, fromEvents, stream } from 'kefir';
// Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
export function makeHomeSidebarObserver(thBar){
  const trendAdd$ = obsAdded(document, trendText, true) // trendAdd$ :: Element // Trends element is added
  const trendRemove$ = obsRemoved(document, trendText, true) // trendAdd$ :: Element // Trends element is remove
  const sidebarOutDoc$ = fromEvents(thBar, 'DOMNodeRemovedFromDocument') // thBar node is removed from the document (by changing page or something)
  sidebarOutDoc$.log('sidebarOutDoc$')

  const render$ = Kefir.merge([trendAdd$]).filter(_=>!isSidebar('home')).map(_=>'render') //probably not great practice to put a filter that has nothing to do with the data flowing but fuck it
  const unrender$ = Kefir.merge([/*trendRemove$, */sidebarOutDoc$]).filter(_=>!isSidebar('home')).map(_=>'unrender')
  
  const homeSidebarObserver$ = Kefir.merge([render$, unrender$])
  return homeSidebarObserver$
}

export const removeHomeSidebar = () => {
  console.log('removing sidebar')
  const sugHomes = [...document.getElementsByClassName('sug_home')]
  sugHomes.forEach(x=>x.remove())
}

export function makeFloatSidebarObserver(thBar){

  // const floatAdd$ = stream(null)
  const floatAdd$ = obsAdded(document, floatingComposeSelector, true)//.filter(f=>f.target.getElementsByClassName(editorClass).length > 0)
  // floatAdd$.log('float add')
  // const floatRemove$ = stream(null)
  const floatRemove$ = obsRemoved(document, floatingComposeSelector, true)
  const sidebarOutDoc$ = fromEvents(thBar, 'DOMNodeRemovedFromDocument')

  const render$ = floatAdd$.filter(_=>!isSidebar('compose')).map(_=>'render') //probably not great practice to put a filter that has nothing to do with the data flowing but fuck it
  // const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).filter(_=>isSidebar('home')).map(_=>'unrender')
  // const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).filter(_=>isSidebar('home')).map(_=>'unrender')
  const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).map(_=>'unrender')
  
  const floatSidebarObserver$ = Kefir.merge([render$, unrender$])
  return floatSidebarObserver$
}
