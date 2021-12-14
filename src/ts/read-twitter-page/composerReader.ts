import { filter, isEmpty, join, map, not, pipe, prop } from 'ramda'; // Function
import { obsCharData } from '../utils/kefirMutationObs';
import { inspect } from '../utils/putils';
import { url_regex } from './openTweetReader';

const editorSelector = '.DraftEditor-editorContainer';
export const getComposers = () => document.querySelectorAll(editorSelector);
export const getActiveComposer = () => {
  // @ts-expect-error ts-migrate(2461) FIXME: Type 'NodeListOf<Element>' is not an array type.
  const comps = [...getComposers()];
  let comp = null;
  switch (comps.length) {
    case 0:
      break;
    case 1:
      comp = comps[comps.length - 1];
      break;
    default:
      comp = comps[comps.length - 2];
      break;
  }
  return comp;
};

// We use this to find the tweet editor
let editorClass = 'DraftEditor-editorContainer';
// We use this to detect changes in the text of a tweet being composed
let textFieldClass = 'span[data-text="true"]';
//

function cleanSearchString(text: string) {
  return text.replace(url_regex, ''); //.trim();
}

const isNodeText = (el: HTMLElement): boolean =>
  prop('nodeName', el) == '#text' || prop('nodeName', el) == 'SPAN';

// console.log(
//   document.querySelector('#myselector').parentElement.closest('.card').id
// );
const getLinesFromEditor = (box) =>
  Array.from(box.querySelectorAll(textFieldClass));

export function makeComposeObs(box: HTMLElement) {
  const textChange$ = obsCharData(box, `${editorSelector} span`)
    .map(filter(isNodeText)) // checknig whether the change is in the element with id=text, to weed out other changes picked up by the observer
    .filter(pipe(isEmpty, not))
    .map((_) => getLinesFromEditor(box))
    .map(map(prop('textContent')))
    .map(join('\n'));

  // .map(prop(0)) //pick the first change in the array
  // .map(prop('textContent'));
  textChange$.log('textChange$');
  const query$ = textChange$
    .map(cleanSearchString)
    .toProperty(() => box.innerText);
  query$.log('query$');
  // const query$ = textChange$.map(_ => box.innerText).map(cleanSearchString).toProperty(() => box.innerText);
  return query$;
}
