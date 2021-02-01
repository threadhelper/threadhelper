import { h, Fragment } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path, trim } from 'ramda';
import { useStorage } from '../../hooks/useStorage';
import SearchIcon from '../../../images/search.svg';
import Kefir from 'kefir';
import { msgBG } from '../../utils/dutils';
import { FeedDisplayMode } from '../../components/ThreadHelper';
import { DisplayMode } from '../../types/interfaceTypes';

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');
const reqSearch = (query) => {
  msgBG({ type: 'search', query });
};

export function SearchBar({ show }) {
  const inputObj = useRef(null);
  const [query, setQuery] = useStorage('query', '');
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  const submitSearch = (query: string) => {
    const q = defaultTo('', query);

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
    // reqSearch(q);
  };

  useEffect(() => {
    submitSearch(query);
    return () => {};
  }, [query]);

  return (
    <>
      {show ? (
        <div class="flex searchBar">
          <SearchIcon class="top-0 h-4 w-4" />
          <textarea
            ref={inputObj}
            class="bg-gray-200 w-64 h-32"
            value={query}
            onInput={(e) => {
              setQuery(defaultTo('', path(['target', 'value'], e)));
            }}
            onKeyUp={(e) => (e.key === 'Enter' ? submitSearch(query) : null)}
            onFocus={(e) => e.target?.select()}
          />
        </div>
      ) : null}
    </>
  );
}
