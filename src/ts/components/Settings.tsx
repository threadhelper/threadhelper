import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { defaultTo, pipe } from 'ramda'; // Function
import GearIcon from '../../images/gear.svg';
import { msgBG } from '../stg/dutils';
import { csEvent } from '../utils/ga';
import SettingsModal, { SecretModal } from './SettingsModal';
import Tooltip from './Tooltip';

export function SettingsButton(props) {
  const [open, setOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);

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
