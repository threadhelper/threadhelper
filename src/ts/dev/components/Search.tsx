import { h, render, Fragment } from 'preact';
import { dbOpen } from '../../worker/idb_wrapper';
import { makeIndex, updateIndex } from '../../worker/nlp';

const db_promise = dbOpen();

const index = makeIndex();
// updateIndex(index, tweets2add, ids2remove)

const Search = () => {
  return (
    <div id="Search" class="m-4 bg-gray-100">
      <div class="title">Search</div>
    </div>
  );
};
export default Search;
