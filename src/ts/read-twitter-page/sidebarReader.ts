import Kefir, { fromEvents } from 'kefir';
import { obsAdded, obsRemoved } from '../utils/kefirMutationObs';
import {
  sideBarSelector,
  floatingComposeSelector,
} from '../write-twitter/injectSidebar';

const photoSelector = '[data-testid="tweetPhoto"]'; // can't use this bc sidebar doesn't start with photos loaded
const trendText = '[aria-label="Timeline: Trending now"]';

const isHomeSidebar = () => {
  const sugHome = document.getElementsByClassName('sidebarContainerHome');
  if (sugHome.length > 0) {
    if (sugHome[0].children.length > 0) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};
const isFloatSidebar = () => {
  const sugCompose = document.getElementsByClassName(
    'sidebarContainerComposer'
  );
  if (sugCompose.length > 0) {
    if (sugCompose[0].children.length > 0) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};

export function isSidebar(mode) {
  switch (mode) {
    case 'home':
      return document.getElementsByClassName('sidebarContainerHome').length > 0;
    case 'compose':
      return isFloatSidebar();
    default:
      return false;
  }
}

export function ttSidebarObserver() {
  const ttSidebar$ = obsAdded(
    document,
    sideBarSelector + ' div div div div div',
    false
  ); // trendAdd$ :: Element // Trends element is added
  const inits =
    document.querySelector(sideBarSelector + ' div div div div div') ?? [];
  console.log({ inits });
  return Kefir.merge([Kefir.sequentially(1, inits).take(1), ttSidebar$]);
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
  ); // trendAdd$ :: Element // Trends element is added
  const trendRemove$ = obsRemoved(
    document,
    sideBarSelector + ' div div div div div',
    true
  ); // trendAdd$ :: Element // Trends element is remove
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
// export const removeHomeSidebar = () => {
//   // console.log('removing sidebar');
//   const sugHomes = [...document.getElementsByClassName('sidebarContainerHome')];
//   sugHomes.forEach((x: { remove: () => void }) => x.remove());
// };
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
