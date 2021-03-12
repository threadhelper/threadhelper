import { h, Fragment } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import {
  flatten,
  indexBy,
  isEmpty,
  isNil,
  keys,
  length,
  map,
  pick,
  pipe,
  prop,
  propIs,
  props,
  propSatisfies,
  values,
} from 'ramda';
import { userLookupQuery } from '../bg/twitterScout';
import { useOption, useStgPath, useStorage } from '../hooks/useStorage';
import { isExist } from '../utils/putils';
import { ArchiveUploader } from './LoadArchive';
import { SyncIcon } from './Sync';
import { AuthContext } from './ThreadHelper';
import Tooltip from './Tooltip';
import defaultProfilePic from '../../images/defaultProfilePic.png';
import { ArchiveExporter } from './ArchiveExporter';

const Checkbox = ({ get, set, label }) => {
  return (
    <label class="flex items-center mt-4 flex-grow">
      <input
        type="checkbox"
        class={`h-5 w-5 rounded-md border-2 ${get ? 'bg-accent border-borderBg' : 'bg-mainBg border-borderBg'}`}
        checked={get}
        onClick={() => {
          set(!get);
        }}
      />
      <span class="ml-4 text-lsm font-medium text-neutral">{label}</span>
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

const accountProps = ['name', 'screen_name', 'profile_image_url_https'];

// const AccountCheckbox = ({ id_str, screen_name }) => {
const AccountCheckbox = ({ account }) => {
  const [filterItem, setFilterItem] = useStgPath(
    ['activeAccounts', account.id_str, 'showTweets'],
    true
  );
  const [accProp, setAccProp] = useState(() => pick(accountProps, account));
  return (
    <>
      {/* <Checkbox
        get={filterItem}
        set={setFilterItem}
        label={'@' + account.screen_name}
      /> */}
      <div
        onClick={() => setFilterItem(!filterItem)}
        class={filterItem ? '' : 'opacity-50'}
      >
        <AvatarTrophy {...accProp} link={false} />
      </div>
    </>
  );
};

const idle2Bool = (idleMode: string) => (idleMode === 'random' ? true : false); // String -> Bool
const bool2Idle = (val) => (val ? 'random' : 'timeline');

const SettingsModal = ({ setOpen, setSecretOpen }) => {
  const [getRTs, setGetRTs] = useOption('getRTs');
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks');
  const [useReplies, setUseReplies] = useOption('useReplies');
  const [idleMode, setIdleMode] = useOption('idleMode');
  // const [searchMode, setSearchMode] = useOption('searchMode');
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);

  return (
    // background shim
    <div
      class="fixed z-40 overflow-auto bg-gray-800 bg-opacity-50 flex bottom-0 top-0 left-0 right-0  items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      // onFocus=(()=>{setOpen(false)})
    >
      <div
        style={{
          width: '560px',
        }}
        class="bg-mainBg text-mainTxt max-w-full p-7 rounded-4xl text-lg shadow-lg"
      >
        {/* modal header */}
        <div class="flex justify-end">
          <SyncIcon />
        </div>
        <div class="inline-flex justify-between">
          <ArchiveUploader />
          {/* <ArchiveExporter /> */}
        </div>
        {/* checkmark section */}
        <div class="w-full mb-5">
          <div class="font-medium text-lsm text-neutral">Let magic search include:</div>
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
          <div class="font-medium text-lsm text-neutral">Shuffle tweets when idle:</div>
          <div class="flex">
            <Checkbox
              get={idle2Bool(idleMode)}
              set={pipe(bool2Idle, setIdleMode)}
              label="Shuffle"
            />
          </div>
        </div>
        {/* carousel */}
        {
          // TODO: REMOVE THIS COMMENT, ONLY HERE FOR CSS DEVELOPMENT
          // length(keys(activeAccounts)) > 1 &&
          <div class="mb-5 mt-4">
            {/* header */}
            <div class="font-medium text-lsm text-neutral">Search the following accounts:</div>
            <div class="flex flex-row flex-wrap justify-evenly">
              {values(activeAccounts).map((x) => {
                return isNil(x.id_str) ? null : <AccountCheckbox account={x} />;
              })}
            </div>
          </div>
        }

        <div class="px-5">
          <button
            class="w-full text-accent border-accent border-2 font-black py-2 px-4 rounded-3xl text-center text-xl hover:opacity-80"
            // class="w-full border text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-2 px-4 rounded-3xl text-center"
            onClick={() => setSecretOpen(true)}
          >
            Extremely Secret Button - DO NOT CLICK!
          </button>
        </div>
      </div>
    </div>
  );
};

export const AvatarTrophy = ({
  profile_image_url_https,
  name,
  screen_name,
  link,
}) => {
  return (
    <div class="flex flex-col items-center px-4 text-xs leading-none mt-6">
      {link ? (
        <a href={`https://twitter.com/${screen_name}`} class="relative mb-2">
          <div class="w-full h-full absolute rounded-full inset-0 transition-colors duration-200 hover:bg-black hover:bg-opacity-15"></div>
          <img
            class="rounded-full h-16 w-16"
            src={profile_image_url_https.replace('_normal', '')}
          />
        </a>
      ) : (
        <div class="relative">
          <div class="w-full h-full absolute rounded-full inset-0 transition-colors duration-200 hover:bg-black hover:bg-opacity-15 mb-3"></div>
          <img
            class="rounded-full h-16 w-16"
            src={profile_image_url_https}
          />
        </div>
      )}
      <div class="font-black text-base">{name}</div>
      <div class="font-medium underline text-lsm text-neutral mt-1">
        {link ? (
          <a href={`https://twitter.com/${screen_name}`}>@{screen_name}</a>
        ) : (
          `@${screen_name}`
        )}
      </div>
    </div>
  );
};

const accountNames: string[] = ['exgenesis', 'nosilverv', 'thlpr'];
interface AvatarType {
  name;
  screen_name;
  profile_image;
}

export const SecretModal = ({ setOpen }) => {
  const auth = useContext(AuthContext);
  const [accounts, setAccounts] = useState(() => {
    return accountNames.map((name) => {
      return {
        name,
        screen_name: name,
        profile_image_url_https: defaultProfilePic,
      };
    });
  });

  useEffect(() => {
    const getUsers = async () => {
      const accPs = accountNames.map((name) => {
        return userLookupQuery(auth, [name]);
      });
      console.log('SecretModal', { accountNames, accPs });
      const accs = await Promise.all(accPs);
      console.log('SecretModal', { accountNames, accs });
      if (!isExist(accs)) {
        console.error('failed to look up author users');
        return;
      }
      const accProps = map(pick(accountProps), flatten(accs));
      console.log('SecretModal', { accountNames, accs, accProps });
      setAccounts(accProps);
    };
    getUsers();
    return;
  }, []);

  return (
    // background shim
    <div
      class="fixed z-50 overflow-auto bg-gray-800 bg-opacity-50 flex bottom-0 top-0 left-0 right-0 whitespace-nowrap items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      // onFocus=(()=>{setOpen(false)})
    >
      <div
        style={{
          'background-color': 'var(--main-bg-color)',
          color: 'var(--main-txt-color)',
          borderRadius: '30px'
        }}
        class="bg-white max-w-full px-8 py-5 text-lg shadow-lg"
      >
        {/* header */}
        <div class="text-sm  w-full mb-5">
          <div class="text-gray-400 font-semibold">
            You don’t follow rules. We like that.
          </div>
          <div class="text-gray-400 font-semibold">
            We made ThreadHelper for you.
          </div>
        </div>
        {/* downer */}
        <div class="flex flex-row justify-between">
          {/* us */}
          <div class="flex flex-row">
            {accounts.map((acc) => (
              <AvatarTrophy {...acc} link={true} />
            ))}
          </div>
          {/* buttons */}
          <div class="flex flex-col justify-evenly text-base">
            <div class="px-5">
              <a
                href="https://www.notion.so/Help-us-3b7734d28c514412aab56d51e9886d25"
                target="_blank"
              >
                <button
                  class="w-full border-2 font-black py-1 px-4 rounded-3xl text-accent border-accent text-center hover:opacity-80 text-lg"
                  // class="w-full border text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-1 px-4 rounded-3xl text-center"
                >
                  Help us
                </button>
              </a>
            </div>
            <div class="px-5">
              <a href="https://twitter.com/messages/compose?recipient_id=1329161144817377283">
                <button
                  class="w-full border-2 font-black py-1 px-4 rounded-3xl text-accent border-accent text-center hover:opacity-80 text-lg"
                  // class="w-full border text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-1 px-4 rounded-3xl text-center"
                >
                  Chat with us
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
