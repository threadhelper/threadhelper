import { h } from 'preact';
import { useState } from 'preact/hooks';
import { defaultTo, isEmpty, path } from 'ramda';
import { useStorage } from '../hooks/useStorage';
import SearchIcon from '../../images/search.svg';

function useInputStg(type, name) {
  const [apiQuery, setApiQuery] = useStorage('apiQuery', '');
  const [value, setValue] = useState('');

  const submiApiSearch = (e) => {
    if (e.key === 'Enter') {
      setApiQuery(value);
      console.log('[DEBUG] submiApiSearch!', { value, e });
    }
  };

  const input = (
    <input
      value={value}
      onChange={(e) => setValue(defaultTo('', path(['target', 'value'], e)))}
      onKeyUp={submiApiSearch}
      type={type}
      style="background-color:rgba(125,125,125,0.1)"
    />
  );
  return [value, input];
}

export function SearchBar() {
  const [value, input] = useInputStg('apiQuery', '');

  return (
    <div class="searchBar">
      <SearchIcon />
      <span>{input}</span>
    </div>
  );
}
