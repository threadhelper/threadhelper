import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { msgBG } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { SettingsButton } from './Settings';
import { AccountsButton } from './Accounts';
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
          <svg
            class="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            style="enable-background:new 0 0 56.966 56.966;"
            xmlSpace="preserve"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
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
