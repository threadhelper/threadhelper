import { createContext, h } from 'preact';
import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
import { useStorage } from '../../hooks/useStorage';
import { DisplayMode } from '../../types/interfaceTypes';
import { TweetResult } from '../../types/msgTypes';
import { rpcBg } from '../../stg/dutils';
import { ApiSearchBar } from './header/ThHeader';
import { Banner } from './Banner';
import { DisplayController } from './feed/Display';
import { TtReader } from '../page/TtReader';
import { isNil } from 'ramda';
import { ContextualSeeker } from '../common/ContextualSeeker';
import { thSurveyUrl } from '../../utils/params';
import { Credentials } from '../../types/types';

// Tweets to show that results from navigation, not explicit search (i.e., QTs, auto search an open tweet's text)
export const ContextualResults = createContext(null);
export const ApiTweetResults = createContext(null);
export const ApiUserResults = createContext(null);
export const AuthContext = createContext<Credentials>({
  authorization: null,
  'x-csrf-token': null,
  name: 'empty_auth',
});
type FeedDisplayReduce = {
  feedDisplayMode: DisplayMode;
  dispatchFeedDisplayMode?;
};
export const FeedDisplayModeContext = createContext<FeedDisplayReduce>({
  feedDisplayMode: DisplayMode.Idle,
});

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
    case 'emptyContextSearch':
      return DisplayMode.Idle;
    case 'submitContextSearch':
      return DisplayMode.Context;
    case 'emptyApiSearch':
      return DisplayMode.Idle;
    case 'typingApiSearch':
      return DisplayMode.Api;
    // return DisplayMode.ApiWaiting;
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
const composeModeStyles =
  'ThreadHelper bg-mainBg rounded-2xl my-4 mx-8 flex-grow overflow-x-visible pointer-events-auto ';
const homeModeStyles =
  'ThreadHelper bg-mainBg rounded-2xl mb-8overflow-x-visible';

const bannersData = {};
export default function ThreadHelper({ inHome }) {
  const [active, setActive] = useState(true);
  const myRef = useRef(null);
  const [patchUrl, setPatchUrl] = useStorage('patchUrl', null);
  const [answeredSurvey, setAnsweredSurvey] = useStorage(
    'answeredSurvey',
    true
  );
  const [webRequestPermission, setWebRequestPermission] = useStorage(
    'webRequestPermission',
    true
  );
  const [hideTtSearchBar, setHideTtSearchBar] = useStorage(
    'hideTtSearchBar',
    null
  );

  return (
    <div
      class={
        (inHome ? homeModeStyles : composeModeStyles) +
        ' ' +
        (hideTtSearchBar ? '' : 'mt-12')
      }
      ref={myRef}
    >
      {!webRequestPermission && <PermissionAsker />}
      {!isNil(patchUrl) && (
        <Banner
          text="New TH update!"
          redirect={patchUrl}
          onDismiss={() => setWebRequestPermission(null)}
        />
      )}
      {!answeredSurvey && (
        <Banner
          text="Help us improve ThreadHelper!"
          redirect={thSurveyUrl}
          onDismiss={() => setAnsweredSurvey(true)}
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
  const [auth, setAuth] = useStorage('auth', null);
  const [contextualResults, setContextualResults] = useState([]);
  const [apiTweetResults, setApiTweetResults] = useState([]);
  const [apiUserResults, setApiUserResults] = useState([]);

  const [feedDisplayMode, dispatchFeedDisplayMode] = useReducer(
    updateFeedDisplay,
    DisplayMode.Idle
  );
  useEffect(() => {
    console.log('Sidebar', { contextualResults });
  }, [contextualResults]);
  return (
    <FeedDisplayModeContext.Provider
      value={{ feedDisplayMode, dispatchFeedDisplayMode }}
    >
      <AuthContext.Provider value={auth}>
        <ContextualResults.Provider
          value={{
            contextualResults,
            setContextualResults,
          }}
        >
          <ApiTweetResults.Provider
            value={{
              apiTweetResults,
              setApiTweetResults,
            }}
          >
            <ApiUserResults.Provider
              value={{
                apiUserResults,
                setApiUserResults,
              }}
            >
              <div class="sidebar">
                <TtReader />
                <ContextualSeeker />
                <ApiSearchBar />
                <DisplayController />
              </div>
            </ApiUserResults.Provider>
          </ApiTweetResults.Provider>
        </ContextualResults.Provider>
      </AuthContext.Provider>
    </FeedDisplayModeContext.Provider>
  );
}
