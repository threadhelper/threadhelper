import { Curry } from 'Function/_api';
import Kefir, { Observable } from 'kefir';
// flattenModule(global,R)
import {
  curry,
  defaultTo,
  equals,
  find,
  ifElse,
  isNil,
  map,
  pipe,
  prop,
} from 'ramda'; // Function
import { curProp, UrlModes } from '../types/types';
import { currentValue } from '../utils/putils';
import { getTweetId } from './openTweetReader';
import { getTwitterPageMode } from './twitterPageReader';
import { elContained, elIntersect, isFocused } from './domUtils';
(Kefir.Property.prototype as any).currentValue = currentValue;
const tweetHeaderSelector = '[data-testid="tweet"]';
const dateSelector = 'a time';
const editorClass = 'DraftEditor-editorContainer';
const editorSelector = '.DraftEditor-editorContainer';
const tweetButtonSelectors =
  '[data-testid="tweetButtonInline"], [data-testid="tweetButton"]';
const sideBarSelector = '[data-testid="sidebarColumn"]';
export const rtConfirmSelector = '[data-testid="retweetConfirm"]';
export const unRtConfirmSelector = '[data-testid="unretweetConfirm"]';
const deleteConfirmSelector = '[data-testid="confirmationSheetConfirm"]';
// const bookmarkButtonSelector ='#layers > div.css-1dbjc4n.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > span'
// const bookmarkRemoveSelector ='#layers > div.css-1dbjc4n.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d > div > div > div > div:nth-child(2) > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2 > div > span'
const shareMenuItemSelector = '[role=menu] div[role=menuitem]';
const replySelector = 'div[aria-label~="Reply"]';
// const tweetCardSelector = 'article div[data-testid="tweet"]'
const tweetCardSelector = 'article';
export let isRtFocused = () => isFocused(rtConfirmSelector);
export let isUnRtFocused = () => isFocused(unRtConfirmSelector);
let isDeleteFocused = () => isFocused(deleteConfirmSelector);
export let isComposeFocused = () => isFocused(editorSelector);
let isTweetCardFocused = () => isFocused(tweetCardSelector);

type ElParent = Element | Document | null;
type InputCond = (e: MouseEvent | KeyboardEvent) => boolean;

// not using, doing lookups instead.
export function getShowTweetText() {
  const tweetHeads = document.querySelectorAll(tweetHeaderSelector);
  const tweetEl = (x) => x.nextSibling;
  const tweetEls = map((x: Element) => x.nextSibling);
  const tweetElId = (el) => {
    return el;
  };
  const idFromUrl = (url) => {
    return url;
  };
  const isOpenTweet = (el) => {
    return tweetElId(el) == window.location.href;
  };
  const tweetText = (t) => t.firstChild.textContent;
  return defaultTo(
    '',
    tweetText(find(pipe(tweetEl, isOpenTweet), Array.from(tweetHeads)))
  );
}

export function buttonClicked(
  target: EventTarget | Element,
  selector: string,
  parent: ElParent = null
): boolean {
  parent = parent == null ? document : parent;
  // return [...parent.querySelectorAll(selector)].some((el)=> containsOrContained(target, el))
  return Array.from(parent.querySelectorAll(selector)).some(
    (el: { contains: (arg0: any) => unknown }) => el.contains(target)
  );
}
const clickCondStream = curry(
  (parent: ElParent, selector: string, e: Event): boolean =>
    buttonClicked(e.target, selector, parent)
);
const docClickCondStream = clickCondStream(document);
// Cond fromClick :: Cond -> Stream (Event)
const fromClick = (cond: InputCond) =>
  Kefir.fromEvents<MouseEvent | KeyboardEvent, Error>(
    document.body,
    'click'
  ).filter(cond);
// Cond fromShortcut :: Cond -> Stream (Event)
const fromShortcut = (cond: InputCond) =>
  Kefir.fromEvents<MouseEvent | KeyboardEvent, Error>(
    document.body,
    'keydown'
  ).filter(cond);
