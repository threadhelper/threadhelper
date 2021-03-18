import { Fragment, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
// flattenModule(global,R)
import {
  defaultTo,
  filter,
  isEmpty,
  isNil,
  map,
  not,
  path,
  pipe,
  prop,
  slice,
} from 'ramda'; // Function
import { User } from 'twitter-d';
import { apiMetricsFetch } from '../bg/twitterScout';
// import { useAsync } from '../hooks/useAsync';
import { useOption, useStorage } from '../hooks/useStorage';
import { DisplayMode } from '../types/interfaceTypes';
import { SearchResult, TweetResult } from '../types/msgTypes';
import { AuthContext, FeedDisplayMode } from './ThreadHelper';
import { Tweet as TweetCard } from './Tweet';
import CrossIcon from '../../images/x-red.svg';

const prepTweets = (list: TweetResult[] | null): SearchResult[] =>
  filter(pipe(prop('tweet'), isNil, not), defaultTo([], list));

function getApiMetrics(auth, results, setResults) {
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
}

export function DisplayController(props: any) {
  const auth = useContext(AuthContext);
  const { feedDisplayMode, dispatchFeedDisplayMode } =
    useContext(FeedDisplayMode);
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
      case 'QTs':
        return <QtDisplay />;
      default:
        return <IdleDisplay />;
    }
  };

  return (
    <div class="searchWidget" ref={myRef}>
      {showUserSearch(apiUsers, feedDisplayMode) && (
        <UserDisplay results={apiUsers} />
      )}
      {makeFeedDisplay(feedDisplayMode)}
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
    <div class="flex font-normal text-lsm items-center px-4 py-2 transition-colors duration-200 hover:bg-hoverBg cursor:pointer">
      <div class="flex-auto flex-grow-0 flex-shrink-0 relative w-9 h-9 mr-2 flex items-center justify-center rounded-full">
        <div class="w-full h-full rounded-full absolute inset-0 transition-colors duration-200 hover:bg-black hover:bg-opacity-15 -z-1"></div>
        <a href={`https://twitter.com/${user.screen_name}`}>
          <div class="w-full h-full absolute rounded-full inset-0 transition-colors duration-200 hover:bg-black hover:bg-opacity-15"></div>
          <img class="rounded-full" src={user.profile_image_url_https} />
        </a>
      </div>
      <div class="flex-initial text-lsm font-bold overflow-ellipsis overflow-hidden whitespace-nowrap leading-none hover:underline">
        <a href={`https://twitter.com/${user.screen_name}`}>{user.name}</a>
      </div>
      <div class="flex-initial flex-shrink-0 ml-1 text-neutral leading-none">
        <a href={`https://twitter.com/${user.screen_name}`}>
          @{user.screen_name}
        </a>
      </div>
    </div>
  );
}
//

function UserDisplay({ results }: { results: User[] }) {
  return (
    <>
      <div class="text-right text-gray-500 ">
        <span class="hover:text-mainTxt hover:underline p-3">
          {'User search results:'}
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
      <div class="text-right text-gray-500 my-1 px-3">
        <span class="hover:text-mainTxt hover:underline">{title}</span>
      </div>
      <div class="searchTweets">
        {isEmpty(results) ? (
          <span class="px-3">{emptyMsg}</span>
        ) : (
          map(buildTweetComponent, results)
        )}
      </div>
    </>
  );
}
//

function GenericIdleDisplay({ stgName, title }) {
  // const auth = useContext(AuthContext);
  const [stgIdleTweets, setStgIdleTweets] = useStorage(stgName, []);

  const [res, setRes] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    return getApiMetrics(auth, prepTweets(stgIdleTweets), setRes);
  }, [auth, stgIdleTweets]);

  useEffect(() => {
    console.log('GenericIdleDisplay', { res, auth, stgIdleTweets, stgName });
    setRes([]);
  }, [stgIdleTweets]);

  return (
    <TweetDisplay
      title={title}
      results={isEmpty(res) ? prepTweets(stgIdleTweets) : prepTweets(res)}
      emptyMsg={'No tweets yet!'}
    />
  );
}
function IdleDisplayLatest() {
  return (
    <GenericIdleDisplay stgName={'latest_tweets'} title={'Latest tweets:'} />
  );
}

function IdleDisplayRandom() {
  return (
    <GenericIdleDisplay stgName={'random_tweets'} title={'Random tweets:'} />
  );
}
function IdleDisplay() {
  const [idleMode, setIdleMode] = useOption('idleMode');

  return idleMode == 'random' ? <IdleDisplayRandom /> : <IdleDisplayLatest />;
}

function QtDisplay() {
  // const auth = useContext(AuthContext);
  const [stgQts, setStgQts] = useStorage('qts', []);
  console.log('QtDisplay render', { stgQts });

  return (
    <TweetDisplay
      title="Quote Tweets:"
      results={prepTweets(stgQts)}
      emptyMsg={'No Quote Tweets.'}
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
  const [res, setRes] = useState([]);
  const auth = useContext(AuthContext);
  // const [res, setRes] = useState(results);
  const [searchMode, setSearchMode] = useOption('searchMode');

  useEffect(() => {
    return getApiMetrics(auth, prepTweets(stgSearchResults), setRes);
  }, [auth, stgSearchResults]);

  useEffect(() => {
    setRes([]);
    console.log('got stg search', { stgSearchResults });
    // setRes(prepTweets(stgSearchResults));
  }, [stgSearchResults]);

  useEffect(() => {
    console.log('got api metrics', { res });
  }, [res]);

  return (
    <TweetDisplay
      title={
        searchMode == 'fulltext'
          ? 'Search results:'
          : searchMode == 'semantic'
          ? 'Semantic search results:'
          : ''
      }
      results={isEmpty(res) ? prepTweets(stgSearchResults) : prepTweets(res)}
      // results={res}
      // emptyMsg={`No search results. Yet!`}
      emptyMsg={<SearchResMsg />}
    />
  );
}

function ApiSearchResults() {
  const [stgApiResults, setStgApiResults] = useStorage('api_results', []);
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
