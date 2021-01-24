import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useStorage } from '../hooks/useStorage';
import { msgBG } from '../utils/dutils';

export function SyncIcon() {
  const [sync, setSync] = useStorage('sync', false);
  const [syncDisplay, setSyncDisplay] = useStorage(
    'syncDisplay',
    'default sync display msg'
  );

  function onSyncClick() {
    msgBG({ type: 'query', query_type: 'update' });
  }

  useEffect(() => {
    return () => {};
  }, [sync]);

  return (
    <div class={`sync ${sync ? 'synced' : 'unsynced'}`} onClick={onSyncClick}>
      <span class="tooltiptext"> {syncDisplay} </span>
    </div>
  );
}
