import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { msgBG, rpcBg } from '../utils/dutils';
import { FeedDisplayMode } from './ThreadHelper';
import { goToTwitterSearchPage } from './TtReader';
import { SettingsButton } from './Settings';
import { NinjaSyncIcon, SyncIcon } from './Sync';
import SearchIcon from '../../images/search.svg';
import Tooltip, { StgFlagTooltip } from './Tooltip';

import cx from 'classnames';
import { useThrottle } from '@react-hook/throttle';

var DEBUG = process.env.NODE_ENV != 'production';

// TODO adapt to our search commands
function transformQuery(query, context) {
  var matches = query.match(/(\/me|\/follows|\/user|\/list)/g);
  if (!matches || matches.length === 0) {
    return [null, query];
  }
  if (matches.length > 1) {
    return [
      "Error: can't use multiple commands together: " + matches.join(', '),
      query,
    ];
  }
  var searchMode = matches[0];
  switch (searchMode) {
    case '/me': {
      return [null, query.replace(/\/me/g, 'from:' + context.currentUser)];
    }
    case '/follows': {
      return [null, query.replace(/\/follows/g, 'filter:follows')];
    }
    case '/user': {
      if (
        !(
          context.pageMetadata.pageType === 'showTweet' ||
          context.pageMetadata.pageType === 'profile'
        )
      ) {
        return [
          "Error: /user can't be used on this page. Try it on a profile or tweet page.",
          query,
        ];
      } else {
        return [
          null,
          query.replace(/\/user/g, 'from:' + context.pageMetadata.username),
        ];
      }
    }
    case '/list': {
      if (context.pageMetadata.pageType !== 'list') {
        return [
          "Error: /list can't be used on this page. Try it on a list page.",
          query,
        ];
      } else {
        return [
          null,
          query.replace(/\/list/g, 'list:' + context.pageMetadata.listId),
        ];
      }
    }
    default: {
      return [null, query];
    }
  }
}

export function ApiSearchBar() {
  const inputObj = useRef(null);
  const [value, setValue] = useThrottle('', 1, true);
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
      // msgBG({ type: 'apiQuery', query: value });
      rpcBg('doSearchApi', { query: value });
      if (
        (q) =>
          !(isEmpty(q) || (q.match(/^\/(?!from|to)/) && !q.match(/(from|to)/)))
      ) {
        rpcBg('doUserSearch', { query: value });
      }
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

  const typing = (q) => {
    dispatchFeedDisplayMode({
      action: 'typingApiSearch',
      tweets: [],
    });
    setValue(q);
  };

  return (
    <div class="flex items-center justify-between pt-3 pr-5 flex-initial">
      <div
        class="flex items-center flex-grow border-accent"
        // style={{ borderColor: 'var(--accent-color)' }}
      >
        {!showSearchBar ? (
          <StgFlagTooltip
            content={
              'Click to search Twitter.\n Press Enter for results page. \n Shortcut: Ctrl+/'
            }
            direction="bottom"
            flagName="showApiSearchTooltip"
            className=" flex items-end"
          >
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
          </StgFlagTooltip>
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
                typing(defaultTo('', path(['target', 'value'], e)))
              }
              onKeyUp={async (e) => {
                if (e.key === 'Enter') {
                  goToTwitterSearchPage(value);
                }
              }}
              onFocus={(e) => e.target?.select()}
              onBlur={() => setShowSearchBar(false)}
              type="text"
              placeholder="Search Twitter. Enter to open the search page."
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
        <div class="flex items-center">
          <NinjaSyncIcon />
        </div>
        <SettingsButton />
      </div>
    </div>
  );
}
//
