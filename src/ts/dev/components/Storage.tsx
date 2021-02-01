import { h, render, Fragment } from 'preact';
import { useEffect } from 'react';
import { useStorage } from '../../hooks/useStorage';

const Storage = () => {
  const [query, setQuery] = useStorage('query', '');
  const [archive, setArchive] = useStorage('temp_archive', []);

  return (
    <div id="Storage" class="m-4 bg-gray-100">
      <div class="title">Storage</div>
      <div>{'Archive: ' + JSON.stringify(archive)}</div>
      <div>{'Query: ' + query}</div>
    </div>
  );
};
export default Storage;
