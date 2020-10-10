import { getMode, getTweetId, isFocused, elIntersect } from '../utils/wutils.jsx';
import { msgBG } from '../utils/dutils.jsx';
import { onRoboClick } from '../components/Robo.jsx';
import Kefir, { sequentially } from 'kefir';
import { flattenModule, inspect } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)

const dateSelector = 'a time'
const editorClass = "DraftEditor-editorContainer"
const editorSelector = ".DraftEditor-editorContainer"
const tweetButtonSelectors = '[data-testid="tweetButtonInline"], [data-testid="tweetButton"]'
const sideBarSelector = '[data-testid="sidebarColumn"]'
export const rtConfirmSelector = '[data-testid="retweetConfirm"]'
export const unRtConfirmSelector = '[data-testid="unretweetConfirm"]'
const deleteConfirmSelector = '[data-testid="confirmationSheetConfirm"]'
// const bookmarkButtonSelector ='#layers > div.css-1dbjc4n.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > span'
// const bookmarkRemoveSelector ='#layers > div.css-1dbjc4n.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > span'
const shareMenuItemSelector = '[role=menu] div[role=menuitem]'
const replySelector = 'div[aria-label~="Reply"]'
// const tweetCardSelector = 'article div[data-testid="tweet"]'
const tweetCardSelector = 'article'

export let isRtFocused = ()=>isFocused(rtConfirmSelector)
export let isUnRtFocused = ()=>isFocused(unRtConfirmSelector)
let isDeleteFocused = ()=>isFocused(deleteConfirmSelector)
export let isComposeFocused = ()=>isFocused(editorSelector)
let isTweetCardFocused = ()=>isFocused(tweetCardSelector)

// true if button is clicked
// export function buttonClicked(selector){
//   let divs = document.querySelectorAll(selector)
//   for (let div of divs){
//     if(e.target && div.contains(e.target) || e.target.contains(div)){
//       return true
//     }
//   }
//   return false
// }

// true if button is clicked
export function buttonClicked(target, selector, parent = null){
  parent = parent == null ? document : parent
  // return [...parent.querySelectorAll(selector)].some((el)=> containsOrContained(target, el))
  return [...parent.querySelectorAll(selector)].some((el)=> el.contains(target))
}

// Cond streamClickCond :: (Selector -> Event) -> Bool
const clickCondStream = curry((parent, selector, e)=>buttonClicked(e.target,selector, parent))
const docClickCondStream = clickCondStream(document)
// Cond fromClick :: Cond -> Stream (Event)
const fromClick = cond => Kefir.fromEvents(document.body,'click').filter(cond)
// Cond fromShortcut :: Cond -> Stream (Event)
const fromShortcut = cond => Kefir.fromEvents(document.body,'keydown').filter(cond)
// Stream streamInput :: (Cond -> Cond) -> Stream (Event)
const inputStream = curry((shortCond, clickCond) => {
  const s = fromShortcut(shortCond)
  const c = fromClick(clickCond) 
  return Kefir.merge([s, c])
}) 


// stream tweet posting events
export function makePostStream(){
  // Cond :: Event -> Bool
  const tweetShortCond = e => (e.ctrlKey && e.key === 'Enter' && isComposeFocused()) 
  const tweetStream =  inputStream(tweetShortCond, docClickCondStream(tweetButtonSelectors)).map(x=>'tweet')
  return tweetStream
}

// stream rt events
export function makeRtStream(){
  // Cond :: Event -> Bool
  const rtShortCond = e => (e.key === 'Enter' && isRtFocused())
  const rtStream =  inputStream(rtShortCond, docClickCondStream(rtConfirmSelector)).map(x=>'rt')
  return rtStream
}

// stream undo rt events
export function makeUnRtStream(){
  // Cond :: Event -> Bool
  const unRtShortCond = e => (e.key === 'Enter' && isUnRtFocused())
  const unRtStream =  inputStream(unRtShortCond, docClickCondStream(unRtConfirmSelector)).map(x=>'unrt')
  return unRtStream
}

