import { filter, isEmpty, not, pipe, prop } from 'ramda'; // Function
import { obsCharData } from '../utils/kefirMutationObs';
import { url_regex } from '../utils/wutils.tsx';

// We use this to find the tweet editor
let editorClass = 'DraftEditor-editorContainer';
let editorSelector = '.DraftEditor-editorContainer';
// We use this to detect changes in the text of a tweet being composed
let textFieldClass = 'span[data-text="true"]';
//

function cleanSearchString(text: string) {
  return text.replace(url_regex, ''); //.trim();
}

const isNodeText = (el: HTMLElement): boolean =>
  prop('nodeName', el) == '#text' || prop('nodeName', el) == 'SPAN';

export function makeComposeObs(box: HTMLElement) {
  const textChange$ = obsCharData(box, `${editorSelector} span`)
    .map(filter(isNodeText)) // checknig whether the change is in the element with id=text, to weed out other changes picked up by the observer
    .filter(pipe(isEmpty, not))
    .map(prop(0)) //pick the first change in the array
    .map(prop('textContent'));
  // textChange$.log('[DEBUG] textChange$')
  const query$ = textChange$
    .map(cleanSearchString)
    .toProperty(() => box.innerText);
  // const query$ = textChange$.map(_ => box.innerText).map(cleanSearchString).toProperty(() => box.innerText);
  return query$;
}
