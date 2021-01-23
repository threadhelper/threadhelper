import { h } from 'preact';
import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
// flattenModule(global,R)
import {
  defaultTo,
  filter,
  isEmpty,
  isNil,
  not,
  path,
  pipe,
  prop,
} from 'ramda'; // Function
import { useOption, useStorage } from '../hooks/useStorage';
import { SearchResult, TweetResult } from '../types/msgTypes';
import { Tweet as TweetCard } from './Tweet';

const prepTweets = (list: TweetResult[] | null): SearchResult[] =>
  filter(pipe(prop('tweet'), isNil, not), defaultTo([], list));

export function Display(props: any) {
  const [tweets, setTweets] = useState([]);
  // const query = useStream(props.composeQuery, '')
  const myRef = useRef(null);

  const [searchResults, setSearchResults] = useStorage('search_results', []);
  const [latestTweets, setLatestTweets] = useStorage('latest_tweets', []);
  const [apiResults, setApiResults] = useStorage('api_results', []);

  type UpdateFeedDisplayAction = { action: string; tweets: TweetResult[] };
  const updateFeedDisplay = (
    state,
    { action, tweets }: UpdateFeedDisplayAction
  ) => {
    console.log({ action, tweets });
    const _tweets = prepTweets(tweets);
    const _latest = prepTweets(latestTweets);
    switch (action) {
      case 'gotSearchResults':
        return isEmpty(_tweets) ? (
          <IdleDisplay tweets={_latest} />
        ) : (
          <SearchResults tweets={_tweets} />
        );
      case 'gotApiResults':
        return isEmpty(_tweets) ? (
          <IdleDisplay tweets={_latest} />
        ) : (
          <ApiSearchResults tweets={_tweets} />
        );
      case 'gotLatestTweets':
        return <IdleDisplay tweets={_latest} />;
      default:
        throw new Error('Unexpected action');
    }
  };
  const [feedDisplay, dispatchFeedDisplay] = useReducer(
    updateFeedDisplay,
    <IdleDisplay tweets={tweets} />
  );

  useEffect(() => {
    dispatchFeedDisplay({
      action: 'gotLatestTweets',
      tweets: latestTweets,
    });
    return () => {};
  }, [latestTweets]);

  useEffect(() => {
    dispatchFeedDisplay({
      action: 'gotApiResults',
      tweets: apiResults,
    });
    return () => {};
  }, [apiResults]);

  useEffect(() => {
    dispatchFeedDisplay({
      action: 'gotSearchResults',
      tweets: searchResults,
    });
    return () => {};
  }, [searchResults]);

  return (
    <div class="searchWidget" ref={myRef}>
      {feedDisplay}
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
  tweets: TweetResult[];
  emptyMsg: string;
};
function TweetDisplay({ title, tweets, emptyMsg }: TweetDisplayProps) {
  return (
    <div class="searchTweets">
      <div class="text-right	">{title}</div>
      {isEmpty(tweets) ? 'No search results.' : tweets.map(buildTweetComponent)}
    </div>
  );
}

function IdleDisplay({ tweets }: { tweets: TweetResult[] }) {
  const [idleMode, setIdleMode] = useOption('idleMode');
  return (
    <TweetDisplay
      title={
        idleMode == 'timeline'
          ? 'Latest tweets:'
          : idleMode == 'random'
          ? 'Random tweets:'
          : ''
      }
      tweets={tweets}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function SearchResults({ tweets }: { tweets: TweetResult[] }) {
  const [searchMode, setSearchMode] = useOption('searchMode');
  return (
    <TweetDisplay
      title={
        searchMode == 'fulltext'
          ? 'Search results:'
          : searchMode == 'semantic'
          ? 'Semantic search results:'
          : ''
      }
      tweets={tweets}
      emptyMsg={'No search results. Yet!'}
    />
  );
}

function ApiSearchResults({ tweets }: { tweets: TweetResult[] }) {
  return (
    <TweetDisplay
      title={'Twitter API results:'}
      tweets={tweets}
      emptyMsg={'No search results. Yet!'}
    />
  );
}
