import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { isNil, pipe, values } from 'ramda';
import { useOption, useStgPath, useStorage } from '../hooks/useStorage';
import { ArchiveUploader } from './LoadArchive';
import Tooltip from './Tooltip';

const Checkbox = ({ get, set, label }) => {
  return (
    <label class="flex items-center mt-3 flex-grow">
      <input
        type="checkbox"
        class="h-5 w-5"
        checked={get}
        onClick={() => {
          set(!get);
        }}
      />
      <span class="ml-2">{label}</span>
    </label>
  );
};

const ListCheckbox = ({ get, set, label, keyVal }) => {
  const checked = get.includes(keyVal);
  return (
    <label class="flex items-center mt-3 flex-grow">
      <input
        type="checkbox"
        class="h-5 w-5"
        checked={checked}
        onClick={() => {
          if (checked) {
            // remove
            set(get.filter((x) => x !== keyVal));
          } else {
            // add
            set([...get, keyVal]);
          }
        }}
      />
      <span class="ml-2">{label}</span>
    </label>
  );
};

const AccountCheckbox = ({ id_str, screen_name }) => {
  const [filterItem, setFilterItem] = useStgPath(
    ['activeAccounts', id_str, 'showTweets'],
    true
  );
  return (
    <Checkbox get={filterItem} set={setFilterItem} label={'@' + screen_name} />
  );
};

const idle2Bool = (idleMode: string) => (idleMode === 'random' ? true : false); // String -> Bool
const bool2Idle = (val) => (val ? 'random' : 'timeline');

const SettingsModal = ({ setOpen }) => {
  const [getRTs, setGetRTs] = useOption('getRTs');
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks');
  const [useReplies, setUseReplies] = useOption('useReplies');
  const [idleMode, setIdleMode] = useOption('idleMode');
  // const [searchMode, setSearchMode] = useOption('searchMode');
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);

  return (
    // background shim
    <div
      class="fixed z-40 overflow-auto bg-gray-100 bg-opacity-50 flex bottom-0 top-0 left-0 right-0  items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      // onFocus=(()=>{setOpen(false)})
    >
      <div
        style={{
          width: '560px',
          'background-color': 'var(--main-bg-color)',
          color: 'var(--main-txt-color)',
        }}
        class="bg-white max-w-full p-4 rounded-lg text-lg shadow-lg"
      >
        <ArchiveUploader />
        {/* checkmark section */}
        <div class="w-full mb-5">
          <div class=" font-semibold">Let magic search include:</div>
          <div class="flex">
            <Checkbox get={getRTs} set={setGetRTs} label="Retweets" />
            <Checkbox
              get={useBookmarks}
              set={setUseBookmarks}
              label="Bookmarks"
            />
            <Checkbox get={useReplies} set={setUseReplies} label="Replies" />
          </div>
        </div>
        {/* idle mode */}
        <div class="w-full mb-5">
          <div class=" font-semibold">Shuffle tweets when idle:</div>
          <div class="flex">
            <Checkbox
              get={idle2Bool(idleMode)}
              set={pipe(bool2Idle, setIdleMode)}
              label="Shuffle"
            />
          </div>
        </div>
        {/* carousel */}
        <div class="mb-5">
          {/* header */}
          <div class=" font-semibold">Search the following accounts:</div>
          {values(activeAccounts).map((x) => {
            return isNil(x.id_str) ? null : (
              <AccountCheckbox id_str={x.id_str} screen_name={x.screen_name} />
            );
          })}
        </div>
        <div class="px-5">
          <button
            class="w-full border font-bold py-2 px-4 rounded-3xl text-center"
            // class="w-full border text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-2 px-4 rounded-3xl text-center"
            style={{
              color: 'var(--accent-color)',
              borderColor: 'var(--accent-color)',
            }}
          >
            Extremely Secret Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
