import { h, render, Component, cloneElement } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { makeOnStorageChanged } from '../utils/dutils';
import { useStream } from '../hooks/useStream';
import { useStorage, useOption } from '../hooks/useStorage';
import Kefir, { sequentially } from 'kefir';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch} from 'ramda' // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda' // Object
import { head, tail, take, isEmpty, any, all,  includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice} from 'ramda' // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda' // Logic, Type, Relation, String, Math

import { initGA, csEvent, PageView, UA_CODE } from '../utils/ga'

function useInputStg(type, name) {
  const [apiQuery, setApiQuery] = useStorage("apiQuery", '');
  const [value, setValue] = useState('');

  const submiApiSearch = e=>{
    if (e.key === 'Enter'){
      setApiQuery(value)
      console.log('[DEBUG] submiApiSearch!', {value, e})
    }
  }

  const input = <input value={value} onChange={e=>setValue(e.target.value)} onKeyUp={submiApiSearch} type={type} />;
  return [value, input];
}

// 
export function SearchBar(){
  const [value, input] = useInputStg('apiQuery', '')  

  return (
    <div class="console">
      {input}
    </div> 
  );
}

