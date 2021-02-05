import * as elasticlunr from 'elasticlunr';
import { h, render, Fragment } from 'preact';
import { useContext, useState } from 'preact/hooks';
import {
  andThen,
  curry,
  defaultTo,
  difference,
  filter,
  ifElse,
  isEmpty,
  isNil,
  keys,
  length,
  map,
  not,
  path,
  pipe,
  tap,
  when,
  __,
} from 'ramda';
import { useEffect } from 'react';
import { archToTweet } from '../../bg/tweetImporter';
import { useStorage } from '../../hooks/useStorage';
import { useMsg } from '../../hooks/useMsg';
import { inspect } from '../../utils/putils';
import { extractTweetPropIfNeeded } from '../../utils/bgUtils';
import {
  dbGetMany,
  dbOpen,
  dbPutMany,
  dbClear,
} from '../../worker/idb_wrapper';
import { addToIndex, makeIndex } from '../../worker/nlp';
import { Query } from '../dev';
import { userInfo } from '../data/user';
import { thTweet } from '../../types/tweetTypes';
import { IDBPDatabase } from 'idb';
import { StoreName, thTwitterDB } from '../../types/dbTypes';
import { Status } from 'twitter-d';
import { updateIndexAndStoreToDb } from '../../worker/stgOps';
import {
  cbTimeFn,
  importTweets,
  loadIndexFromIdb,
  updateIdxFromIdb,
} from '../storage/devStgUtils';

import RefreshIcon from '../../../images/refresh.svg';
import XIcon from '../../../images/x-circle.svg';
import DownIcon from '../../../images/arrow-circle-down.svg';
import { postMsg, resetStorage } from '../../utils/dutils';
import { JsonToTable } from 'react-json-to-table';

const db_promise = dbOpen();

const prepArchTweet = pipe(extractTweetPropIfNeeded, archToTweet(userInfo));

const initIdb = async (db_promise) => {
  const db = await db_promise;
  db.put(StoreName.misc, makeIndex().toJSON(), 'index');
};
const Storage = () => {
  const [query, setQuery] = useStorage('query', '');
  const [auth, setAuth] = useStorage('auth', {});

  useEffect(() => {
    initIdb(db_promise);
    return () => {};
  }, []);

  const doResetStorage = async (_) => {
    const db = await db_promise;
    dbClear(db);
    resetStorage();
    postMsg({ type: 'idbUpdateTweet' });
  };

  return (
    <div id="Storage" class="m-4 bg-gray-100">
      <div class="flex flex-row refresh h-4">
        <XIcon onClick={doResetStorage} />
        <div class="pl-4 title">{`Storage  `}</div>
      </div>
      <TweetStg />
      <IndexStg />
      {/* <div>{'Archive: ' + JSON.stringify(archive)}</div> */}
      <div>{'Query: ' + query}</div>
      <div class="m-4 flex max-w-max overflow-x-auto">
        <JsonToTable
          json={{
            query,
            auth,
          }}
        />
      </div>
    </div>
  );
};

const TweetStg = () => {
  const [tempArchive, setTempArchive] = useStorage('temp_archive', []);
  const [nTweets, setNTweets] = useState(0);
  const [state, updateState] = useState({});
  const [importing, setImporting] = useState(false);
  const idbUpdateMsg = useMsg('idbUpdateTweet');
  const [time, setTime] = useState(0);

  console.log('TweetStg render');
  useEffect(() => {
    getTweetN();
    return () => {};
  }, []);

  useEffect(() => {
    console.log('Storage', { tempArchive });
    const importArchive = async (db_promise, tempArchive) => {
      setImporting(true);
      const db = await db_promise;
      const tweets = await importTweets(db, prepArchTweet, tempArchive);
      const postImport = (tweets) => {
        postMsg({ type: 'idbUpdateTweet' });
        setTempArchive([]);
        getTweetN();
        setImporting(false);
      };
      postImport(tweets);
    };

    if (!(isEmpty(tempArchive) || isNil(tempArchive))) {
      cbTimeFn(() => importArchive(db_promise, tempArchive), setTime);
    }
    return () => {};
  }, [tempArchive]);

  useEffect(() => {
    getTweetN();
    return () => {};
  }, [idbUpdateMsg]);

  const getTweetN = async () => {
    const db = await db_promise;
    const keys = await db.getAllKeys('tweets');
    setNTweets(length(keys));
  };

  return (
    <div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <RefreshIcon class="h-4" onClick={(_) => updateState({})} />
        <div class="pl-4">{`Tweet Stg:`}</div>
        <div class="pl-4">{importing ? `Importing tweets...` : ''}</div>
      </div>
      <div class="m-4 flex">
        <JsonToTable
          json={{
            'Size:': defaultTo('no index', nTweets),
            'Import time': `${(time / 1000).toFixed(2)}s`,
          }}
        />
      </div>
    </div>
  );
};

const IndexStg = () => {
  // const [index, setIndex] = useState(null);
  const [indexN, setIndexN] = useState(0);
  const idbUpdateMsg = useMsg('idbUpdateTweet');
  const [time, setTime] = useState(0);

  console.log('IndexStg render');
  useEffect(() => {
    console.log('IndexStg init');
    loadIndexFromIdb(db_promise).then(refreshIndexN);
    return () => {};
  }, []);

  useEffect(() => {
    const updateIdx = async (db_promise) => {
      const index = await loadIndexFromIdb(db_promise);
      const newIndex = await updateIdxFromIdb(index, db_promise);
      const postUpdate = (index) => {
        postMsg({ type: 'idbUpdateIndex' });
        refreshIndexN(index);
      };
      postUpdate(newIndex);
    };
    console.log('idbUpdateMsg IndexStg');
    // if (!isNil(index)) {
    //   updateIdxFromIdb(index, db_promise)
    //     .then(tap((_) => postMsg({ type: 'idbUpdate' })))
    //     .then(tap(setIndex))
    //     .then(refreshIndexN);
    // }
    cbTimeFn(() => updateIdx(db_promise), setTime);
    return () => {};
  }, [idbUpdateMsg]);

  const refreshIndexN = (idx) =>
    setIndexN(isNil(idx) ? null : path(['documentStore', 'length'], idx));

  return (
    <div>
      <div class="m-4 flex items-center flex-row refresh h-4">
        <DownIcon
          class="h-4"
          onClick={(_) => postMsg({ type: 'idbUpdateTweet' })}
        />
        <div class="pl-4">{`Index Stg:`}</div>
      </div>
      <div class="m-4 flex max-w-max overflow-x-auto ">
        <JsonToTable
          json={{
            'Size:': defaultTo('no index', indexN),
            'Load time': `${(time / 1000).toFixed(2)}s`,
          }}
        />
      </div>
    </div>
  );
};

export default Storage;
