import { h, render, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  append,
  defaultTo,
  gte,
  ifElse,
  init,
  isEmpty,
  isNil,
  length,
  mean,
  path,
  pipe,
  prop,
  remove,
  tap,
} from 'ramda';
import { useMsg } from '../../hooks/useMsg';
import { postMsg, setStg } from '../../utils/dutils';
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
import { JsonToTable } from 'react-json-to-table';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

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

export type ThIndexMetadata = { size: number | null };

export const useWindow = (initVal, n) => {
  const [val, setVal] = useState(initVal);

  const updateValueWindow = (newVal) => {
    setVal(
      ifElse(
        pipe(length, gte(n)),
        append(newVal),
        pipe(remove(0, 1), append(newVal))
      )(val)
    );
  };

  return [val, updateValueWindow];
};

const IndexSearch = ({ query, filters, accsShown }) => {
  const [index, setIndex] = useState(null);
  const [indexN, setIndexN] = useState(0);
  const [resultN, setResultN] = useState(20);
  const idbUpdateIndex = useMsg('idbUpdateIndex');
  const [searchTimes, setSearchTimes] = useWindow([], 10);
  const [searchTime, setSearchTime] = useState(0);
  const [loadTime, setLoadTime] = useState(0);
  const [stgTime, setStgTime] = useState(0);
  const [midSearch, setMidSearch] = useState(false);

  const worker = useWorker(createWorker);
  const [message, setMessage] = useState(null);

  // const loadIdx = (db_promise) => {
  //   loadIndexFromIdb(db_promise).then(tap(refreshIndexN)).then(setIndex);
  // };
  const workerLoadIdx = async () => {
    if (!isNil(worker)) {
      cbTimeFn(worker.loadIndex, setLoadTime).then(refreshIndexN);
    }
  };

  useEffect(() => {
    // const seek = async () => {
    //   console.log('seek', { filters, accsShown, resultN, index, query });
    //   const res = await search(filters, accsShown, resultN, index, query);
    //   const response = await makeSearchResponse(db_promise, res);
    // };
    // cbTimeFn(seek.then(setStg('search_results'), setSearchTime);
    if (!isEmpty(query) && !isNil(query)) {
      const doSeek = async () => {
        const searchRes = await cbTimeFn(
          () => worker.seek(filters, accsShown, resultN, query),
          setSearchTimes
        );
        cbTimeFn(() => setStg('search_results', searchRes), setStgTime);
      };
      // .then((data) => postMsg({ type: 'searchResults', data }))

      if (!midSearch) {
        setMidSearch(true);
        doSeek().then((_) => {
          setMidSearch(false);
        });
      }
    }

    return () => {};
  }, [query]);
  //
  useEffect(() => {
    // loadIdx(db_promise);
    workerLoadIdx();
    return () => {};
  }, [worker]);

  useEffect(() => {
    // loadIdx(db_promise);
    workerLoadIdx();
    return () => {};
  }, [idbUpdateIndex]);

  const idxSize = (index): number | null =>
    isNil(index) ? null : path(['documentStore', 'length'], index);

  const refreshIndexN = (data: ThIndexMetadata) => {
    setIndexN(prop('size', data));
  };

  return (
    <div>
      <div class="m-4 flex flex-row items-center refresh h-4">
        <DownIcon class="h-4" onClick={(_) => workerLoadIdx()} />
        <div class="pl-4">{`Worker Index: `}</div>
      </div>
      <div class="m-4 flex">
        <JsonToTable
          json={{
            Size: defaultTo('no index', indexN),
            'Load time': ms2Str(loadTime),
            'Search time': ms2Str(mean(searchTimes)),
            'Store time': ms2Str(stgTime),
            midSearch: midSearch ? 'true' : 'false',
          }}
        />
      </div>
    </div>
  );
};

export const ms2Str = (time) => `${(time / 1000).toFixed(3)}s`;

export default Search;
