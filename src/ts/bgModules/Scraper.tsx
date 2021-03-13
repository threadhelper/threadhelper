import { h, render, Fragment, createContext } from 'preact';
import {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from 'preact/hooks';
import {
  andThen,
  concat,
  defaultTo,
  isNil,
  isEmpty,
  length,
  map,
  path,
  pipe,
  prop,
  split,
  tap,
  trim,
  tryCatch,
} from 'ramda';
import { useStorage } from '../../hooks/useStorage';
import { inspect } from '../../utils/putils';
import {
  apiBookmarkToTweet,
  extractTweetPropIfNeeded,
  saferTweetMap,
} from '../../utils/bgUtils';

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import {
  fetchUserInfo,
  getBookmarks,
  patchArchive,
  timelineQuery,
  tweetLookupQuery,
  userLookupQuery,
} from '../bg/twitterScout';
import RefreshIcon from '../../images/refresh.svg';
import WranggleRpc from '@wranggle/rpc';
import { getData, setData, setStg } from '../utils/dutils';
import {
  apiToTweet,
  archToTweet,
  bookmarkToTweet,
  getArchQtId,
} from '../bg/tweetImporter';
import { useMsg } from '../hooks/useMsg';

const createWorker = createWorkerFactory(
  () => import('../dev/workers/scrapeWorker')
);

const opts = { targetWindow: window, shouldReceive: (x) => true };
const rpc = new WranggleRpc({
  postMessage: opts,
  channel: 'scraper',
  // debug: true,
});
const remote = rpc.remoteInterface();

const AuthValid = createContext({ authValid: false, setAuthValid: null });

const Scraper = () => {
  const [authValid, setAuthValid] = useState(false);
  // const setAuthValid = useCallback(_setAuthValid, []);
  return (
    <div id="Scraper" class="m-4 bg-gray-100">
      <div class="title">Scraper</div>
      <AuthValid.Provider value={{ authValid, setAuthValid }}>
        <AuthUserScraper />
        <ArchiveScraper />
        <TimelineScraper />
        <LookupScraper />
      </AuthValid.Provider>
    </div>
  );
};

const AuthUserScraper = () => {
  const [auth, setAuth] = useStorage('auth', {});
  const { authValid, setAuthValid } = useContext(AuthValid);
  const [userInfo, setUserInfo] = useStorage('userInfo', {});
  const [username, setUsername] = useState('');
  const [stgTweetQueue, setStgTweetQueue] = useStorage('stgTweetQueue', []);

  const worker = useWorker(createWorker);

  useEffect(() => {
    console.log('Scraper userInfo change', { userInfo });
    return () => {};
  }, [userInfo]);

  useEffect(() => {
    console.log('Scraper: auth changed', { auth });
    if (!isNil(prop('authorization', auth))) {
      updateUser();
    } else {
      console.error("can't update user", { auth });
    }
    return () => {};
  }, [auth]);

  const submitAuth = () => {
    try {
    } catch {}
  };

  const updateUser = async () => {
    console.log('running updateUser', { auth, userInfo });
    try {
      const _user = await fetchUserInfo(auth);
      setUserInfo(_user);
      setUsername(prop('screen_name', _user));
      if (!isNil(_user)) {
        setAuthValid(true);
      }
      console.log('updateUser', { _user });
    } catch (error) {
      console.error(error);
      setAuthValid(false);
    }
  };

  const appendStgTweetQueue = async (tweets) => {
    // const stgTweetQueue = await getData('stgTweetQueue');
    setStgTweetQueue(concat(stgTweetQueue, tweets));
  };

  return (
    <div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => remote.getAuth()} />
        Auth: {authValid ? 'valid' : 'not valid'}
      </div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => updateUser()} />
        User: @{username}
      </div>
    </div>
  );
};

