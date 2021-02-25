import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { defaultTo, pipe } from 'ramda'; // Function
import ReactTooltip from 'react-tooltip';
import GearIcon from '../../images/gear.svg';
import { msgBG } from '../utils/dutils';
import { csEvent } from '../utils/ga';
import { Console } from './Console';
import { DropdownMenu } from './Dropdown';
import { ArchiveUploader } from './LoadArchive';
import Tooltip from './Tooltip';
import SettingsModal, { SecretModal } from './SettingsModal';

function onClearStorage() {
  console.log('clear storage');
  msgBG({ type: 'clear' });
}

function onAssessStorage() {
  console.log('assess storage');
  chrome.storage.local.getBytesInUse((b) => {
    console.log(`Storage using ${b} bytes`);
  });
}

function onGetBookmarks() {
  console.log('get bookmarks');
  msgBG({ type: 'get-bookmarks' });
}

const items = [
  // {id: 'Load Archive', leftIcon: <GearIcon />, effect: ()=>{}},
  {
    id: 'Update Timeline',
    leftIcon: '♻',
    effect: () => {
      msgBG({ type: 'update-timeline' });
    },
  },
  { id: 'Reset Storage', leftIcon: '⛔', effect: onClearStorage },
];
const debugItems = [
  { id: 'Assess Storage', leftIcon: '🛠', effect: onAssessStorage },
  {
    id: 'Log Auth',
    leftIcon: '🛠',
    effect: () => {
      msgBG({ type: 'log-auth' });
    },
  },
  {
    id: 'Get User Info',
    leftIcon: '🛠',
    effect: () => {
      msgBG({ type: 'get-user-info' });
    },
  },
  {
    id: 'Update Tweets',
    leftIcon: '🛠',
    effect: () => {
      msgBG({ type: 'update-tweets' });
    },
  },
  {
    id: 'Get Latest',
    leftIcon: '🛠',
    effect: () => {
      msgBG({ type: 'get-latest' });
    },
  },
  { id: 'Get Bookmarks', leftIcon: '🛠', effect: onGetBookmarks },
  {
    id: 'Make Index',
    leftIcon: '🛠',
    effect: () => {
      msgBG({ type: 'make-index' });
    },
  },
];

export function SettingsButton(props) {
  const [open, setOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);

  const closeMenu = pipe(defaultTo(null), (e: MouseEvent) => {
    return !(e.currentTarget as Node).contains(document.activeElement)
      ? () => {
          console.log('[DEBUG] Setting onBlur', { e });
          setOpen(false);
        }
      : null;
  });

  const clickSettings = () => {
    csEvent('User', 'Clicked Settings button', '');
    console.log('Clicked Settings button');
    setOpen(!open);
  };

  const onClickSettings = useCallback(clickSettings, [open]);

  return (
    <div id="settings-menu" className="nav-item">
      {/* <a data-tip="React-tooltip" data-for="settingsButton"> */}
      <Tooltip content={'Options and Settings'} direction="bottom">
        <div class="options icon-button box-content">
          <GearIcon
            class="dropdown-icon"
            style=""
            onClick={() => {
              setOpen(!open);
            }}
          />
        </div>
      </Tooltip>
      {open && !secretOpen && (
        <SettingsModal setOpen={setOpen} setSecretOpen={setSecretOpen} />
      )}
      {secretOpen && <SecretModal setOpen={setSecretOpen} />}
    </div>
  );
}
