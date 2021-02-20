import '@babel/polyfill';
import { isNil, path } from 'ramda';
import { SearchResult } from '../../types/stgTypes';
import { thTweet } from '../../types/tweetTypes';
import { dbOpen } from '../../worker/idb_wrapper';
import { search } from '../../worker/nlp';
import { makeSearchResponse } from '../../worker/stgOps';
import { ThIndexMetadata } from '../components/Search';
import { loadIndexFromIdb } from '../storage/devStgUtils';

export async function fetchUserInfo(auth): Promise<SearchResult[]> {
  // const res = await _fetchUserInfo(auth);
  // return res;
}
