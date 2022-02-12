import { h, Fragment } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { SearchBar } from './SearchBar';

const Feed = ({}) => {
  return (
    <div id="Feed">
      <div id="header"></div>
      <SearchBar show={true} />
      <div id="controlPanel"></div>
    </div>
  );
};
export default <Feed />;
