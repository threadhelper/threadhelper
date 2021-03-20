import { createContext, h } from 'preact';
import { useReducer, useRef, useState } from 'preact/hooks';
import { useStorage } from '../hooks/useStorage';
import { DisplayMode } from '../types/interfaceTypes';
import { TweetResult } from '../types/msgTypes';
import { rpcBg } from '../utils/dutils';
import { ApiSearchBar } from './ThHeader';
import { Banner } from './Banner';
import { DisplayController } from './Display';
import { TtReader } from './TtReader';

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

async function askPermission() {
  // The callback argument will be true if the user granted the permissions.
  const grantedP = rpcBg('webReqPermission');
  const granted = await grantedP;
  console.log('askPermission', { granted, grantedP });
}

function PermissionAsker() {
  return (
    <div
      onClick={() => {
        askPermission();
      }}
    >
      <Banner
        text="Click to let TH see your tweets!"
        redirect="/#"
        onDismiss={() => {}}
      />
    </div>
  );
}
export default function ThreadHelper(props: any) {
  const [active, setActive] = useState(true);
  const myRef = useRef(null);
  const [showPatchNotes, setShowPatchNotes] = useStorage(
    'showPatchNotes',
    false
  );
  const [webRequestPermission, setWebRequestPermission] = useStorage(
    'webRequestPermission',
    true
  );

  return (
    <div class="ThreadHelper" ref={myRef}>
      {!webRequestPermission && <PermissionAsker />}
      {showPatchNotes && (
        <Banner
          text="New TH update!"
          redirect="https://www.notion.so/Patch-Notes-afab29148a0c49358df0e55131978d48"
          onDismiss={() => setShowPatchNotes(false)}
        />
      )}
      <Sidebar active={active} />
    </div>
  );
}
//
var renderCount = 0;

function Sidebar(props: { active: any }) {
  // const [feedDisplayMode, setFeedDisplayMode] = useState('idle');
  const [auth, setAuth] = useStorage('auth', {});

  const [feedDisplayMode, dispatchFeedDisplayMode] = useReducer(
    updateFeedDisplay,
    DisplayMode.Idle
  );
  return (
    <FeedDisplayMode.Provider
      value={{ feedDisplayMode, dispatchFeedDisplayMode }}
    >
      <AuthContext.Provider value={auth}>
        <div class="sidebar">
          <TtReader />
          <ApiSearchBar />
          <DisplayController />
        </div>
      </AuthContext.Provider>
    </FeedDisplayMode.Provider>
  );
}
