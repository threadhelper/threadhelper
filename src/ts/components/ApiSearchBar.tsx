import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { SettingsButton } from './Settings';
import { SyncIcon } from './Sync';
import SearchIcon from '../../images/search2.svg';
import cx from 'classnames';

export function ApiSearchBar() {
  const inputObj = useRef(null);
  const [value, setValue] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  const submitApiSearch = (value) => {
    dispatchFeedDisplayMode({
      action: isEmpty(value) ? 'emptyApiSearch' : 'submitApiSearch',
      tweets: [],
    });
    const timeOutId = setTimeout(() => {
      msgBG({ type: 'apiQuery', query: value });
    }, 500);
    return timeOutId;
  };

  useEffect(() => {
    const timeOutId = submitApiSearch(value);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    if (showSearchBar) inputObj.current.focus();
    return () => {};
  }, [showSearchBar]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.getModifierState('Control') && (e.key == '/' || e.key == 'k')) {
        setShowSearchBar(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div class="flex items-center justify-between p-3 flex-initial">
      <div class="flex items-center flex-grow">
        <button
          onClick={() => {
            setShowSearchBar(!showSearchBar);
            if (showSearchBar) inputObj.current?.focus();
          }}
          class="mr-3"
          style={{
            fill: 'var(--main-txt-color)',
            stroke: 'var(--main-txt-color)',
          }}
        >
          <SearchIcon class="h-4 w-4" />
        </button>

        {showSearchBar ? (
          <input
            ref={inputObj}
            class="h-8 px-5 rounded-full text-sm focus:outline-none shadow border-0 w-full"
            style={{
              backgroundColor: 'var(--main-bg-color)',
              borderColor: 'var(--accent-color)',
              border: '1px',
              color: 'var(--main-txt-color)',
            }}
            value={value}
            onInput={(e) =>
              setValue(defaultTo('', path(['target', 'value'], e)))
            }
            onKeyUp={(e) => (e.key === 'Enter' ? submitApiSearch(value) : null)}
            onFocus={(e) => e.target?.select()}
            onBlur={() => setShowSearchBar(false)}
            type="text"
            placeholder="Search Twitter"
          />
        ) : (
          <div class="inline-flex">
            <span class="ml-4 text-2xl font-bold sm:hidden md:hidden lg:block">
              Thread Helper
            </span>
            <span class="text-gray-500 sm:hidden md:hidden lg:block">{` v${process.env.VERSION}`}</span>
          </div>
        )}
      </div>
      <div class="flex items-center relative top-0.5">
        <SyncIcon />
        <SettingsButton />
      </div>
    </div>
  );
}
//