const TimelineScraper = () => {
  const [auth, setAuth] = useStorage('auth', {});
  const { authValid, setAuthValid } = useContext(AuthValid);
  const [userInfo, setUserInfo] = useStorage('userInfo', {});
  const [stgTweetQueue, setStgTweetQueue] = useStorage('stgTweetQueue', []);
  // const [user, setUser] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const worker = useWorker(createWorker);

  const getTimeline = async () => {
    if (authValid && !isNil(userInfo)) {
      try {
        const timeline = await timelineQuery(auth, userInfo);
        const thTimeline = map(apiToTweet, timeline);
        setTimeline(timeline);
        appendStgTweetQueue(thTimeline);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const appendStgTweetQueue = async (tweets) => {
    // const stgTweetQueue = await getData('stgTweetQueue');
    setStgTweetQueue(concat(stgTweetQueue, tweets));
  };
  const getBookmarks_ = async () => {
    if (authValid) {
      try {
        const bookmarks = await getBookmarks(auth);
        const thBookmarks = map(bookmarkToTweet, bookmarks);
        setBookmarks(thBookmarks);
        appendStgTweetQueue(thBookmarks);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => getTimeline()} />
        Timeline: {length(timeline)} tweets.
      </div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => getBookmarks_()} />
        Bookmarks: {length(bookmarks)} tweets.
      </div>
    </div>
  );
};

const LookupScraper = () => {
  const [auth, setAuth] = useStorage('auth', {});
  const { authValid, setAuthValid } = useContext(AuthValid);
  const [stgTweetQueue, setStgTweetQueue] = useStorage('stgTweetQueue', []);
  const [lookupIds, setLookupIds] = useState([]);
  const [lookup, setLookup] = useState([]);
  const [lookupUsersIds, setLookupUsersIds] = useState([]);
  const [lookupUsers, setLookupUsers] = useState([]);
  const lookupInputObj = useRef();
  const lookupUsersInputObj = useRef();
  const worker = useWorker(createWorker);

  const appendStgTweetQueue = async (tweets) => {
    // const stgTweetQueue = await getData('stgTweetQueue');
    setStgTweetQueue(concat(stgTweetQueue, tweets));
  };

  const lookupMsg = useMsg('scraperLookup');
  useEffect(() => {
    if (isNil(lookupMsg)) return;
    console.log('Scraper scraperLookup msg', { lookupMsg });
    if (!isNil(lookupMsg.ids)) {
      getLookup(lookupMsg.ids);
    } else {
      console.error('Scraper: no lookup.ids', { ids: lookupMsg.ids });
    }
    return () => {};
  }, [lookupMsg]);

  const getLookup = async (ids) => {
    if (authValid) {
      const lookup = await tweetLookupQuery(auth, ids);
      const thLookup = map(apiToTweet, lookup);
      console.log('lookup', { lookup, thLookup });
      setLookup(lookup);
      appendStgTweetQueue(thLookup);
    }
  };

  const getLookupInput = async () => {
    getLookup(lookupIds);
  };

  const processInput = pipe(
    path(['target', 'value']),
    defaultTo(''),
    split(','),
    map(trim)
  );
  const lookupInput = pipe(processInput, setLookupIds);

  const getLookupUsers = async (names) => {
    if (authValid) {
      const lookupUsers = await userLookupQuery(auth, names);
      console.log('lookup', { lookupUsers });
      setLookupUsers(lookupUsers);
    }
  };

  const getLookupUsersInput = async () => {
    getLookupUsers(lookupUsersIds);
  };
  const lookupUsersInput = pipe(processInput, setLookupUsersIds);

  return (
    <div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => getLookupInput()} />
        Lookup Tweets: {length(lookup)} tweets.
        <textarea
          ref={lookupInputObj}
          class="bg-gray-200 w-64 h-8"
          value={lookupIds}
          onInput={lookupInput}
          // onKeyUp={(e) => (e.key === 'Enter' ? submitSearch(query) : null)}
          onFocus={(e) => e.target?.select()}
        />
      </div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => getLookupUsersInput()} />
        Lookup Users: {length(lookupUsers)} users.
        <textarea
          ref={lookupUsersInputObj}
          class="bg-gray-200 w-64 h-8"
          value={lookupUsersIds}
          onInput={lookupUsersInput}
          // onKeyUp={(e) => (e.key === 'Enter' ? submitSearch(query) : null)}
          onFocus={(e) => e.target?.select()}
        />
      </div>
    </div>
  );
};

const ArchiveScraper = () => {
  const [tempArchive, setTempArchive] = useStorage('temp_archive', []);
  const [archN, setArchN] = useState(0);
  const [auth, setAuth] = useStorage('auth', {});
  const { authValid, setAuthValid } = useContext(AuthValid);
  const [userInfo, setUserInfo] = useStorage('userInfo', {});
  const [stgTweetQueue, setStgTweetQueue] = useStorage('stgTweetQueue', []);
  const worker = useWorker(createWorker);

  useEffect(() => {
    const handleArchive = async () => {
      console.log({ tempArchive });
      if (authValid) {
        const patchedArchive = await patchArchive(auth, userInfo, tempArchive);
        console.log('Scraper patchedArchive', { patchedArchive });
        const thArch = map(archToTweet, patchedArchive);
        console.log('Scraper patchedArchive', { thArch, patchedArchive });
        appendStgTweetQueue(thArch);
        setArchN(length(thArch));
        setTempArchive([]);
      } else {
        console.error("can't patch archive", { userInfo, auth });
      }
    };
    if (!isEmpty(tempArchive)) {
      handleArchive();
    }

    return () => {};
  }, [tempArchive]);

  const appendStgTweetQueue = async (tweets) => {
    // const stgTweetQueue = await getData('stgTweetQueue');
    setStgTweetQueue(concat(stgTweetQueue, tweets));
  };

  return (
    <div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        Archive: {archN}
      </div>
    </div>
  );
};

export default Scraper;
