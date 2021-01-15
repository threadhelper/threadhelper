// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import { getMode, isSidebar, url_regex } from '../utils/wutils.tsx';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import { msgBG, setData } from '../utils/dutils.tsx';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math


// We use this to find the tweet editor
let editorClass = "DraftEditor-editorContainer";
let editorSelector = ".DraftEditor-editorContainer";
// We use this to detect changes in the text of a tweet being composed
let textFieldClass = 'span[data-text="true"]';
// 


function cleanSearchString(text: string) {
    return text.replace(url_regex, "")//.trim();
}

const isNodeText = (el:HTMLElement): boolean => prop('nodeName', el) == '#text' || prop('nodeName', el) ==  'SPAN'

import { obsAdded, obsRemoved, obsCharData } from '../utils/kefirMutationObs';
import { inspect } from '../utils/putils';
export function makeComposeObs(box: HTMLElement) {
    const textChange$ = obsCharData(box, `${editorSelector} span`)
        .map(filter(isNodeText)) // checknig whether the change is in the element with id=text, to weed out other changes picked up by the observer
        .filter(pipe(isEmpty, not))
        .map(prop(0)) //pick the first change in the array
        .map(prop('textContent'))
    textChange$.log('[DEBUG] textChange$')
    const query$ = textChange$.map(cleanSearchString).toProperty(()=>box.innerText)
    // const query$ = textChange$.map(_ => box.innerText).map(cleanSearchString).toProperty(() => box.innerText);
    return query$;
}
