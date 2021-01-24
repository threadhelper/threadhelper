import { createContext, h } from 'preact';
import { StateUpdater, useReducer, useRef, useState } from 'preact/hooks';
import { Header } from './Header';
import { Display } from './Display';
import { DisplayMode } from '../types/interfaceTypes';
import { isEmpty } from 'ramda';

type FeedDisplayReduce = { feedDisplayMode; dispatchFeedDisplayMode };
export const FeedDisplayMode = createContext<FeedDisplayReduce>();

type UpdateFeedDisplayAction = { action: string; tweets: TweetResult[] };
const updateFeedDisplay = (
  state,
  { action, tweets }: UpdateFeedDisplayAction
) => {
  console.log({ action, tweets });
  switch (action) {
    case 'gotSearchResults':
      return isEmpty(tweets) ? DisplayMode.Idle : DisplayMode.Search;
    case 'gotApiResults':
      return isEmpty(tweets) ? DisplayMode.Idle : DisplayMode.Api;
    case 'submitApiSearch':
      return DisplayMode.ApiWaiting;
    case 'gotLatestTweets':
      return DisplayMode.Idle;
    default:
      throw new Error('Unexpected action');
  }
};

export default function ThreadHelper(props: any) {
  const [active, setActive] = useState(true);
  const myRef = useRef(null);

  return (
    <div class="ThreadHelper" ref={myRef}>
      <Sidebar active={active} />
    </div>
  );
}

function Sidebar(props: { active: any }) {
  // const [feedDisplayMode, setFeedDisplayMode] = useState('idle');
  const [feedDisplayMode, dispatchFeedDisplayMode] = useReducer(
    updateFeedDisplay,
    DisplayMode.Idle
  );
  return (
    <FeedDisplayMode.Provider
      value={{ feedDisplayMode, dispatchFeedDisplayMode }}
    >
      <div class="sidebar">
        <Header />
        {/* {roboActive ? <Robo active={props.active} streams={props.streams}/> : null} */}
        <Display />
      </div>
    </FeedDisplayMode.Provider>
  );
}
