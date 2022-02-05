import { useDebounce } from '@react-hook/debounce';
import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { defaultTo, isEmpty, path, pipe, prop, map } from 'ramda';
import SearchIcon from '../../../../images/search.svg';
import { SettingsButton } from './SettingsButton';
import { NinjaSyncIcon } from '../../common/Sync';
import {
  FeedDisplayModeContext,
  AuthContext,
  ApiTweetResults,
  ApiUserResults,
} from '../Sidebar';
import { StgFlagTooltip } from '../../common/Tooltip';
import { goToTwitterSearchPage } from '../../page/TtReader';
import { apiSearchToTweet } from '../../../bg/tweetImporter';
import { searchAPI, searchUsers } from '../../../bg/twitterScout';
import { saferTweetMap } from '../../../bg/bgUtils';
import { setStg } from '../../../stg/dutils';
import { enqueueEvent } from '../../../utils/ga';

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
const doUserSearch = async (auth, query) => {
  if (
    isEmpty(query) ||
    (query.match(/^\/(?!from|to)/) && !query.match(/(from|to)/))
  ) {
    setStg('api_users', []);
    return [];
  }
  const usersRes = await searchUsers(auth, query);
  const users = prop('users', usersRes);
  setStg('api_users', users);
  return users;
};

const doSearchApi = async (auth, query) => {
  if (isEmpty(query)) {
    setStg('api_results', []);
    return [];
  }
  const { users, tweets } = await searchAPI(auth, query);
  const res = pipe(
    () => tweets,
    saferTweetMap(apiSearchToTweet),
    map((tweet) => {
      return { tweet };
    })
  )();
  // setStg('api_results', res);
  return res;
};
export function ApiSearchBar() {
  const inputObj = useRef(null);
  const [value, setValue] = useDebounce('', 800, { leading: true });
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayModeContext
  );
  const { apiTweetResults, setApiTweetResults } = useContext(ApiTweetResults);
  const { apiUserResults, setApiUserResults } = useContext(ApiUserResults);

  const auth = useContext(AuthContext);

  const submitApiSearch = (value) => {
    dispatchFeedDisplayMode({
      action: isEmpty(value) ? 'emptyApiSearch' : 'submitApiSearch',
      tweets: [],
    });
    const timeOutId = setTimeout(async () => {
      // msgBG({ type: 'apiQuery', query: value });
      const tweets = await doSearchApi(auth, value);
      setApiTweetResults(tweets);
      const users = await doUserSearch(auth, value);
      setApiUserResults(users);
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
      if (e.getModifierState('Control') && e.key == '/') {
        enqueueEvent(
          'sidebar',
          'search icon shortcut',
          'search icon shortcut',
          1
        );
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
            delay={800}
          >
            <button
              onClick={() => {
                enqueueEvent(
                  'sidebar',
                  'search icon click',
                  'search icon click',
                  1
                );
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
            class="inline-flex items-center h-8 pl-3 pr-5 ml-2 mr-3 rounded-full text-sm focus-within:ring-2 ring-current w-full text-accent bg-mainBg"
            // style={{
            //   // backgroundColor: 'var(--main-bg-color)',
            //   // borderColor: 'var(--accent-color)',
            //   // border: '1px',
            //   color: 'var(--accent-color)',
            // }}
          >
            {' '}
            <SearchIcon
              // class="h-6 w-6 text-accent fill-current stroke-current"
              class="h-6 w-6 mr-4 text-accent fill-current stroke-current"
              // style="fill:var(--accent-color); stroke:var(--accent-color)"
            />{' '}
            <input
              ref={inputObj}
              class="outline-none text-mainTxt bg-mainBg w-full"
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
              onFocus={(e) =>
                e.target instanceof Element
                  ? (e.target as HTMLInputElement).select()
                  : null
              }
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
