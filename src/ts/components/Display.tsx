import { Fragment, h } from 'preact';
import { useThrottle, useThrottleCallback } from '@react-hook/throttle';
import { memo } from 'preact/compat';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/hooks';
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
  slice,
  zipWith,
  __,
} from 'ramda'; // Function
import { apiSearchToTweet } from '../bg/tweetImporter';
import { apiMetricsFetch, tweetLookupQuery } from '../bg/twitterScout';
import { useMsg } from '../hooks/useMsg';
// import { useAsync } from '../hooks/useAsync';
import { useOption, useStorage } from '../hooks/useStorage';
import { DisplayMode } from '../types/interfaceTypes';
import { SearchResult, TweetResult } from '../types/msgTypes';
import { thTweet } from '../types/tweetTypes';
import { inspect } from '../utils/putils';
import { AuthContext, FeedDisplayMode } from './ThreadHelper';
import { Tweet as TweetCard } from './Tweet';
import { User } from 'twitter-d';

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

export function DisplayController(props: any) {
  console.log('rerender Display');

  const auth = useContext(AuthContext);
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );
  const myRef = useRef(null);
  const [apiUsers, setApiUsers] = useStorage('api_users', []);

  const makeFeedDisplay = (displayMode: DisplayMode) => {
    // console.log({ searchResults });
    switch (displayMode) {
      case 'Idle':
        return <IdleDisplay />;
      case 'Api':
        return <ApiSearchResults />;
      case 'ApiWaiting':
        return <ApiWaitingDisplay />;
      case 'Search':
        return <SearchResults />;
      case 'SearchWaiting':
        return <SearchResults />;
      default:
        return <IdleDisplay />;
    }
  };

  return (
    <div class="searchWidget" ref={myRef}>
      {showUserSearch(apiUsers, feedDisplayMode) ? (
        <UserDisplay results={apiUsers} />
      ) : null}
      {makeFeedDisplay(feedDisplayMode)}
      {/* <SearchResults results={prepTweets(stgSearchResults)} /> */}
    </div>
  );
}

const showUserSearch = (apiUsers, displayMode) => {
  return (
    !isEmpty(apiUsers) &&
    !isNil(apiUsers) &&
    [DisplayMode.Api, DisplayMode.ApiWaiting].includes(displayMode)
  );
};

function UserCard({ user }) {
  return (
    <div class="th-tweet">
      <div class="th-gutter">
        <img class="th-profile" src={user.profile_image_url_https} />
      </div>
      <div class="th-body">
        <div class="th-header">
          <div class="th-header-name">
            <a href={`https://twitter.com/${user.screen_name}`}>{user.name}</a>
          </div>
          <div class="th-header-username">@{user.screen_name}</div>
        </div>
      </div>
    </div>
  );
}

function UserDisplay({ results }: { results: User[] }) {
  return (
    <>
      <div class="text-right text-gray-500 ">
        <span class="hover:text-white hover:underline">
          User search results
        </span>
      </div>
      <div class="flex-1 searchUsers">
        {map((u) => {
          return <UserCard user={u} />;
        }, slice(0, 3, results))}
      </div>
    </>
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
  emptyMsg: string | JSX.Element;
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
function IdleDisplay() {
  // const auth = useContext(AuthContext);
  const [stgLatestTweets, setStgLatestTweets] = useStorage('latest_tweets', []);

  const [idleMode, setIdleMode] = useOption('idleMode');
  // useApiMetrics(auth, res, setRes);
  console.log('rerender Idle SearchResults');

  return (
    <TweetDisplay
      title={
        idleMode == 'timeline'
          ? 'Latest tweets:'
          : idleMode == 'random'
          ? 'Random tweets:'
          : ''
      }
      results={prepTweets(stgLatestTweets)}
      emptyMsg={'No tweets yet!'}
    />
  );
}

const SearchResMsg = () => {
  const [query, setQuery] = useStorage('query', '');
  return <span>{`No search results for ${defaultTo(query, '')}. Yet!`} </span>;
};

function SearchResults() {
  const [stgSearchResults, setStgSearchResults] = useStorage(
    'search_results',
    []
  );
  const auth = useContext(AuthContext);
  // const [res, setRes] = useState(results);
  const [searchMode, setSearchMode] = useOption('searchMode');
  // useApiMetrics(auth, res, setRes);

  return (
    <TweetDisplay
      title={
        searchMode == 'fulltext'
          ? 'Search results:'
          : searchMode == 'semantic'
          ? 'Semantic search results:'
          : ''
      }
      results={prepTweets(stgSearchResults)}
      // results={res}
      // emptyMsg={`No search results. Yet!`}
      emptyMsg={<SearchResMsg />}
    />
  );
}

function ApiSearchResults() {
  const [stgApiResults, setStgApiResults] = useStorage('api_results', []);
  console.log('rerender APISearchResults');
  return (
    <TweetDisplay
      title={'Twitter search results:'}
      results={prepTweets(stgApiResults)}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function ApiWaitingDisplay() {
  return <div class="searchTweets">Searching Twitter...</div>;
}
