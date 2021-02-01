import { fromEvents, Kefir } from 'kefir';
import { isNil } from 'ramda'; // Logic, Type, Relation, String, Math
import { obsAdded, obsRemoved } from '../utils/kefirMutationObs';
import { isSidebar } from '../utils/wutils';
const trendText = '[aria-label="Timeline: Trending now"]';
const sideBarSelector = '[data-testid="sidebarColumn"]';
const editorClass = 'DraftEditor-editorContainer';
const floatingComposeSelector =
  '[aria-labelledby="modal-header"] .DraftEditor-editorContainer';
let activeSidebar = {};
export function makeSidebarHome() {
  let thBar = document.createElement('div');
  thBar.setAttribute('class', 'sug_home');
  return thBar;
}
// impure
export function injectSidebarHome(thBar: Element) {
  let trending_block = document.querySelector(trendText);
  if (!isNil(trending_block)) {
    let sideBar =
      trending_block.parentNode.parentNode.parentNode.parentNode.parentNode;
    sideBar.insertBefore(thBar, sideBar.children[2]);
    // isNil(sideBar.children[2]) ? null : sideBar.insertBefore(thBar, sideBar.children[2]);
    sideBar.insertBefore(thBar, sideBar.children[2]);
  }
}

function makeNewDummy() {
  const dummyUI: Element = document.createElement('div');
  dummyUI.className = 'dummyContainer';
  const dummyLeft: Element = document.createElement('div');
  dummyLeft.className = 'dummyLeft';
  const dummyRight: Element = document.createElement('div');
  dummyRight.className = 'dummyRight';
  dummyRight.id = 'suggestionContainer';
  dummyUI.appendChild(dummyLeft);
  dummyUI.appendChild(dummyRight);
  return dummyUI;
}

function makeDummyCompose(thBar: Element): Element | null {
  let dummies: Element[] = Array.from(
    document.getElementsByClassName('dummyContainer')
  );
  let dummyUI: Element = document.createElement('div');
  if (!Array.from(dummies).length) {
    //     dummyUI = $(`
    //   <div class="dummyContainer">
    //     <div class="dummyLeft"></div>
    //     <div id="suggestionContainer" class="dummyRight"></div>
    //   </div>
    // `)[0];
    dummyUI = makeNewDummy();
  } else {
    dummyUI = dummies[0];
  }
  (dummyUI as any).getElementsByClassName('dummyRight')[0].append(thBar);
  return dummyUI;
}
//for wutils
function insertAfter(newNode: Element, referenceNode: Element) {
  // console.log('[DEBUG] insertBefore', { referenceNode, newNode });
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); // if referenceNode.nextSibling is null, it inserts at the end
}

export function injectDummy(thBar: Element): Element {
  const floatingSelector = '[aria-labelledby="modal-header"]';
  const dummyUI = makeDummyCompose(thBar);
  const floating_compose = document.querySelector(floatingSelector);
  // isNil(floating_compose) ? null : insertAfter(dummyUI, floating_compose);#
  if (isNil(floating_compose)) {
    console.log('[ERROR] no floating composer element');
  }
  // console.log('[DEBUG] injecting dummy', { dummyUI, floating_compose });
  insertAfter(dummyUI, floating_compose);
  return dummyUI;
}
export function makeSidebarCompose(): Element {
  let thBar = document.createElement('div');
  thBar.setAttribute('class', 'sug_compose');
  return thBar;
}
// Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
export function makeHomeSidebarObserver(
  thBar: EventTarget | NodeJS.EventEmitter | { on: Function; off: Function }
) {
  // console.log('[DEBUG] makeHomeSidebarObserver 0', { thBar });
  const trendAdd$ = obsAdded(document, trendText, true); // trendAdd$ :: Element // Trends element is added
  const trendRemove$ = obsRemoved(document, trendText, true); // trendAdd$ :: Element // Trends element is remove
  const sidebarOutDoc$ = fromEvents(thBar, 'DOMNodeRemovedFromDocument'); // thBar node is removed from the document (by changing page or something)
  sidebarOutDoc$.log('sidebarOutDoc$');
  const render$ = Kefir.merge([trendAdd$])
    .filter((_) => !isSidebar('home'))
    .map((_) => 'render'); //probably not great practice to put a filter that has nothing to do with the data flowing but fuck it
  const unrender$ = Kefir.merge([/*trendRemove$, */ sidebarOutDoc$])
    .filter((_) => !isSidebar('home'))
    .map((_) => 'unrender');
  const homeSidebarObserver$ = Kefir.merge([render$, unrender$]);
  // console.log('[DEBUG] makeHomeSidebarObserver 1', {
  //   thBar,
  //   trendAdd$,
  //   sidebarOutDoc$,
  //   render$,
  //   unrender$,
  //   homeSidebarObserver$,
  // });
  return homeSidebarObserver$;
}
export const removeHomeSidebar = () => {
  // console.log('removing sidebar');
  const sugHomes = [...document.getElementsByClassName('sug_home')];
  sugHomes.forEach((x: { remove: () => void }) => x.remove());
};
export function makeFloatSidebarObserver(
  thBar: EventTarget | NodeJS.EventEmitter | { on: Function; off: Function }
) {
  // const floatAdd$ = stream(null)
  // console.log('[DEBUG] makeFloatSidebarObserver 0', { thBar });
  const floatAdd$ = obsAdded(document, floatingComposeSelector, true); //.filter(f=>f.target.getElementsByClassName(editorClass).length > 0)
  // floatAdd$.log('float add')
  // const floatRemove$ = stream(null)
  const floatRemove$ = obsRemoved(document, floatingComposeSelector, true);
  const sidebarOutDoc$ = fromEvents(thBar, 'DOMNodeRemovedFromDocument');
  const render$ = floatAdd$
    .filter((_) => !isSidebar('compose'))
    .map((_) => 'render'); //probably not great practice to put a filter that has nothing to do with the data flowing but fuck it
  // const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).filter(_=>isSidebar('home')).map(_=>'unrender')
  // const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).filter(_=>isSidebar('home')).map(_=>'unrender')
  const unrender$ = Kefir.merge([floatRemove$, sidebarOutDoc$]).map(
    (_) => 'unrender'
  );
  const floatSidebarObserver$ = Kefir.merge([render$, unrender$]);
  return floatSidebarObserver$;
}
