import { h } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
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
import { DisplayMode } from '../types/interfaceTypes';
import { SearchResult, TweetResult } from '../types/msgTypes';
import { FeedDisplayMode } from './ThreadHelper';
import { Tweet as TweetCard } from './Tweet';

const prepTweets = (list: TweetResult[] | null): SearchResult[] =>
  filter(pipe(prop('tweet'), isNil, not), defaultTo([], list));

export function Display(props: any) {
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );
  const myRef = useRef(null);

  const [searchResults, setSearchResults] = useStorage('search_results', []);
  const [latestTweets, setLatestTweets] = useStorage('latest_tweets', []);
  const [apiResults, setApiResults] = useStorage('api_results', []);

  const makeFeedDisplay = (displayMode: DisplayMode) => {
    switch (displayMode) {
      case 'Idle':
        return <IdleDisplay tweets={prepTweets(latestTweets)} />;
      case 'Api':
        return <ApiSearchResults tweets={prepTweets(apiResults)} />;
      case 'ApiWaiting':
        return <ApiWaitingDisplay />;
      case 'Search':
        return <SearchResults tweets={prepTweets(searchResults)} />;
    }
  };

  useEffect(() => {
    dispatchFeedDisplayMode({
      action: 'gotLatestTweets',
      tweets: prepTweets(latestTweets),
    });
    return () => {};
  }, [latestTweets]);

  useEffect(() => {
    dispatchFeedDisplayMode({
      action: 'gotApiResults',
      tweets: prepTweets(apiResults),
    });
    return () => {};
  }, [apiResults]);

  useEffect(() => {
    dispatchFeedDisplayMode({
      action: 'gotSearchResults',
      tweets: prepTweets(searchResults),
    });
    return () => {};
  }, [searchResults]);

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

function ApiWaitingDisplay() {
  return <div class="searchTweets">Searching...</div>;
}
