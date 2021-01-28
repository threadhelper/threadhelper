import { h, Fragment } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path, trim } from 'ramda';
import { useStorage } from '../hooks/useStorage';
import SearchIcon from '../../images/search.svg';
import Kefir from 'kefir';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { DisplayMode } from '../types/interfaceTypes';

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');
const reqSearch = (query) => msgBG({ type: 'search', query });
export function SearchBar() {
  const inputObj = useRef(null);
  const [value, setValue] = useStorage('query', '');
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  useEffect(() => {
    const q = defaultTo('', value);
    console.log('query change', { q });

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
  }, [value]);

  return <></>;
}
