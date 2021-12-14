import { Fragment, h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
// flattenModule(global,R)
import { useThrottle } from '@react-hook/throttle';
import {
  curry,
  defaultTo,
  filter,
  includes,
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
import {
  ApiTweetResults,
  ApiUserResults,
  AuthContext,
  ContextualResults,
  FeedDisplayMode,
} from './ThreadHelper';
import { useCurrentTwitterPage } from './TtReader';
import { getMetadataForPage } from '../domInterface/wutils';

import { Tweet as TweetCard } from './Tweet';
import CrossIcon from '../../images/x-red.svg';
import { pre_render_n } from '../utils/params';

const prepTweets = (list: TweetResult[] | null): SearchResult[] =>
  filter(pipe(prop('tweet'), isNil, not), defaultTo([], list));

function useEffectTimeout(fn, delay) {
  let isMounted = true;
  const timeOutId = setTimeout(() => {
    if (isMounted) {
      fn();
    }
  }, 500);
  return () => {
    isMounted = false;
    clearTimeout(timeOutId);
  };
}

function tryApiMetricsFetch(auth, results, setResults) {
  let isMounted = true;
  const timeOutId = setTimeout(() => {
    if (isMounted && !isNil(auth) && !isEmpty(results)) {
      try {
        apiMetricsFetch(auth, results).then((x) => {
          if (isMounted) {
            // default to the base results if the request returned null for some reason
            setResults(defaultTo(results, x));
          }
        });
      } catch (e) {
        console.error("Couldn't apiMetricsFetch", e);
        // this setResults is important bc search intermediate results are smaller than these, so this displays more results
        setResults(results);
      }
    }
  }, 500);
  return () => {
    isMounted = false;
    clearTimeout(timeOutId);
  };
}

const calcIdleDisplay = (currentPage) => {
  const inCompose = includes(prop('pageType', currentPage), [
    'compose',
    'intentReply',
  ]);
  console.log('calcIdleDisplay', { inCompose });
  return inCompose ? <ContextResults /> : <IdleDisplay />;
};

export function DisplayController(props: any) {
  const auth = useContext(AuthContext);
  const { feedDisplayMode, dispatchFeedDisplayMode } =
    useContext(FeedDisplayMode);
  const myRef = useRef(null);
  const [apiUsers, setApiUsers] = useStorage('api_users', []);
  const { apiUserResults, setApiUserResults } = useContext(ApiUserResults);
  const currentPage = useCurrentTwitterPage();

  const makeFeedDisplay = (displayMode: DisplayMode) => {
    // console.log({ searchResults });
    switch (displayMode) {
      case 'Idle':
        // return <IdleDisplay />;
        return calcIdleDisplay(currentPage);
      case 'Context':
        return <ContextResults />;
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
        <UserDisplay results={apiUserResults} />
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

const buildTweetComponent = curry((minimizeActions, res: TweetResult) => (
  // Without a key, Preact has to guess which tweets have
  // changed when re-rendering.
  <TweetCard
    key={path(['tweet', 'id'])}
    tweet={prop('tweet', res)}
    score={prop('score', res)}
    minimizeActions={minimizeActions}
  />
));

type TweetDisplayProps = {
  title: string;
  results: TweetResult[];
  emptyMsg: string | JSX.Element;
  onMouseEnter: (_: any) => void;
};
function TweetDisplay({
  title,
  results,
  emptyMsg,
  onMouseEnter,
}: TweetDisplayProps) {
  const [minimizeActions, setMinimizeActions] = useStorage(
    'minimizeTweetActions',
    null
  );
  return (
    <>
      <div class="text-right text-gray-500 my-1 px-3">
        <span class="hover:text-mainTxt hover:underline">{title}</span>
      </div>
      <div class="searchTweets" onMouseEnter={onMouseEnter}>
        {isEmpty(results) ? (
          <span class="px-3">{emptyMsg}</span>
        ) : (
          map((res) => {
            return (
              <TweetCard
                key={path(['tweet', 'id'])}
                tweet={prop('tweet', res)}
                score={prop('score', res)}
                minimizeActions={minimizeActions}
              />
            );
          }, results)
        )}
      </div>
    </>
  );
}

// Gets metrics right away, rather than on mouse hover
function GenericIdleDisplay({ stgName, title }) {
  // const [metricsRequested, setMetricsRequested] = useState(false);
  const [stgIdleTweets, setStgIdleTweets] = useStorage(stgName, []);

  const [res, setRes] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    // setMetricsRequested(false);
    return tryApiMetricsFetch(auth, prepTweets(stgIdleTweets), setRes);
  }, [auth, stgIdleTweets]);

  // useEffect(() => {
  //   if (metricsRequested) {
  //     console.log('[DEBUG] StgSearchResults getting metrics');
  //     return tryApiMetricsFetch(auth, prepTweets(stgIdleTweets), setRes);
  //   }
  // }, [metricsRequested]);

  useEffect(() => {
    console.log('GenericIdleDisplay', { res, auth, stgIdleTweets, stgName });
    setRes([]);
  }, [stgIdleTweets]);

  return (
    <TweetDisplay
      title={title}
      onMouseEnter={(_) => null}
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

const SearchResMsg = () => {
  const [query, setQuery] = useStorage('query', '');
  return (
    <span>{`No search results for "${defaultTo(query, '')}". Yet!`} </span>
  );
};

// const throttleSize = (list)=>{
//   let isMounted = true;
//     const timeOutId = setTimeout(() => {
//       if (isMounted) {
//           return list
//       }
//     }, 500);
//     return () => {
//       isMounted = false;
//       clearTimeout(timeOutId);
//     };
// }

function ContextSearchResults({}) {
  const auth = useContext(AuthContext);
  const { contextualResults, setContextualResults } =
    useContext(ContextualResults);
  const [metricsRequested, setMetricsRequested] = useState(false);
  const [res, setRes] = useThrottle([], 200);
  const [searchMode, setSearchMode] = useOption('searchMode');

  useEffect(() => {
    console.log('contextualResults', { contextualResults });
    setMetricsRequested(false);
    return useEffectTimeout(() => {
      setRes(contextualResults);
    }, 500);
    // return tryApiMetricsFetch(auth, prepTweets(stgSearchResults), setRes);
  }, [auth, contextualResults]);

  useEffect(() => {
    if (metricsRequested) {
      console.log('[DEBUG] ContextSearchResults getting metrics', {
        contextualResults,
        res,
      });
      return tryApiMetricsFetch(auth, prepTweets(contextualResults), setRes);
    }
  }, [metricsRequested]);

  useEffect(() => {
    setRes([]);
    // setRes(prepTweets(stgSearchResults));
  }, [contextualResults]);

  return (
    <TweetDisplay
      title={
        searchMode == 'fulltext'
          ? 'Search results:'
          : searchMode == 'semantic'
          ? 'Semantic search results:'
          : ''
      }
      onMouseEnter={(_) => setMetricsRequested(true)}
      // slice because stgSearchResults are the ones that show up quickly before api metrics kick in
      results={
        isEmpty(res)
          ? prepTweets(slice(0, pre_render_n, contextualResults))
          : prepTweets(res)
      }
      emptyMsg={<SearchResMsg />}
    />
  );
}

function StgSearchResults({ stgName }) {
  const [stgSearchResults, setStgSearchResults] = useStorage(stgName, []);
  const [metricsRequested, setMetricsRequested] = useState(false);
  const [res, setRes] = useThrottle([], 200);
  const auth = useContext(AuthContext);
  // const [res, setRes] = useState(results);
  const [searchMode, setSearchMode] = useOption('searchMode');

  useEffect(() => {
    setMetricsRequested(false);
    return useEffectTimeout(() => {
      setRes(stgSearchResults);
    }, 500);
    // return tryApiMetricsFetch(auth, prepTweets(stgSearchResults), setRes);
  }, [auth, stgSearchResults]);

  useEffect(() => {
    if (metricsRequested) {
      console.log('[DEBUG] StgSearchResults getting metrics');
      return tryApiMetricsFetch(auth, prepTweets(stgSearchResults), setRes);
    }
  }, [metricsRequested]);

  useEffect(() => {
    setRes([]);
    // setRes(prepTweets(stgSearchResults));
  }, [stgSearchResults]);

  return (
    <TweetDisplay
      title={
        searchMode == 'fulltext'
          ? 'Search results:'
          : searchMode == 'semantic'
          ? 'Semantic search results:'
          : ''
      }
      onMouseEnter={(_) => setMetricsRequested(true)}
      // slice because stgSearchResults are the ones that show up quickly before api metrics kick in
      results={
        isEmpty(res)
          ? prepTweets(slice(0, pre_render_n, stgSearchResults))
          : prepTweets(res)
      }
      emptyMsg={<SearchResMsg />}
    />
  );
}

function SearchResults() {
  return <StgSearchResults stgName="search_results" />;
}

function ContextResults() {
  return <ContextSearchResults />;
}

function ApiSearchResults() {
  // const [stgApiResults, setStgApiResults] = useStorage('api_results', []);
  const { apiTweetResults, setApiTweetResults } = useContext(ApiTweetResults);
  return (
    <TweetDisplay
      title={'Twitter search results:'}
      results={prepTweets(apiTweetResults)}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function QtDisplay() {
  // const auth = useContext(AuthContext);
  const { contextualResults, setContextualResults } =
    useContext(ContextualResults);
  // const [stgQts, setStgQts] = useStorage('qts', []);

  return (
    <TweetDisplay
      title="Quote Tweets:"
      results={prepTweets(contextualResults)}
      emptyMsg={'No Quote Tweets.'}
    />
  );
}

function ApiWaitingDisplay() {
  return <div class="searchTweets">Searching Twitter...</div>;
}
