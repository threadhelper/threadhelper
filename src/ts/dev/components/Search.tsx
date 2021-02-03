import { h, render, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { defaultTo, isNil, path, pipe, tap } from 'ramda';
import { useMsg } from '../../hooks/useMsg';
import { postMsg } from '../../utils/dutils';
import { inspect } from '../../utils/putils';
import { dbGetMany, dbOpen } from '../../worker/idb_wrapper';
import { makeIndex, updateIndex, search } from '../../worker/nlp';
import { makeSearchResponse } from '../../worker/stgOps';
import {
  cbTimeFn,
  loadIndexFromIdb,
  updateIdxFromIdb,
} from '../storage/devStgUtils';
import DownIcon from '../../../images/arrow-circle-down.svg';
import { useOption, useStorage } from '../../hooks/useStorage';
import { setStg } from '../../utils/_dutils';
import { JsonToTable } from 'react-json-to-table';
// import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

const db_promise = dbOpen();

// updateIndex(index, tweets2add, ids2remove)

const Search = () => {
  const [query, setQuery] = useStorage('query', '');
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);
  const [getRTs, setGetRTs] = useOption('getRTs');
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks');
  const [useReplies, setUseReplies] = useOption('useReplies');
  const [idleMode, setIdleMode] = useOption('idleMode');
  const [searchMode, setSearchMode] = useOption('searchMode');

  // useEffect(() => {
  //   console.log({
  //     query,
  //     getRTs,
  //     useBookmarks,
  //     useReplies,
  //     idleMode,
  //     searchMode,
  //     activeAccounts,
  //   });
  //   return () => {};
  // }, [
  //   query,
  //   getRTs,
  //   useBookmarks,
  //   useReplies,
  //   idleMode,
  //   searchMode,
  //   activeAccounts,
  // ]);

  return (
    <div id="Search" class="m-4 bg-gray-100">
      <div class="title">Search</div>
      <IndexSearch
        {...{
          query,
          filters: { getRTs, useBookmarks, useReplies },
          accsShown: activeAccounts,
        }}
      />
    </div>
  );
};

const createWorker = createWorkerFactory(
  () => import('../workers/searchWorker')
);

const IndexSearch = ({ query, filters, accsShown }) => {
  const [index, setIndex] = useState(null);
  const [indexN, setIndexN] = useState(0);
  const [resultN, setResultN] = useState(20);
  const idbUpdateIndex = useMsg('idbUpdateIndex');
  const [time, setTime] = useState(0);

  // const worker = useWorker(createWorker);
  // const [message, setMessage] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     // Note: in your actual app code, make sure to check if Home
  //     // is still mounted before setting state asynchronously!
  //     const webWorkerMessage = await worker.hello('Tobi');
  //     setMessage(webWorkerMessage);
  //   })();
  // }, [worker]);

  const loadIdx = (db_promise) => {
    loadIndexFromIdb(db_promise).then(tap(refreshIndexN)).then(setIndex);
  };

  useEffect(() => {
    const seek = async () => {
      const db = db_promise;
      console.log('seek', { filters, accsShown, resultN, index, query });
      const res = await search(filters, accsShown, resultN, index, query);
      const response = await makeSearchResponse(db_promise, res);
      setStg('search_results', response);
    };
    if (!isNil(index)) {
      cbTimeFn(seek, setTime);
    } else {
      console.log('no index');
    }
    return () => {};
  }, [query]);
  //
  useEffect(() => {
    console.log('IndexStg init');
    loadIdx(db_promise);
    return () => {};
  }, []);

  useEffect(() => {
    loadIdx(db_promise);
    return () => {};
  }, [idbUpdateIndex]);

  const refreshIndexN = (index) =>
    setIndexN(isNil(index) ? null : path(['documentStore', 'length'], index));

  return (
    <div>
      <div class="m-4 flex flex-row items-center refresh h-4">
        <DownIcon
          class="h-4"
          onClick={(_) => postMsg({ type: 'idbUpdateIndex' })}
        />
        <div class="pl-4">{`Index Stg: `}</div>
      </div>
      <div class="m-4 flex">
        <JsonToTable
          json={{
            Size: defaultTo('no index', indexN),
            'Search time': `${(time / 1000).toFixed(2)}s`,
            message,
          }}
        />
      </div>
    </div>
  );
};

export default Search;
