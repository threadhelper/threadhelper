import { h, Fragment } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import {
  curry,
  defaultTo,
  filter,
  includes,
  isEmpty,
  isNil,
  map,
  nth,
  path,
  pipe,
  prop,
  propEq,
  reverse,
  sortBy,
  trim,
  __,
} from 'ramda';
import { useStorage } from '../hooks/useStorage';
import SearchIcon from '../../images/search.svg';
import Kefir from 'kefir';
import { getStg, makeGotMsgObs, msgBG, rpcBg, setStg } from '../utils/dutils';
import { AuthContext, FeedDisplayMode } from './ThreadHelper';
import { DisplayMode } from '../types/interfaceTypes';
import { searchAPI, tweetLookupQuery } from '../bg/twitterScout';
import { apiSearchToTweet } from '../bg/tweetImporter';
import { asyncTimeFn, inspect, isExist, timeFn } from '../utils/putils';
import { QueryObs } from '../hooks/BrowserEventObs';
import { _useStream } from '../hooks/useStream';
import { useMsg } from '../hooks/useMsg';
import { getRepliedToText, repliedTimeSelector } from '../utils/wutils';

export function TtReader() {
  return (
    <>
      <Page />
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
  var intent = url.match(
    /(?:twitter.com|mobile.twitter.com)\/intent\/tweet(?:\?.*)?$/
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
  } else if (intentReply) {
    return {
      pageType: 'intent',
      url: url,
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

var useCurrentTwitterPage = function () {
  // var [currentPage, setCurrentPage] = useState(function () {
  //   return getMetadataForPage(window.location.href);
  // });
  const [currentPage, setCurrentPage] = useStorage(
    'pageMetadata',
    getMetadataForPage(window.location.href)
  );

  const tabChange = useMsg('tab-change-url');
  useEffect(
    function () {
      const url = defaultTo(window.location.href, prop('url', tabChange));
      console.log('tabChange', { tabChange });
      if (isNil(url)) return () => {};
      // setCurrentPage(getMetadataForPage(prop('url', tabChange)));
      setStg('pageMetadata', getMetadataForPage(url));
      return () => {};
    },
    [tabChange]
  );
  // useEffect(function () {
  //   const urlChange$ = makeGotMsgObs()
  //     .map(prop('m'))
  //     .filter(propEq('type', 'tab-change-url'))
  //     .map(inspect('useCurrentTwitterPage'))
  //     .map(prop('url'))
  //     .skipDuplicates()
  //     .map(getMetadataForPage);

  //   setSubscription(urlChange$.observe({ value: setCurrentPage }));
  //   // urlChange$.onValue(setCurrentPage);
  //   return () => {
  //     subscription.unsubscribe();
  //     // urlChange$.offValue(setCurrentPage);
  //   };
  // }, []);
  return currentPage;
};

const _submitSearch = curry((dispatch, query: string) => {
  const q = defaultTo('', query);
  if (isEmpty(trimNewlines(q))) {
    dispatch({
      action: 'emptySearch',
      tweets: [],
    });
  } else {
    dispatch({
      action: 'submitSearch',
      tweets: [],
    });
    reqSearch(q);
  }
});

const _submitContextSearch = curry((dispatch, query: string) => {
  const q = defaultTo('', query);
  if (isEmpty(trimNewlines(q))) {
    dispatch({
      action: 'emptyContextSearch',
      tweets: [],
    });
  } else {
    dispatch({
      action: 'submitContextSearch',
      tweets: [],
    });
    reqContextSearch(q);
  }
});

const _QtApiSearch = curry(async (dispatch, auth, tweetId) => {
  var hasQt = false;
  await searchAPI(auth, 'quoted_tweet_id:' + tweetId).then(
    ({ users, tweets }) =>
      pipe(
        () => tweets,
        filter(propEq('quoted_status_id_str', tweetId)),
        sortBy(prop('favorite_count')),
        reverse,
        inspect('qt req'),
        map(apiSearchToTweet),
        map((tweet) => {
          return { tweet };
        }),
        defaultTo([]),
        (qts) => {
          if (!isEmpty(qts)) {
            hasQt = true;
            setStg('qts', qts);
            dispatch({
              action: 'gotQts',
              tweets: [],
            });
          }
        }
      )()
  );
  return hasQt;
});

const _searchLookupTweet = curry(async (submitSearch, auth, id) => {
  return tweetLookupQuery(auth, [id]).then(
    pipe(
      inspect('showTweet tweetLookupQuery'),
      nth(0),
      prop('full_text'),
      defaultTo(''),
      submitSearch
    )
  );
});

const _showTweetContext = curry(async (dispatch, tweetId, auth) => {
  console.log('show Tweet', { id: tweetId });
  const QtApiSearch = _QtApiSearch(dispatch);
  const submitContextSearch = _submitContextSearch(dispatch);
  const searchLookupTweet = _searchLookupTweet(submitContextSearch);
  const hasQt = await QtApiSearch(auth, tweetId);
  if (!hasQt) searchLookupTweet(auth, tweetId);
});

const handleContext = (dispatch, currentPage, auth) => {
  const showTweetContext = _showTweetContext(dispatch);
  const submitContextSearch = _submitContextSearch(dispatch);
  if (propEq('pageType', 'showTweet', currentPage)) {
    showTweetContext(currentPage.tweetId, auth);
  } else if (propEq('pageType', 'compose', currentPage)) {
    const textRepliedTo = getRepliedToText();
    const isReply = !isNil(textRepliedTo);
    console.log('Ttreader page: Compose' + ` ${defaultTo('', textRepliedTo)}`);
    if (isReply) submitContextSearch(textRepliedTo);
  } else if (propEq('pageType', 'intentReply', currentPage)) {
    const textRepliedTo = getRepliedToText();
    const hasText = isExist(textRepliedTo);
    console.log('Ttreader page: Compose' + ` ${defaultTo('', textRepliedTo)}`);
    if (hasText) {
      submitContextSearch(textRepliedTo);
    } else {
      showTweetContext(currentPage.tweetId, auth);
    }
  } else {
    // if no contextual information#
    console.log('TtReader handleContext', { currentPage });
    setStg('context_results', []);
    setStg('contextQuery', '');
    dispatch({
      action: 'emptySearch',
      tweets: [],
    });
  }
};

export function Page() {
  const auth = useContext(AuthContext);
  const currentPage = useCurrentTwitterPage();
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );

  useEffect(() => {
    console.log('[DEBUG] TtReader > Page', { currentPage, auth });
    if (isNil(currentPage) || isNil(auth)) return;

    handleContext(dispatchFeedDisplayMode, currentPage, auth);
  }, [currentPage, auth]);
  return <></>;
}

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');

const reqSearch = async (query) => {
  // msgBG({ type: 'search', query });
  setStg('query', query);
  // console.time(`[TIME] reqSearch`);
  // const searchResults = await rpcBg('seek', { query });
  // console.timeEnd(`[TIME] reqSearch`);
  // return searchResults;
};

const reqContextSearch = async (query) => {
  // msgBG({ type: 'search', query });
  setStg('contextQuery', query);
  // console.time(`[TIME] reqSearch`);
  // const searchResults = await rpcBg('seek', { query });
  // console.timeEnd(`[TIME] reqSearch`);
  // return searchResults;
};

export function SearchBar({ show }) {
  const inputObj = useRef(null);
  // const [query, setQuery] = useStorage('query', '');
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );
  const query$ = useContext(QueryObs);
  const [query, setQuery] = _useStream(query$, '');
  const [midSearch, setMidSearch] = useState(false);
  const [nextQuery, setNextQuery] = useState(null);

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

  // useEffect(() => {
  //   if (!midSearch) {
  //     console.log('[INFO] making query', { query });
  //     setMidSearch(true);
  //     submitSearch(query).then((_) => setMidSearch(false));
  //   } else {
  //     // console.log('[INFO] queueing query', { query });
  //     setNextQuery(query);
  //   }
  //   return () => {};
  // }, [query]);

  // useEffect(() => {
  //   if (!midSearch && !isNil(nextQuery)) {
  //     console.log('[INFO] making queued query', { midSearch, nextQuery });
  //     setMidSearch(true);
  //     submitSearch(nextQuery).then((_) => {
  //       setMidSearch(false);
  //       setNextQuery(null);
  //     });
  //   }
  //   return () => {};
  // }, [midSearch]);

  return (
    <>
      {show ? (
        <div class="searchBar">
          <span>
            <SearchIcon class="stroke-0 stroke-current fill-current  inline w-4 h-4" />
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
