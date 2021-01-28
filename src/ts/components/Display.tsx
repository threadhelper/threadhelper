import { Fragment, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
// flattenModule(global,R)
import {
  andThen,
  defaultTo,
  filter,
  find,
  innerJoin,
  isEmpty,
  isNil,
  lensProp,
  map,
  not,
  path,
  pipe,
  prop,
  propEq,
  set,
  zipWith,
  __,
} from 'ramda'; // Function
import { apiSearchToTweet } from '../bg/tweetImporter';
import { apiMetricsFetch, tweetLookupQuery } from '../bg/twitterScout';
// import { useAsync } from '../hooks/useAsync';
import { useOption, useStorage } from '../hooks/useStorage';
import { DisplayMode } from '../types/interfaceTypes';
import { SearchResult, TweetResult } from '../types/msgTypes';
import { thTweet } from '../types/tweetTypes';
import { inspect } from '../utils/putils';
import { AuthContext, FeedDisplayMode } from './ThreadHelper';
import { Tweet as TweetCard } from './Tweet';

const prepTweets = (list: TweetResult[] | null): SearchResult[] =>
  filter(pipe(prop('tweet'), isNil, not), defaultTo([], list));

function useApiMetrics(auth, _results, setResults) {
  useEffect(() => {
    const results = prepTweets(_results);
    let isMounted = true;
    const timeOutId = setTimeout(() => {
      if (isMounted && !isNil(auth) && !isEmpty(results)) {
        apiMetricsFetch(auth, results).then((x) => {
          if (isMounted) {
            setResults(x);
          }
        });
      }
    }, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeOutId);
    };
  }, [auth, _results]);
}

export function Display(props: any) {
  const auth = useContext(AuthContext);
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );
  const myRef = useRef(null);

  const [stgLatestTweets, setStgLatestTweets] = useStorage('latest_tweets', []);
  const [latestTweets, setLatestTweets] = useState([]);
  const notFirstLatest = useRef(0);

  const [stgSearchResults, setStgSearchResults] = useStorage(
    'search_results',
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const notFirstSearch = useRef(0);

  const [stgApiResults, setStgApiResults] = useStorage('api_results', []);
  const [apiResults, setApiResults] = useState([]);
  const notFirstApi = useRef(0);

  const makeFeedDisplay = (displayMode: DisplayMode) => {
    // console.log({ searchResults });
    switch (displayMode) {
      case 'Idle':
        return <IdleDisplay results={latestTweets} />;
      case 'Api':
        return <ApiSearchResults results={apiResults} />;
      case 'ApiWaiting':
        return <ApiWaitingDisplay />;
      case 'Search':
        return <SearchResults results={searchResults} />;
      case 'SearchWaiting':
        return <SearchResults results={searchResults} />;
      default:
        return <IdleDisplay results={latestTweets} />;
    }
  };
  /* hooks for latestTweets */
  useEffect(() => {
    if (isNil(stgLatestTweets)) {
    } else {
      console.log({ stgLatestTweets });
      setLatestTweets(prepTweets(stgLatestTweets));
    }
    return () => {};
  }, [stgLatestTweets]);
  useEffect(() => {
    console.log({ latestTweets });
    if (notFirstLatest.current > 1) {
      dispatchFeedDisplayMode({
        action: 'gotLatestTweets',
        tweets: latestTweets,
      });
    } else {
      notFirstLatest.current += 1;
    }
    return () => {};
  }, [latestTweets]);
  // useApiMetrics(auth, stgLatestTweets, setLatestTweets);

  /* hooks for searchResults */
  useLayoutEffect(() => {
    if (isNil(stgSearchResults)) {
    } else {
      console.log({ stgSearchResults, time: Date.now() });
      setSearchResults(prepTweets(stgSearchResults));
    }
    return () => {};
  }, [stgSearchResults]);
  useLayoutEffect(() => {
    if (notFirstSearch.current > 1) {
      dispatchFeedDisplayMode({
        action: 'gotSearchResults',
        tweets: searchResults,
      });
      console.log({ searchResults, time: Date.now() });
    } else {
      notFirstSearch.current += 1;
    }
    return () => {};
  }, [searchResults]);
  // useApiMetrics(auth, stgSearchResults, setSearchResults);
  //
  /* hooks for apiResults */
  useEffect(() => {
    if (notFirstApi.current > 1) {
      if (isNil(stgApiResults)) {
      } else {
        setApiResults(prepTweets(stgApiResults));
      }
      dispatchFeedDisplayMode({
        action: 'gotApiResults',
        tweets: stgApiResults,
      });
    } else {
      notFirstApi.current += 1;
    }
    return () => {};
  }, [stgApiResults]);

  return (
    <div class="searchWidget" ref={myRef}>
      {makeFeedDisplay(feedDisplayMode)}
    </div>
  );
}

const buildTweetComponent = (res: TweetResult) => (
  // Without a key, Preact has to guess which tweets have
  // changed when re-rendering.
  <TweetCard
    key={path(['tweet', 'id'])}
    tweet={prop('tweet', res)}
    score={prop('score', res)}
  />
);

type TweetDisplayProps = {
  title: string;
  results: TweetResult[];
  emptyMsg: string;
};
function TweetDisplay({ title, results, emptyMsg }: TweetDisplayProps) {
  return (
    <>
      <div class="text-right text-gray-500 ">
        <span class="hover:text-white hover:underline">{title}</span>
      </div>
      <div class="searchTweets">
        {isEmpty(results) ? emptyMsg : map(buildTweetComponent, results)}
      </div>
    </>
  );
}
//
function IdleDisplay({ results }: { results: TweetResult[] }) {
  const auth = useContext(AuthContext);
  const [res, setRes] = useState(results);
  const [idleMode, setIdleMode] = useOption('idleMode');
  useApiMetrics(auth, res, setRes);

  useEffect(() => {
    setRes(results);
    return () => {};
  }, [results]);

  return (
    <TweetDisplay
      title={
        idleMode == 'timeline'
          ? 'Latest tweets:'
          : idleMode == 'random'
          ? 'Random tweets:'
          : ''
      }
      results={res}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function SearchResults({ results }: { results: TweetResult[] }) {
  const auth = useContext(AuthContext);
  const [res, setRes] = useState(results);
  const [searchMode, setSearchMode] = useOption('searchMode');
  useApiMetrics(auth, res, setRes);

  useEffect(() => {
    setRes(results);
    return () => {};
  }, [results]);

  return (
    <TweetDisplay
      title={
        searchMode == 'fulltext'
          ? 'Search results:'
          : searchMode == 'semantic'
          ? 'Semantic search results:'
          : ''
      }
      results={res}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function ApiSearchResults({ results }: { results: TweetResult[] }) {
  return (
    <TweetDisplay
      title={'Twitter API results:'}
      results={results}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function ApiWaitingDisplay() {
  return <div class="searchTweets">Searching Twitter...</div>;
}
