import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useStorage } from '../hooks/useStorage';
import { msgBG } from '../utils/dutils';

export function SyncIcon() {
  const [sync, setSync] = useStorage('sync', false);
  const [nTweets, setNTweets] = useStorage('nTweets', 0);
  const [lastUpdated, setLastUpdated] = useStorage('lastUpdated', 'never');
  const [currentScreenName, setCurrentScreenName] = useStorage(
    'currentScreenName',
    'user'
  );

  function onSyncClick() {
    msgBG({ type: 'query', query_type: 'update' });
  }

  useEffect(() => {
    return () => {};
  }, [sync]);

  return (
    <div class={`sync ${sync ? 'synced' : 'unsynced'}`} onClick={onSyncClick}>
      <span class="tooltiptext">
        {' '}
        {`Hi ${currentScreenName}, I have ${nTweets} tweets available. \n Last updated on ${lastUpdated}`}{' '}
      </span>
    </div>
  );
}
