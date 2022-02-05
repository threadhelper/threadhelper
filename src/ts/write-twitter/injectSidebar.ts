import { Observable } from 'kefir';
import { isNil } from 'ramda'; // Logic, Type, Relation, String, Math
import { getStg } from '../stg/dutils';
import { obsAdded, obsRemoved } from '../utils/kefirMutationObs';
const photoHrefSelector = '[href*="/photo"]';
const advancedSearchSelector = '[href*="/search-advanced"]';
const searchBarInputSelector = '[data-testid="SearchBox_Search_Input"] ';
export const sideBarSelector = '[data-testid="sidebarColumn"]';
export const floatingComposeSelector =
  '[aria-labelledby="modal-header"] .DraftEditor-editorContainer';

export function createSidebarContainerHome() {
  let thBar = document.createElement('div');
  thBar.setAttribute('class', 'sidebarContainerHome');
  return thBar;
}
// impure
export async function injectSidebarContainerHome(thBar: Element) {
  const hideTtSearchBar = await getStg('hideTtSearchBar');
  const hideTtSidebarContent = await getStg('hideTtSidebarContent');
  if (hideTtSearchBar) {
    removeSearchBar();
  }
  if (hideTtSidebarContent) {
    removeSidebarContent();
  }
  resizeSidebar();
  let sidebarElement = document.querySelector(sideBarSelector);
  if (!isNil(sidebarElement)) {
    let innerSidebar =
      sidebarElement.firstElementChild.lastElementChild.firstElementChild
        .firstElementChild.firstElementChild;
    innerSidebar.insertBefore(thBar, innerSidebar.firstElementChild);
  }
}

function makeNewDummy() {
  const dummyUI: Element = document.createElement('div');
  dummyUI.className = 'dummyContainer';
  const dummyLeft: Element = document.createElement('div');
  dummyLeft.className = 'dummyLeft';
  const dummyRight: Element = document.createElement('div');
  dummyRight.className = 'dummyRight max-w-xl';
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
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); // if referenceNode.nextSibling is null, it inserts at the end
}

export function injectSidebarContainerCompose(thBar: Element): Element {
  const floatingSelector = '[aria-labelledby="modal-header"]';
  const dummyUI = makeDummyCompose(thBar);
  const floating_compose = document.querySelector(floatingSelector);
  if (isNil(floating_compose)) {
    console.log('[ERROR] no floating composer element');
  }
  insertAfter(dummyUI, floating_compose);
  return dummyUI;
}
export function createSidebarElementCompose(): Element {
  let thBar = document.createElement('div');
  thBar.setAttribute('class', 'sidebarContainerComposer w-full');
  return thBar;
}
// Produces events every time a sidebar should be created (trends sidebar shows up or compose screen comes up)
export function makeSearchBarObserver(): Observable<Element, any> {
  // console.log('[DEBUG] makeHomeSidebarObserver 0', { thBar });
  const searchBarAdd$: Observable<Element, any> = obsAdded(
    document,
    searchBarInputSelector,
    true
  );
  return searchBarAdd$;
}
//
export function removeSearchBar(_?) {
  const searchBarInputEl = document.querySelector(searchBarInputSelector);
  // console.log('deleting sidebar children', { children: slot.children });
  try {
    const searchBarEl =
      searchBarInputEl.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.parentElement.parentElement.parentElement;
    console.log('removing', { searchBarInputEl, searchBarEl });
    searchBarEl.remove();
  } catch (e) {
    console.error("Couldn't remove search bar element", {
      searchBarInputEl,
    });
  }
}

export function removeSidebarContent(_?) {
  const sidebarElement = document.querySelector(sideBarSelector);
  const istTh = (el) => el.className.includes('sidebarContainerHome');
  const isUserPhotos = (el) => !isNil(el.querySelector(photoHrefSelector));
  const isAdvancedSearch = (el) =>
    !isNil(el.querySelector(advancedSearchSelector));
  const isSearchBar = (el) => !isNil(el.querySelector(searchBarInputSelector));
  try {
    const slot =
      sidebarElement.firstElementChild.lastElementChild.firstElementChild
        .firstElementChild.firstElementChild;
    // console.log('deleting sidebar children', { children: slot.children });
    Array.from(slot.children).forEach((el: Element) => {
      if (
        istTh(el) ||
        isUserPhotos(el) ||
        isAdvancedSearch(el) ||
        isSearchBar(el)
      ) {
        // console.log('skipped', el);
        return;
      }
      try {
        // console.log('removing', el);
        el.remove();
      } catch (e) {
        console.error("Couldn't remove sidebar element", { slot, el });
      }
    });
  } catch (e) {}
}

export function resizeSidebar() {
  try {
    const sidebarElement = document.querySelector(
      sideBarSelector + ' div div div div div'
    );
    console.log('[DEBUG] resizeSidebar', { sidebarElement });
    sidebarElement.classList.add('2xl:w-128');
  } catch (e) {
    console.error("Couldn't resize sidebar");
  }

  try {
    const searchBarInputEl = document.querySelector(searchBarInputSelector);
    // console.log('deleting sidebar children', { children: slot.children });
    const searchBarEl =
      searchBarInputEl.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.parentElement.parentElement.parentElement;
    searchBarEl.classList.add('2xl:w-128');
  } catch (e) {
    console.error("Couldn't resize search bar");
  }
}
