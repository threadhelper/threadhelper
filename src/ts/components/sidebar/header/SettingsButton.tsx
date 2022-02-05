import { h } from 'preact';
import { useState } from 'preact/hooks';
import GearIcon from '../../../../images/gear.svg';
import SettingsModal from '../../settings/SettingsModal';
import Tooltip from '../../common/Tooltip';
import { enqueueEvent } from '../../../utils/ga';

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
              enqueueEvent('sidebar', 'settings click', 'settings click', 1);
              setOpen(!open);
            }}
          />
        </div>
      </Tooltip>
      {open && !secretOpen && (
        <SettingsModal setOpen={setOpen} setSecretOpen={setSecretOpen} />
      )}
    </div>
  );
}
