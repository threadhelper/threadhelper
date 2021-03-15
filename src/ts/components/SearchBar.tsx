import { h, Fragment } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path, trim } from 'ramda';
import { useStorage } from '../hooks/useStorage';
import SearchIcon from '../../images/search.svg';
import Kefir from 'kefir';
import { msgBG, rpcBg } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { DisplayMode } from '../types/interfaceTypes';

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');
const reqSearch = (query) => {
  // console.log('SearchBar reqSearch');
  // // msgBG({ type: 'search', query });
  // rpcBg('seek', { query });
};

export function SearchBar({ show }) {
  const inputObj = useRef(null);
  const [query, setQuery] = useStorage('query', '');
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  const submitSearch = (query: string) => {
    const q = defaultTo('', query);
    if (isEmpty(trimNewlines(q))) {
      dispatchFeedDisplayMode({
        action: 'emptySearch',
        tweets: [],
      });
    } else {
      dispatchFeedDisplayMode({
        action: 'submitSearch',
        tweets: [],
      });
      reqSearch(q);
    }
  };

  useEffect(() => {
    return () => {
      setQuery('');
    };
  }, []);

  useEffect(() => {
    submitSearch(query);
    return () => {};
  }, [query]);

  return (
    <>
      {show ? (
        <div class="searchBar">
          <span>
            <SearchIcon class="stroke-0 stroke-current fill-current inline w-4 h-4" />
            <input
              ref={inputObj}
              class="inline w-20"
              value={query}
              onInput={(e) =>
                setQuery(defaultTo('', path(['target', 'value'], e)))
              }
              onKeyUp={(e) => (e.key === 'Enter' ? submitSearch(query) : null)}
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