// Stream streamInput :: (Cond -> Cond) -> Stream (Event)
const inputStream = curry(
  (
    shortCond: {
      (e: any): any;
      (value: unknown): value is unknown;
    },
    clickCond: Curry<(e: any) => any> & ((e: any) => any)
  ) => {
    const s = fromShortcut(shortCond);
    const c = fromClick(clickCond);
    return Kefir.merge([s, c]);
  }
);
// stream tweet posting events
export function makePostStream() {
  // Cond :: Event -> Bool
  const tweetShortCond = (e: KeyboardEvent): boolean =>
    e.ctrlKey && e.key === 'Enter' && isComposeFocused();
  const tweetStream = inputStream(
    tweetShortCond,
    docClickCondStream(tweetButtonSelectors)
  ).map((_) => 'tweet');
  return tweetStream;
}
// stream rt events
export function makeRtStream() {
  // Cond :: Event -> Bool
  const rtShortCond = (e: { key: string }) =>
    e.key === 'Enter' && isRtFocused();
  const rtStream = inputStream(
    rtShortCond,
    docClickCondStream(rtConfirmSelector)
  ).map((x) => 'rt');
  return rtStream;
}
// stream undo rt events
export function makeUnRtStream() {
  // Cond :: Event -> Bool
  const unRtShortCond = (e: { key: string }) =>
    e.key === 'Enter' && isUnRtFocused();
  const unRtStream = inputStream(
    unRtShortCond,
    docClickCondStream(unRtConfirmSelector)
  ).map((x) => 'unrt');
  return unRtStream;
}
// stream tweet delete events
export function makeDeleteStream() {
  // Cond :: Event -> Bool
  const deleteShortCond = (e: { key: string }) =>
    e.key === 'Enter' && isDeleteFocused();
  const deleteStream = inputStream(
    deleteShortCond,
    docClickCondStream(deleteConfirmSelector)
  ).map((x) => 'delete');
  return deleteStream;
}
// stream tweet delete events
export function makeDeleteEventStream() {
  // Cond :: Event -> Bool
  const deleteShortCond = (e: { key: string }) =>
    e.key === 'Enter' && isDeleteFocused();
  const deleteStream = inputStream(
    deleteShortCond,
    docClickCondStream(deleteConfirmSelector)
  );
  return deleteStream;
}
// stream robo shortcut events
export function makeRoboStream() {
  // Cond :: Event -> Bool
  const roboShortCond = (e: { ctrlKey: any; key: string }) =>
    e.ctrlKey && e.key === ' ' && isComposeFocused();
  const roboStream = fromShortcut(roboShortCond)
    .map((x) => 'robo')
    .throttle(1000);
  return roboStream;
}
// stream tweet bookmark adds events
// () -> event
export const makeAddBookmarkStream = () => {
  const bookmarkShortCond = (e: { key: string }) =>
    e.key === 'b' && isTweetCardFocused();
  return inputStream(
    bookmarkShortCond,
    docClickCondStream(shareMenuItemSelector)
  ).filter((e) => e.target.textContent.includes('Add')); //.map(x=>'bookmark')
};
// () -> event
export function makeRemoveBookmarkStream() {
  return fromClick(docClickCondStream(shareMenuItemSelector)).filter((e) =>
    e.target.textContent.includes('Remove')
  ); //.map(x=>'remove_bookmark')
}
// tweet posting actions
export function makeActionStream() {
  return Kefir.merge([makePostStream(), makeRtStream(), makeUnRtStream()]);
}
export function makeComposeFocusObs(): Observable<FocusEvent, any>[] {
  const focusIn = Kefir.fromEvents<FocusEvent, any>(document.body, 'focusin')
    .filter((_) => getTwitterPageMode() != UrlModes.other)
    .filter((e: FocusEvent) => {
      return elContained(editorSelector, e.target as Element);
    }); //.map(_=>'focused')
  const focusOut = Kefir.fromEvents<FocusEvent, any>(document.body, 'focusout')
    .filter((_) => getTwitterPageMode() != UrlModes.other)
    .filter((e: FocusEvent) =>
      elIntersect(editorSelector, e.target as Element)
    ); //.map(_ => 'unfocused') ;
  // const focusObs = Kefir.merge([focusIn, focusOut]);
  return [focusIn, focusOut];
  // return focusObs;
}
// Returns a property (has a current value), not a stream
export function makeReplyObs(mode$: Observable<UrlModes, Error>) {
  const replyClickCond = docClickCondStream(replySelector);
  const replyShortCond = (e: { key: string }) =>
    e.key === 'r' && isTweetCardFocused();
  const reply$ = inputStream(replyShortCond, replyClickCond);
  const notReplying$ = mode$.filter(equals(UrlModes.compose)).map((_) => null);
  // const replyObs$ = Kefir.merge([reply$, notReplying$]).skipDuplicates()
  const replyObs$ = Kefir.merge([reply$]).skipDuplicates();
  return replyObs$;
}
// actionEl2TweetEl :: element -> element
function actionEl2TweetEl(replyEl: { closest: (arg0: string) => any }) {
  return replyEl.closest(tweetCardSelector);
}
// hasDate :: element -> Bool
const hasDate = (el: {
  querySelectorAll: (arg0: string) => {
    (): any;
    new (): any;
    length: number;
  };
}) => el.querySelectorAll(dateSelector).length > 0;
export const makeLastClickedObs = () =>
  fromClick(docClickCondStream('article *'));
// getHostTweetId :: lastStatus$ -> event -> id
// Gets the id of the tweet on which an action  (the event) is being performed
export const getHostTweetId = curry(
  (lastStatus$: curProp<UrlModes>, e: Event): string => {
    // if(!(e != null)) return null //if null, we're not replying to anything
    return pipe(
      prop('target'),
      actionEl2TweetEl,
      ifElse(
        isNil,
        (_) => null,
        ifElse(hasDate, getTweetId, (_) => lastStatus$.currentValue())
      )
    )(e);
  }
);
(Kefir.Property.prototype as any).currentValue = function () {
  var result;
  var save = function (x) {
    result = x;
  };
  this.onValue(save);
  this.offValue(save);
  return result;
};
