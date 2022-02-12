import { h, render, Fragment } from 'preact';
import { SearchBar } from './SearchBar';
import { ArchiveUploader } from '../../components/LoadArchive';
import { dbOpen } from '../../bg/idb_wrapper';

const TtReader = () => {
  return (
    <div id="TtReader" class="m-4 bg-gray-100">
      <div class="title">TtReader</div>
      <SearchBar show={true} />
      <ArchiveUploader class="bg-gray-200" />
    </div>
  );
};
export default TtReader;
