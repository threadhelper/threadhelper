import { fromEvents, Kefir, Observable } from 'kefir';
import { isNil } from 'ramda'; // Logic, Type, Relation, String, Math
import { obsAdded, obsRemoved } from '../utils/kefirMutationObs';
import { isSidebar } from '../read-twitter-page/sidebarReader';
const trendText = '[aria-label="Timeline: Trending now"]';
const searchBarSelector = '[data-testid="SearchBox_Search_Input"] ';
const sideBarSelector = '[data-testid="sidebarColumn"]';
const editorClass = 'DraftEditor-editorContainer';
const floatingComposeSelector =
  '[aria-labelledby="modal-header"] .DraftEditor-editorContainer';
// const lameSidebarContentSelector = ':not(.sug_home, .sug_home *)';
const lameSidebarContentSelector = ':not(.sug_home)';
let activeSidebar = {};
export function makeSidebarHome() {
  let thBar = document.createElement('div');
  thBar.setAttribute('class', 'sug_home');
  return thBar;
}
// impure
export function injectSidebarHome(thBar: Element) {
  let sidebarElement = document.querySelector(sideBarSelector);
  if (!isNil(sidebarElement)) {
    let innerSidebar =
      sidebarElement.firstElementChild.lastElementChild.firstElementChild
        .firstElementChild.firstElementChild;
    innerSidebar.insertBefore(thBar, innerSidebar.firstElementChild);
    // sideBar.insertBefore(thBar, sideBar.children[2]);
    // sideBar.insertBefore(thBar, sideBar.children[2]);
  }
}

// export function injectSidebarHome(thBar: Element) {
//   let trending_header = document.querySelector(trendText);
//   if (!isNil(trending_header)) {
//     let trending_block =
//       trending_header.parentNode.parentNode.parentNode.parentNode;
//     let sideBar = trending_block.parentNode;
//     sideBar.insertBefore(thBar, trending_block);
//     // sideBar.insertBefore(thBar, sideBar.children[2]);
//     // sideBar.insertBefore(thBar, sideBar.children[2]);
//   }
// }

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

// // Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
// export function makeSidebarObserver(): Observable<Element, any> {
//   const sidebarAdd$: Observable<Element, any> = obsAdded(
//     document,
//     sideBarSelector,
//     true
//   ).toProperty(() => document.querySelector(sideBarSelector));
//   console.log('makeSidebarObserver', { sidebarAdd$ });
//   return sidebarAdd$;
// }

// export function makeSidebarContentsObserver(
//   _sidebar
// ): Observable<Element, any> {
//   const sidebar = document.querySelector(sideBarSelector);
//   const sidebarContentAdd$: Observable<Element, any> = obsAdded(
//     sidebar,
//     lameSidebarContentSelector,
//     true
//   ).toProperty(() => null);
//   sidebarContentAdd$.log('sidebarContentAdd$');
//   console.log('makeSidebarContentsObserver', {
//     sidebar: sidebar,
//     sidebarContentAdd$,
//   });
//   return sidebarContentAdd$;
// }

// export function removeSidebarContents() {
//   console.log('removeSidebarContents 0');
//   const sidebarElement = document.querySelector(sideBarSelector);
//   const slot =
//     sidebarElement.firstElementChild.lastElementChild.firstElementChild
//       .firstElementChild.firstElementChild;
//   Array.from(slot.children).forEach((el: Element) => {
//     if (el.className.includes('sug_home')) return;
//     try {
//       el.remove();
//     } catch (e) {
//       console.error("Couldn't remove sidebar element", { slot, el });
//     }
//   });
//   console.log('removeSidebarContents', { slot });
// }

// Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
export function makeSearchBarObserver(): Observable<Element, any> {
  // console.log('[DEBUG] makeHomeSidebarObserver 0', { thBar });
  const searchBarAdd$: Observable<Element, any> = obsAdded(
    document,
    searchBarSelector,
    true
  ); // searchBarAdd$ :: Element // Trends element is added
  const searchBarRemove$ = obsRemoved(document, searchBarSelector, true); // searchBarAdd$ :: Element // Trends element is remove
  return searchBarAdd$;
}

export function removeSearchBar(bars: Element) {
  const sidebarElement = document.querySelector(sideBarSelector);
  const bar = bars[0];
  const slot =
    sidebarElement.firstElementChild.lastElementChild.firstElementChild
      .firstElementChild.firstElementChild;
  Array.from(slot.children).forEach((el: Element) => {
    if (el.className.includes('sug_home')) return;
    try {
      el.remove();
    } catch (e) {
      console.error("Couldn't remove sidebar element", { bar, slot, el });
    }
  });
}

// Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
export function makeHomeSidebarObserver(
  thBar: EventTarget | NodeJS.EventEmitter | { on: Function; off: Function }
) {
  // console.log('[DEBUG] makeHomeSidebarObserver 0', { thBar });
  const trendAdd$ = obsAdded(
    document,
    sideBarSelector + ' div div div div div',
    true
  );
  const trendRemove$ = obsRemoved(
    document,
    sideBarSelector + ' div div div div div',
    true
  );
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
