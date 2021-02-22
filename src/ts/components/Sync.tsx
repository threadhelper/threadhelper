import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useStorage } from '../hooks/useStorage';
import Tooltip from './Tooltip';
import { msgBG } from '../utils/dutils';
import { getTimeDiff } from './Tweet';

export function SyncIcon() {
  const [sync, setSync] = useStorage('sync', false);
  const [nTweets, setNTweets] = useStorage('nTweets', 0);
  const [lastUpdated, setLastUpdated] = useStorage('lastUpdated', 'never');
  const [currentScreenName, setCurrentScreenName] = useStorage(
    'currentScreenName',
    'user'
  );

  return (
    <Tooltip
      content={
        `Hi ${currentScreenName}, I have ${nTweets} tweets available. \n` +
        (sync ? `Last synced: ${getTimeDiff(lastUpdated)} ago.` : `Syncing...`)
      }
      direction="bottom"
    >
      <div
        class={
          `rounded-full h-3 w-3 mr-2 ` +
          (sync ? 'bg-green-400' : 'bg-yellow-400')
        }
      ></div>
    </Tooltip>
  );
}
