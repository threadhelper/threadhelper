import { createContext, h } from 'preact';
import {
  StateUpdater,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'preact/hooks';
import { ApiSearchBar } from './ApiSearchBar';
import { Header } from './Header';
import { TtReader } from './TtReader';
import { DisplayController } from './Display';
import { DisplayMode } from '../types/interfaceTypes';
import { isEmpty } from 'ramda';
import { useStorage } from '../hooks/useStorage';
import Kefir, { Observable } from 'kefir';
import { TweetResult } from '../types/msgTypes';
import { makeStorageChangeObs } from '../utils/dutils';
import { StorageChangeObs } from '../hooks/BrowserEventObs';
import { Banner } from './Banner';

export const AuthContext = createContext<Credentials>({
  authorization: null,
  'x-csrf-token': null,
  name: 'empty_auth',
});
type FeedDisplayReduce = {
  feedDisplayMode: DisplayMode;
  dispatchFeedDisplayMode;
};
export const FeedDisplayMode = createContext<FeedDisplayReduce>(
  DisplayMode.Idle
);

type UpdateFeedDisplayAction = { action: string; tweets: TweetResult[] };
const updateFeedDisplay = (
  state,
  { action, tweets }: UpdateFeedDisplayAction
) => {
  console.log({ state, action, tweets });
  switch (action) {
    case 'emptySearch':
      return DisplayMode.Idle;
    case 'submitSearch':
      return DisplayMode.Search;
    case 'gotSearchResults':
      return DisplayMode.Search;
    // return [DisplayMode.Search, DisplayMode.SearchWaiting].includes(state)
    //     ? DisplayMode.Search
    //     : DisplayMode.Idle;
    // return DisplayMode.Search;
    case 'emptyApiSearch':
      return DisplayMode.Idle;
    case 'submitApiSearch':
      // return DisplayMode.ApiWaiting;
      return DisplayMode.Api;
    case 'gotApiResults':
      // return isEmpty(tweets) ? DisplayMode.Idle : DisplayMode.Api;
      return DisplayMode.Api;
    case 'gotLatestTweets':
      return state;
    case 'gotQts':
      return DisplayMode.QTs;
    default:
      throw new Error('Unexpected action');
  }
};
//
export default function ThreadHelper(props: any) {
  const [active, setActive] = useState(true);
  const myRef = useRef(null);

  return (
    <div class="ThreadHelper" ref={myRef}>
      <Sidebar active={active} />
    </div>
  );
}
//
var renderCount = 0;

function Sidebar(props: { active: any }) {
  // const [feedDisplayMode, setFeedDisplayMode] = useState('idle');
  const [auth, setAuth] = useStorage('auth', {});
  const [showPatchNotes, setShowPatchNotes] = useStorage(
    'showPatchNotes',
    true
  );
  const [feedDisplayMode, dispatchFeedDisplayMode] = useReducer(
    updateFeedDisplay,
    DisplayMode.Idle
  );
  renderCount += 1;
  console.log(`Sidebar render ${renderCount}`);

  // useEffect(() => {
  //   console.log({ auth });
  //   return () => {};
  // }, [auth]);

  return (
    <FeedDisplayMode.Provider
      value={{ feedDisplayMode, dispatchFeedDisplayMode }}
    >
      <AuthContext.Provider value={auth}>
        <div class="sidebar">
          {/* {showPatchNotes && (
            <Banner
              text="New TH update!"
              redirect="https://www.notion.so/Patch-Notes-afab29148a0c49358df0e55131978d48"
              onDismiss={() => setShowPatchNotes(false)}
            />
          )} */}
          <TtReader />
          <ApiSearchBar />
          <DisplayController />
        </div>
      </AuthContext.Provider>
    </FeedDisplayMode.Provider>
  );
}
