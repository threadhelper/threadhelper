import { h } from 'preact';
import { useState } from 'preact/hooks';

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
      <span class="ml-2 text-gray-700">{label}</span>
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
      <span class="ml-2 text-gray-700">{label}</span>
    </label>
  );
};

const SettingsModal = ({ setOpen, alts = ['alt1', 'alt2', 'alt3'] }) => {
  const [includeRetweets, setIncludeRetweets] = useState(false);
  const [includeBookmarks, setIncludeBookmarks] = useState(false);
  const [includeReplies, setIncludeReplies] = useState(false);
  const [searchedAlts, setSearchedAlts] = useState([]);
  return (
    // background shim
    <div
      class="fixed z-40 overflow-auto bg-gray-100 bg-opacity-50 flex bottom-0 top-0 left-0 right-0  items-center justify-center"
      onClick={(e) => {
        if (e.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        style={{ width: '560px' }}
        class="bg-white max-w-full p-4 rounded-lg text-lg shadow-lg"
      >
        <div class="mb-3">
          <button class="text-gray-700 underline hover:text-gray-900">
            Upload Twitter archive
          </button>
        </div>
        {/* checkmark section */}
        <div class="w-full mb-5">
          <div class="text-gray-500 font-semibold">
            Let magic search include:
          </div>
          <div class="flex">
            <Checkbox
              get={includeRetweets}
              set={setIncludeRetweets}
              label="Retweets"
            />
            <Checkbox
              get={includeBookmarks}
              set={setIncludeBookmarks}
              label="Bookmarks"
            />
            <Checkbox
              get={includeReplies}
              set={setIncludeReplies}
              label="Replies"
            />
          </div>
        </div>
        {/* carousel */}
        <div class="mb-5">
          {/* header */}
          <div class="text-gray-500 font-semibold">
            Search the following accounts:
          </div>
          {alts.map((x) => {
            return (
              <ListCheckbox
                get={searchedAlts}
                set={setSearchedAlts}
                label={x}
                keyVal={x}
              />
            );
          })}
        </div>
        <div class="px-5">
          <button class="w-full border text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-2 px-4 rounded-3xl text-center">
            Extremely Secret Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
