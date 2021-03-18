import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { SettingsButton } from './Settings';
import { SyncIcon } from './Sync';
import SearchIcon from '../../images/search.svg';
import cx from 'classnames';

var DEBUG = process.env.NODE_ENV != 'production';

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
    <div class="flex items-center justify-between pt-3 pr-5 flex-initial">
      <div
        class="flex items-center flex-grow border-accent"
        // style={{ borderColor: 'var(--accent-color)' }}
      >
        {!showSearchBar ? (
          <button
            onClick={() => {
              setShowSearchBar(!showSearchBar);
              if (showSearchBar) inputObj.current?.focus();
            }}
            class="mr-3 ml-5 text-mainTxt hover:text-accent"
            // style={{
            //   fill: 'var(--main-txt-color)',
            //   stroke: 'var(--main-txt-color)',
            // }}
          >
            <SearchIcon class="h-6 w-6 fill-current stroke-current" />
          </button>
        ) : null}
        {showSearchBar ? (
          <div
            class="inline-flex items-center h-8 pl-2 pr-5 ml-2 rounded-full text-sm focus-within:ring-2 ring-current w-full text-accent bg-searchBarBg"
            // style={{
            //   // backgroundColor: 'var(--main-bg-color)',
            //   // borderColor: 'var(--accent-color)',
            //   // border: '1px',
            //   color: 'var(--accent-color)',
            // }}
          >
            {' '}
            <SearchIcon
              class="h-6 w-9 mr-3 text-accent fill-current stroke-current flex-grow"
              // style="fill:var(--accent-color); stroke:var(--accent-color)"
            />{' '}
            <input
              ref={inputObj}
              class="outline-none text-mainTxt bg-searchBarBg w-full flex-shrink"
              // style={{
              //   backgroundColor: 'var(--main-bg-color)',
              //   // border: '0px',
              //   color: 'var(--main-txt-color)',
              // }}
              value={value}
              onInput={(e) =>
                setValue(defaultTo('', path(['target', 'value'], e)))
              }
              onKeyUp={(e) =>
                e.key === 'Enter' ? submitApiSearch(value) : null
              }
              onFocus={(e) => e.target?.select()}
              onBlur={() => setShowSearchBar(false)}
              type="text"
              placeholder="Search Twitter"
            />
          </div>
        ) : (
          <div class="inline-flex items-baseline">
            <span class="text-2xl font-bold hidden lg:inline">
              ThreadHelper
            </span>
            <span class="text-2xl font-bold lg:hidden">TH</span>
            {DEBUG ? (
              <span class="text-gray-500 sm:hidden md:hidden lg:block">{` v${process.env.VERSION}`}</span>
            ) : null}
          </div>
        )}
      </div>
      <div class="flex items-center relative ml-8 top-0.5">
        <SettingsButton />
      </div>
    </div>
  );
}
//
