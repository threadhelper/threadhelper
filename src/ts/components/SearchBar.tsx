import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { useStorage } from '../hooks/useStorage';
import SearchIcon from '../../images/search.svg';
import Kefir from 'kefir';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { DisplayMode } from '../types/interfaceTypes';

export function SearchBar() {
  const inputObj = useRef(null);
  const [value, setValue] = useState('');
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  const submitApiSearch = (value) => {
    console.log('[DEBUG] submitApiSearch!', { value });
    // setApiQuery(value);
    isEmpty(value)
      ? null
      : dispatchFeedDisplayMode({
          action: 'submitApiSearch',
          tweets: [],
        });
    msgBG({ type: 'apiQuery', query: value });
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      // submitApiSearch(value);
      submitApiSearch(value);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.getModifierState('Control') && (e.key == '/' || e.key == 'k')) {
        inputObj.current.focus();
        console.log(`pressed ${e.key}`);
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div class="searchBar">
      <span>
        <SearchIcon />
        <input
          ref={inputObj}
          class="w-20"
          value={value}
          onInput={(e) => setValue(defaultTo('', path(['target', 'value'], e)))}
          onKeyUp={(e) => (e.key === 'Enter' ? submitApiSearch(value) : null)}
          onFocus={(e) => e.target?.select()}
          type="text"
          style="background-color:rgba(125,125,125,0.1)"
        />
      </span>
    </div>
  );
}
