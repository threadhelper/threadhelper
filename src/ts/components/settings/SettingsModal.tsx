import { h, Fragment } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import {
  flatten,
  has,
  indexBy,
  isEmpty,
  isNil,
  join,
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
import { userLookupQuery } from '../../bg/twitterScout';
import { useOption, useStorage, useStgPath } from '../../hooks/useStorage';
import { isExist } from '../../utils/putils';
import { ArchiveUploader } from './LoadArchive';
import { SyncIcon } from '../common/Sync';
import { AuthContext } from '../sidebar/Sidebar';
import defaultProfilePic from '../../../images/defaultProfilePic.png';
import { enqueueStgNoDups, rpcBg } from '../../stg/dutils';
import { manualUrl, patchNotes03 } from '../../bg/updateManager';
import { helpUsUrl, thDmUrl, thSurveyUrl } from '../../utils/params';
import { enqueueEvent } from '../../utils/ga';

const Checkbox = ({ get, set, label }) => {
  return (
    <label class="flex items-center mt-4 flex-grow cursor-pointer">
      <input
        type="checkbox"
        class={`h-5 w-5 rounded-md border-2 ${
          get ? 'bg-accent border-borderBg' : 'bg-mainBg border-borderBg'
        }`}
        checked={get}
        onClick={() => {
          set(!get);
        }}
      />
      <span class="ml-4 text-lsm font-medium text-mainTxt hover:text-text-twitterGray">
        {label}
      </span>
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

const accountProps = [
  'name',
  'screen_name',
  'profile_image_url_https',
  'id_str',
];

// const AccountCheckbox = ({ id_str, screen_name }) => {
const AccountCheckbox = ({ account, isUserInfo }) => {
  const [filterItem, setFilterItem] = useStgPath(
    ['activeAccounts', account.id_str, 'showTweets'],
    true
  );
  const [accProp, setAccProp] = useState(() => pick(accountProps, account));
  useEffect(() => {
    const idbGetAcc = async () => {
      const accs = await rpcBg('idbGet', {
        storeName: 'users',
        ids: [prop('id_str', account)],
      });
      setAccProp(pick(accountProps, accs[0]));
    };
    idbGetAcc();
    return;
  }, []);

  return (
    <>
      {/* <Checkbox
        get={filterItem}
        set={setFilterItem}
        label={'@' + account.screen_name}
      /> */}
      <div
        onClick={() => {
          enqueueEvent(
            'settings',
            'account filter',
            (!filterItem).toString(),
            1
          );
          setFilterItem(!filterItem);
        }}
        class={filterItem ? '' : 'opacity-50'}
      >
        <AvatarTrophy {...accProp} showCross={!isUserInfo} link={false} />
      </div>
    </>
  );
};

const idle2Bool = (idleMode: string) => (idleMode === 'random' ? true : false); // String -> Bool
const bool2Idle = (val) => (val ? 'random' : 'timeline');

const SettingsSearch = () => {
  const [getRTs, setGetRTs] = useOption('getRTs');
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks');
  const [useReplies, setUseReplies] = useOption('useReplies');
  const [idleMode, setIdleMode] = useOption('idleMode');
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);
  const [userInfo, setUserInfo] = useStorage('userInfo', null);

  return (
    <div>
      {/* checkmark section */}
      <div class="w-full mb-5">
        <div class="font-medium text-lsm text-twitterGray">
          Let magic search include:
        </div>
        <div class="flex">
          <Checkbox
            get={getRTs}
            set={(val) => {
              enqueueEvent(
                'settings',
                'toggle retweet filter',
                getRTs.toString(),
                1
              );
              setGetRTs(val);
            }}
            label="Retweets"
          />
          <Checkbox
            get={useBookmarks}
            set={(val) => {
              enqueueEvent(
                'settings',
                'toggle bookmark filter',
                useBookmarks.toString(),
                1
              );
              setUseBookmarks(val);
            }}
            label="Bookmarks"
          />
          <Checkbox
            get={useReplies}
            set={(val) => {
              enqueueEvent(
                'settings',
                'toggle reply filter',
                useReplies.toString(),
                1
              );
              setUseReplies(val);
            }}
            label="Replies"
          />
        </div>
      </div>
      <hr></hr>
      {/* idle mode */}
      <div class="w-full mb-5">
        <div class="font-medium text-lsm text-twitterGray">
          Shuffle tweets when idle:
        </div>
        <div class="flex">
          <Checkbox
            get={idle2Bool(idleMode)}
            set={(mode) => {
              enqueueEvent('settings', 'toggle idle mode', bool2Idle(mode), 1);
              console.log('seting idleMode', { mode });
              if (mode) {
                rpcBg('getRandom', null);
              } else {
                rpcBg('getLatest', null);
              }
              return pipe(() => mode, bool2Idle, setIdleMode)();
            }}
            label="Shuffle"
          />
        </div>
      </div>
      <hr></hr>
      <div class="mb-5 mt-4">
        {/* header */}
        <div class="font-medium text-lsm text-twitterGray">
          Search the following accounts:
        </div>
        <div class="flex flex-row flex-wrap justify-evenly">
          {values(activeAccounts).map((x) => {
            return isNil(x.id_str) ? null : (
              <AccountCheckbox
                account={x}
                isUserInfo={
                  has('id_str', userInfo) && has('id_str', x)
                    ? userInfo.id_str == x.id_str
                    : true
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StgCheckbox = ({ stgName }) => {
  const [checked, setChecked] = useStorage(stgName, null);
  return (
    <Checkbox
      get={checked}
      set={(val) => {
        enqueueEvent('settings', 'toggle ' + stgName, val.toString(), 1);
        setChecked(val);
      }}
      label=""
    />
  );
};

// Description, form pairs
const interfaceData = [
  [
    'Hide Twitter search bar (refresh to apply)',
    <StgCheckbox stgName="hideTtSearchBar" />,
  ],
  [
    'Hide Twitter sidebar content (refresh to apply)',
    <StgCheckbox stgName="hideTtSidebarContent" />,
  ],
  ['Minimize tweet actions', <StgCheckbox stgName="minimizeTweetActions" />],
];

const SettingsInterface = () => {
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);
  const [userInfo, setUserInfo] = useStorage('userInfo', null);

  return (
    <div>
      {/* <div class="mb-7 flex justify-between items-center">{'Interface'}</div> */}
      <div class="items-center">
        {map(([description, form]) => {
          return (
            <>
              <div class="flex flex-row justify-between items-center font-medium text-lsm">
                <div class="text-left">{description}</div>
                <div class="text-right">{form}</div>
              </div>
              <hr class="my-2"></hr>
            </>
          );
        }, interfaceData)}
      </div>
    </div>
  );
};

const SettingsData = () => {
  const [activeAccounts, setActiveAccounts] = useStorage('activeAccounts', []);
  const [userInfo, setUserInfo] = useStorage('userInfo', null);
  const [nTweets, setNTweets] = useStorage('nTweets', 0);

  return (
    <div class="mb-7 flex flex-col h-full font-medium text-lsm">
      <div>
        <p>{'Stats'}</p>
        <p class="pl-2 text-twitterGray">{`Your database includes ${nTweets} tweets from the following accounts: ${join(
          ', ',
          map(prop('screen_name'), values(activeAccounts))
        )}.`}</p>
      </div>
      <hr class="my-2 text-mainTxt w-full"></hr>
      <div class="text-twitterGray pt-2 ">
        <ArchiveUploader />
        <div class="pl-2">
          {'To have even more tweets available, '}
          <a
            class="underline hover:opacity-80"
            // class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            style="color: var(--accent-color)"
            href="https://twitter.com/settings/your_twitter_data"
          >
            {'download an archive of your data'}
          </a>
          {', extract it and select data/tweet.js.'}
        </div>
      </div>
    </div>
  );
};

// Description, Hotkey pairs
const hotkeysData = [
  ['Focused search (searches key expressions)', '[[key expression]]'],
  ['Focus Twitter API search bar', 'ctrl + /'],
];

const inlineCodeClass = 'font-mono text-sm inline bg-hoverBg px-1';

// .markdown:code {
//   @apply font-mono text-sm inline bg-grey-lighter px-1;
// }
// .markdown:pre .markdown:code {
//   @apply block bg-black p-4 rounded;
// }

const SettingsHotkeys = () => {
  return (
    <div class="font-medium text-lsm">
      <div>
        {map(([description, hotkey]) => {
          return (
            <>
              <div class="flex flex-row justify-between">
                <div class="text-left">{description}</div>
                <div class="text-right">
                  <code class={inlineCodeClass}>{hotkey}</code>
                </div>
              </div>
              <hr class="my-2"></hr>
            </>
          );
        }, hotkeysData)}
      </div>
      <div class="text-left pb-4">
        <a class="underline hover:text-twitterGray " href={manualUrl}>
          ThreadHelper Manual
        </a>
      </div>
    </div>
  );
};

const SettingsAbout = () => {
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
      const accs = await Promise.all(accPs);
      if (!isExist(accs)) {
        console.error('failed to look up author users');
        return;
      }
      const accProps = map(pick(accountProps), flatten(accs));
      setAccounts(accProps);
    };
    getUsers();
    return;
  }, []);

  return (
    <div class="flex flex-col justify-between h-full">
      <div></div>
      <div class="flex flex-col justify-evenly">
        {/* us */}
        <div class="text-sm  w-full mb-5">
          <div class="text-twitterGray font-semibold">
            ThreadHelper is brought to you by
          </div>
        </div>
        <div class="flex flex-row justify-between pb-5">
          {accounts.map((acc) => (
            <AvatarTrophy {...acc} showCross={false} link={true} />
          ))}
        </div>
        {/* buttons */}
        <div class="flex flex-row space-x-4 justify-between text-base pt-5">
          <div class="flex-1">
            <a href={helpUsUrl} target="_blank">
              <button
                class="w-full border-2 font-black py-1 px-4 rounded-3xl text-accent border-accent text-center hover:opacity-80 text-lg"
                // class="w-full border text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700 font-bold py-1 px-4 rounded-3xl text-center"
              >
                Help us
              </button>
            </a>
          </div>
          <div class="flex-1">
            <a href={thDmUrl}>
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
      <div class="flex flex-row justify-between text-lsm text-twitterGray mb-5">
        {/* helpful links */}
        <div class="text-left">
          <div>
            <p>Privacy Policy: We NEVER keep your data.</p>
          </div>
        </div>
        <div class="text-mainTxt underline text-right">
          <a class="hover:text-twitterGray" href={patchNotes03}>
            {'Patch Notes v' + process.env.VERSION}
          </a>
        </div>
      </div>
    </div>
  );
};

const settingSectionData = {
  Search: <SettingsSearch />,
  Interface: <SettingsInterface />,
  Data: <SettingsData />,
  Hotkeys: <SettingsHotkeys />,
  About: <SettingsAbout />,
};

const SettingsModal = ({ setOpen, setSecretOpen }) => {
  const [section, setSection] = useState('Search');

  return (
    // background shim
    <div
      class="fixed z-40 overflow-auto bg-gray-800 bg-opacity-50 flex bottom-0 top-0 left-0 right-0 items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      // onFocus=(()=>{setOpen(false)})
    >
      <div
        style={{
          // width: '685px',
          width: '730px',
          height: '450px',
        }}
        class="bg-mainBg text-mainTxt max-w-full rounded-4xl text-lg shadow-lg flex flex-row"
      >
        {/* Menu section selector column */}
        <div
          style={{
            width: '125px',
          }}
          class="bg-hoverBg py-7 text-mainTxt text-lg flex flex-col"
        >
          <div class="mb-2 ml-2">SETTINGS</div>
          {map(
            (sectionName) => (
              <div
                class={
                  'hover:bg-mainBg pl-4 py-1 cursor-pointer ' +
                  (sectionName == section ? ' bg-mainBg' : '')
                }
                onClick={(e) => {
                  enqueueEvent('settings', 'settings section', sectionName, 1);
                  setSection(sectionName);
                }}
              >
                {sectionName}
              </div>
            ),
            keys(settingSectionData)
          )}
        </div>
        {/* main menu column */}
        <div
          style={{
            width: '560px',
          }}
          class="bg-mainBg text-mainTxt max-w-full text-lg ml-4 mr-4 py-7"
        >
          {settingSectionData[section]}
        </div>
        <div class="flex flex-col justify-start pt-7 pr-7">
          <SyncIcon />
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
  id_str,
  showCross,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(() => {
    return profile_image_url_https ?? defaultProfilePic;
  });

  useEffect(() => {
    console.log('AvatarTrophy profilePicSrc', { profilePicSrc });
    setProfilePicSrc(profile_image_url_https);
  }, [profile_image_url_https]);

  return (
    <div
      class="flex flex-col items-center px-4 text-xs leading-none mt-6 cursor-pointer"
      onMouseOver={() => setIsHover(!link && true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {link ? (
        <a href={`https://twitter.com/${screen_name}`} class="relative mb-2">
          <div class="w-full h-full absolute rounded-full inset-0 transition-colors duration-200 hover:bg-black hover:bg-opacity-15"></div>
          <img
            class="rounded-full h-16 w-16"
            src={profilePicSrc}
            onError={() => {
              setProfilePicSrc(defaultProfilePic);
              if (id_str) enqueueStgNoDups('queue_lookupUsers', [id_str]);
            }}
          />
        </a>
      ) : (
        <div class="relative">
          {/* {showCross ? (
            <Tooltip
              content={'DANGER: delete tweets from this account.'}
              direction="top"
              delay={100}
            >
              <CrossIcon
                class="top-0 absolute w-3 h-3 cursor-pointer hover:bg-hoverBg"
                style={{ right: '-5px' }}
              />
            </Tooltip>
          ) : (
            <Tooltip
              content={'Active account, switch to another before deleting.'}
              direction="top"
              delay={100}
            >
              <CrossIcon
                class="top-0 absolute w-3 h-3 cursor-pointer hover:bg-hoverBg text-twitterGray stroke-current"
                style={{ right: '-5px' }}
              />
            </Tooltip>
          )} */}
          <div
            class={
              'w-full h-full absolute rounded-full inset-0 transition-colors duration-200 mb-3' +
              (isHover ? ' hover:bg-black hover:bg-opacity-15' : '')
            }
          ></div>
          <img
            class="rounded-full h-16 w-16"
            src={profilePicSrc}
            onError={() => {
              setProfilePicSrc(defaultProfilePic);
              if (id_str) enqueueStgNoDups('queue_lookupUsers', [id_str]);
            }}
          />
        </div>
      )}
      <div class={'font-black text-base' + (isHover ? ' opacity-50' : '')}>
        {name}
      </div>
      <div
        class={
          'font-medium underline text-lsm text-neutral mt-1' +
          (isHover ? ' opacity-50' : '')
        }
      >
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

export default SettingsModal;
