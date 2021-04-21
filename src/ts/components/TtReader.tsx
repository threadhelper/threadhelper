import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import {
  curry,
  defaultTo,
  includes,
  isEmpty,
  isNil,
  join,
  length,
  path,
  prop,
  trim,
} from 'ramda';
import SearchIcon from '../../images/search.svg';
import { QueryObs } from '../hooks/BrowserEventObs';
import { useMsg } from '../hooks/useMsg';
import { _useStream } from '../hooks/useStream';
import { rpcBg, setStg } from '../stg/dutils';
import { FeedDisplayMode } from './ThreadHelper';

export function TtReader() {
  return (
    <>
      {/* <Page /> */}
      <SearchBar show={false} />
    </>
  );
}

export const getMetadataForPage = function (url) {
  var showTweet = url.match(
    /(?:twitter.com|mobile.twitter.com)\/(.*)\/status\/([0-9]*)(?:\/)?(?:\?.*)?$/
  );
  var home = url.match(
    /(?:twitter.com|mobile.twitter.com)\/home(?:\/)?(?:\?.*)?$/
  );
  var explore = url.match(
    /(?:twitter.com|mobile.twitter.com)\/explore(?:\/)?(?:\?.*)?$/
  );
  var search = url.match(
    /(?:twitter.com|mobile.twitter.com)\/search(?:\/)?(?:\?.*)?$/
  );
  var notifications = url.match(
    /(?:twitter.com|mobile.twitter.com)\/notifications(?:\/)?(?:\?.*)?$/
  );
  var messages = url.match(
    /(?:twitter.com|mobile.twitter.com)\/messages(?:\/)?(?:\?.*)?$/
  );
  var profile = url.match(
    /(?:twitter.com|mobile.twitter.com)\/([^/?]+)(?:\/with_replies|\/media|\/likes)?(?:\/)?(?:\?.*)?$/
  );
  var compose = url.match(
    /(?:twitter.com|mobile.twitter.com)\/compose\/tweet(?:\/)?(?:\?.*)?$/
  );
  var list = url.match(
    /(?:twitter.com|mobile.twitter.com)\/i\/lists\/([0-9]*)(?:\/)?(?:\?.*)?$/
  );
  var intentReply = url.match(
    /(?:twitter.com|mobile.twitter.com)\/intent\/tweet\?in_reply_to\=([0-9]*)?$/
  );
  if (showTweet) {
    return {
      pageType: 'showTweet',
      username: showTweet[1],
      tweetId: showTweet[2],
      url: url,
    };
  } else if (home) {
    return {
      pageType: 'home',
      url: url,
    };
  } else if (compose) {
    return {
      pageType: 'compose',
      url: url,
    };
  } else if (intentReply) {
    return {
      pageType: 'intentReply',
      url: url,
      tweetId: intentReply[1],
    };
  } else if (explore) {
    return {
      pageType: 'explore',
      url: url,
    };
  } else if (search) {
    return {
      pageType: 'search',
      url: url,
    };
  } else if (notifications) {
    return {
      pageType: 'notifications',
      url: url,
    };
  } else if (messages) {
    return null;
  } else if (profile) {
    var username = profile[1];
    // certain URLs are special reserved pages, not actual profile pages
    if (username === 'login' || username === 'search-advanced') {
      return null;
    }
    return {
      pageType: 'profile',
      username: profile[1],
      url: url,
    };
  } else if (list) {
    return {
      pageType: 'list',
      listId: list[1],
      url: url,
    };
  } else {
    return null;
  }
};

const isComposing = () => {
  const composeTypes = ['compose', 'intent', 'intentReply'];
  // Fast
  const pageType = prop('pageType', getMetadataForPage(window.location.href));
  console.log('shouldNewTab', {
    metadata: getMetadataForPage(window.location.href),
    pageType,
  });
  return includes(pageType, composeTypes);
};

export const goToTwitterSearchPage = (query) => {
  const fullResultsLink =
    'https://twitter.com/search?q=' +
    encodeURIComponent(query) +
    '&src=typed_query';
  const newTab = isComposing();
  console.log('goToTwitterSearchPage', { newTab, query, fullResultsLink });
  window.open(fullResultsLink, newTab ? '_blank' : '_self');
};

export var useCurrentTwitterPage = function () {
  // var [currentPage, setCurrentPage] = useState(function () {
  //   return getMetadataForPage(window.location.href);
  // });
  const [currentPage, setCurrentPage] = useState(
    getMetadataForPage(window.location.href)
  );

  const tabChange = useMsg('tab-change-url');
  useEffect(
    function () {
      const url = defaultTo(window.location.href, prop('url', tabChange));
      console.log('tabChange', { tabChange, url });
      if (isNil(url)) return () => {};
      setCurrentPage(getMetadataForPage(url));
      // setStg('pageMetadata', getMetadataForPage(url));
      return () => {};
    },
    [tabChange]
  );

  return currentPage;
};

export const parseThQuery = (query) => {
  const bracketedQueries = defaultTo(
    [],
    query.match(inSquareBracketsAndStarting)
  );
  console.log('parseThQuery [[]]', { bracketedQueries });
  if (length(bracketedQueries) <= 0) {
    return query;
  } else {
    return combineBracketedQueries(bracketedQueries);
  }
};
export const reqSearch = async (query) => {
  setStg('query', parseThQuery(query));
  // console.time(`[TIME] reqSearch`);
  // const searchResults = await rpcBg('seek', { query });
  // console.timeEnd(`[TIME] reqSearch`);
  // return searchResults;
};

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');

// this captures all top level phrases in double [[square]] [[brackets]]
const inSquareBrackets = /\[\[(\[\[.*]|.)*?\]\]/g;
// Same as above but also captures [[... when you haven't closed the double brackets
export const inSquareBracketsAndStarting = /(\[\[(\[\[.*]|.)*?\]\])|\[\[.*/g;
export const combineBracketedQueries = (queries: string[]): string => {
  return join(' ', queries);
};

export function SearchBar({ show }) {
  const inputObj = useRef(null);
  // const [query, setQuery] = useStorage('query', '');
  const { feedDisplayMode, dispatchFeedDisplayMode } =
    useContext(FeedDisplayMode);
  const query$ = useContext(QueryObs);
  const [query, setQuery] = _useStream(query$, '');

  const submitSearch = async (query: string) => {
    const q = defaultTo('', query);
    if (isEmpty(trimNewlines(q))) {
      dispatchFeedDisplayMode({
        action: 'emptySearch',
        tweets: [],
      });
      return [];
    } else {
      dispatchFeedDisplayMode({
        action: 'submitSearch',
        tweets: [],
      });
      return reqSearch(q);
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
