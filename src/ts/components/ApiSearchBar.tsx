import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { SettingsButton } from './Settings';
import { AccountsButton } from './Accounts';
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
    console.log('[DEBUG] submitApiSearch!', { value });
    // setApiQuery(value);
    msgBG({ type: 'apiQuery', query: value });
  };

  useEffect(() => {
    dispatchFeedDisplayMode({
      action: isEmpty(value) ? 'emptyApiSearch' : 'submitApiSearch',
      tweets: [],
    });
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
    <div class="flex items-center justify-between p-3 flex-grow">
      <div class="flex items-center flex-grow">
        <button onClick={() => setShowSearchBar(!showSearchBar)} class="mr-3">
          <SearchIcon class="h-4 w-4" />
        </button>

        {showSearchBar ? (
          <input
            ref={inputObj}
            class="h-8 px-5 rounded-full text-sm focus:outline-none bg-gray-200 shadow border-0 w-full"
            value={value}
            onInput={(e) =>
              setValue(defaultTo('', path(['target', 'value'], e)))
            }
            onKeyUp={(e) => (e.key === 'Enter' ? submitApiSearch(value) : null)}
            onFocus={(e) => e.target?.select()}
            type="text"
            placeholder="Search"
          />
        ) : (
          <div class="ml-4 text-2xl font-bold">
            <span>Thread Helper</span>
            <span class="text-gray-500">{` v${process.env.VERSION}`}</span>
          </div>
        )}
      </div>
      <div class="flex items-center relative top-0.5">
        <AccountsButton />
        <SettingsButton />
      </div>
    </div>
  );
}
//
