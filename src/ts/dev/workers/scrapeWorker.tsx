import '@babel/polyfill';
import { defaultTo, isNil, lensProp, path, set } from 'ramda';
import { SearchResult } from '../../types/stgTypes';
import { thTweet } from '../../types/tweetTypes';
import { dbOpen } from '../../worker/idb_wrapper';
import { search } from '../../worker/nlp';
import { makeSearchResponse } from '../../worker/stgOps';
import { ThIndexMetadata } from '../components/Search';
import {
  importTweets,
  removeTweets,
  loadIndexFromIdb,
} from '../storage/devStgUtils';