// stream tweet delete events
export function makeDeleteStream(){
  // Cond :: Event -> Bool
  const deleteShortCond = e => (e.key === 'Enter' && isDeleteFocused()) 
  const deleteStream =  inputStream(deleteShortCond, docClickCondStream(deleteConfirmSelector)).map(x=>'delete')
  return deleteStream
}
// stream tweet delete events
export function makeDeleteEventStream(){
  // Cond :: Event -> Bool
  const deleteShortCond = e => (e.key === 'Enter' && isDeleteFocused()) 
  const deleteStream =  inputStream(deleteShortCond, docClickCondStream(deleteConfirmSelector))
  return deleteStream
}

// stream robo shortcut events
export function makeRoboStream(){
  // Cond :: Event -> Bool
  const roboShortCond = e => (e.ctrlKey && e.key === ' ' && isComposeFocused()) 
  const roboStream =  fromShortcut(roboShortCond).map(x=>'robo').throttle(1000)
  return roboStream
}

// stream tweet bookmark adds events
// () -> event
export const makeAddBookmarkStream = () => {
  const bookmarkShortCond = e => (e.key === 'b' && isTweetCardFocused()) 
  return inputStream(bookmarkShortCond, docClickCondStream(shareMenuItemSelector)).filter(e=>e.target.textContent.includes('Add'))//.map(x=>'bookmark')
}
// () -> event
export function makeRemoveBookmarkStream(){
  return fromClick(docClickCondStream(shareMenuItemSelector)).filter(e=>e.target.textContent.includes('Remove'))//.map(x=>'remove_bookmark')
}


// tweet posting actions
export function makeActionStream(){  
  return Kefir.merge([
    makePostStream(), 
    makeRtStream(), 
    makeUnRtStream(), 
    // makeDeleteStream(),
    // makeBookmarkStream()
  ])
}

export function makeComposeFocusObs(){
  const focusIn = Kefir.fromEvents(document.body, 'focusin').filter(_ => getMode() != "other").filter(_=>isFocused(editorSelector))//.map(_=>'focused')
  const focusOut = Kefir.fromEvents(document.body, 'focusout').filter(_ => getMode() != "other").filter(e=>elIntersect(editorSelector, e.target)).map(_=>'unfocused')
  const focusObs = Kefir.merge([focusIn, focusOut])

  return focusObs 
}


// Returns a property (has a current value), not a stream
export function makeReplyObs(mode$){
  const replyClickCond = docClickCondStream(replySelector)
  const replyShortCond = e => (e.key === 'r' && isTweetCardFocused()) 
  const reply$ = inputStream(replyShortCond, replyClickCond)
  const notReplying$ =  mode$.filter(m=>m!='compose').map(_=>null)
  // const replyObs$ = Kefir.merge([reply$, notReplying$]).skipDuplicates()
  const replyObs$ = Kefir.merge([reply$]).skipDuplicates()
  return replyObs$
}

// actionEl2TweetEl :: element -> element
function actionEl2TweetEl(replyEl){
  return replyEl.closest(tweetCardSelector)
}

// hasDate :: element -> Bool
const hasDate = el => el.querySelectorAll(dateSelector).length > 0 


export const makeLastClickedObs = ()=>
  fromClick(docClickCondStream('article *'))

// getHostTweetId :: lastStatus$ -> event -> id
// Gets the id of the tweet on which an action  (the event) is being performed
export const getHostTweetId = curry((lastStatus$, e) => {
  // if(!(e != null)) return null //if null, we're not replying to anything
  return pipe(
    prop('target'),
    actionEl2TweetEl,
    ifElse(
      isNil,
      _=>null,
      ifElse(
        hasDate,
        getTweetId,
        _=> lastStatus$.currentValue()
      )
    )
  )(e)
})



Kefir.Property.prototype.currentValue = function() {
  var result;
  var save = function(x) {
    result = x;
  };
  this.onValue(save);
  this.offValue(save);
  return result;
};