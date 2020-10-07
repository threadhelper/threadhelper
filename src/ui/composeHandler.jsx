import { getMode, isSidebar, url_regex } from '../utils/wutils.jsx';
import { msgBG, setData } from '../utils/dutils.jsx';


// We use this to find the tweet editor
let editorClass = "DraftEditor-editorContainer";
let editorSelector = ".DraftEditor-editorContainer";
// We use this to detect changes in the text of a tweet being composed
let textFieldClass = 'span[data-text="true"]';

// Detect when the compose box loses focus
export function onFocusOut(e){
  var divs = document.getElementsByClassName(editorClass)
  for (var div of divs){
    if(e.target && div.contains(e.target)){
      if(getMode() != "other") composeBoxUnfocused(div)
    }
  }
}

// When a text box is focused, needed for thread-screen scenario 
export function composeBoxFocused(compose_box){
  let text_field = getTextField(compose_box)
  activeComposer = compose_box
  activeLogger = addLogger(text_field)
  // this.refreshSidebars()
}

// Detect when the compose box is focused
export function onFocusIn(e){
  var compose_divs = document.getElementsByClassName(editorClass)
  for (var div of compose_divs){
    if(e.target && div.contains(e.target)){
      if(getMode() != "other") composeBoxFocused(div)
    }
  }
}

// given composer found by editorClass = "DraftEditor-editorContainer",
// outputs grandparent of const textFieldClass = 'span[data-text="true"]'
export function getTextField(compose_box){
  //return compose_box.firstElementChild.firstElementChild.firstElementChild.firstElementChild
  return compose_box.firstElementChild.firstElementChild
}

//** Attach a mutation observer to a div */
export function addLogger(div) {
  // console.log("adding logger")
  var observer = new MutationObserver(onChange);
  // observers.push(observer)
  observer.observe(div, { characterData: true, subtree: true, childList: true }); //attribute: true
  return observer
}

// What to do when compose box becomes unfocused
export function composeBoxUnfocused(compose_box){
  activeLogger.disconnect()
}


/** Updates the tweetlist when user types */
// put semaphore here?
export async function onChange(mutationRecords) {
  const clean_text = cleanSearchString(getTextFromElement(mutationRecords[0].target))
  if(clean_text.length > 0){
    requestSearch(clean_text) 
  } else{
    clearSearchResults()
  }
  // setData({search_query: clean_text}).then(()=>{console.log("CHANGE! text is:", clean_text, "; in element: ", mutationRecords[0].target);})
}

// takes the elements from mutation records, joins the text from each line
function getTextFromElement(tgt){
  //const text = mutationRecords[0].target.wholeText
  const t_fields = document.querySelectorAll(textFieldClass)
  var daddy = null

  if (tgt.tagName == "DIV") {daddy = tgt}                 //when newline
  else if (tgt.tagName !== "SPAN") {                       //if tgt is final text element - happens when you write
    daddy = tgt.parentNode.parentNode.parentNode.parentNode.parentNode
  }
  else if (!(tgt in t_fields)) {                           //when backspace the tgt is the grandparent span of the text element
    daddy = tgt.parentNode.parentNode.parentNode
  }

  // var text = ''
  // //console.log("daddy: ", daddy)
  // for (var ch of daddy.children){
  //   text += ch.textContent + '\n'
  // }

  return join('\n',map(prop(textContent),daddy.children))
}

function cleanSearchString(text){
  return text.replace(url_regex, "").trim()
}

function requestSearch(clean_text){
  if(isSidebar('home') || isSidebar('compose')){
    msgBG({type:"search", query: clean_text})
  }
}

function clearSearchResults(){
  setData({'search_results': []})
}


import { obsAdded, obsRemoved, obsCharData } from '../utils/kefirMutationObs.jsx';
import { Kefir, fromEvents, stream } from 'kefir';
import { flattenModule } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(window,R)

export function makeComposeObs(box){
  const textChange$ = obsCharData(box, `${editorSelector} span`)
  // const query$ = textChange$.map(_=>box.innerText).map(cleanSearchString).toProperty(()=>'')
  const query$ = textChange$.map(_=>box.innerText).map(cleanSearchString).toProperty(()=>box.innerText)
  
  return query$
}