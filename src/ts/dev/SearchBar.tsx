import { h, Fragment } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path, trim } from 'ramda';
import { useStorage } from '../hooks/useStorage';
import SearchIcon from '../../images/search.svg';
import Kefir from 'kefir';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from '../components/ThreadHelper';
import { DisplayMode } from '../types/interfaceTypes';

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');
const reqSearch = (query) => {
  msgBG({ type: 'search', query });
};

export function SearchBar({ show }) {
  const inputObj = useRef(null);
  const [value, setValue] = useStorage('query', '');
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  const submitSearch = (value: string) => {
    const q = defaultTo('', value);
    console.log('query change', { q });

    // if (isEmpty(trimNewlines(q))) {
    //   dispatchFeedDisplayMode({
    //     action: 'emptySearch',
    //     tweets: [],
    //   });
    // } else {
    //   dispatchFeedDisplayMode({
    //     action: 'submitSearch',
    //     tweets: [],
    //   });
    reqSearch(q);
  };

  useEffect(() => {
    submitSearch(value);
    return () => {};
  }, [value]);

  return (
    <>
      {show ? (
        <div class="searchBar">
          <span>
            <SearchIcon class="inline h-4 w-4" />
            <input
              ref={inputObj}
              class="inline w-20"
              value={value}
              onInput={(e) =>
                setValue(defaultTo('', path(['target', 'value'], e)))
              }
              onKeyUp={(e) => (e.key === 'Enter' ? submitSearch(value) : null)}
              onFocus={(e) => e.target?.select()}
              type="text"
              style="background-color:rgba(125,125,125,0.1)"
            />
          </span>
        </div>
      ) : null}
    </>
  );
}
