import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useStorage } from '../hooks/useStorage';
import Tooltip from './Tooltip';
import { msgBG } from '../utils/dutils';
import { getTimeDiff } from './Tweet';
import { join, filter, isNil } from 'ramda';

function isSync(
  isMidSearch,
  isMidScrape,
  isMidStore,
  isMidRefresh,
  archQueueLength
) {
  return !(
    isMidSearch ||
    isMidScrape ||
    isMidStore ||
    isMidRefresh ||
    archQueueLength > 0
  );
}

function makeSyncMsg(
  nTweets,
  lastUpdated,
  userInfo,
  isMidSearch,
  isMidScrape,
  isMidStore,
  isMidRefresh,
  archQueueLength
) {
  const greet = `Hi ${
    userInfo.screen_name ?? 'user'
  }, I have ${nTweets} tweets available. \n`;
  const jobs = {
    scrape: `Getting tweets from the Twitter API...`,
    store: `Storing your tweets...`,
    refresh: `Refreshing your old tweets...`,
    arch: `Archive: ${archQueueLength} left to store.`,
  };
  const jobsMsg = join(
    '\n',
    filter((x) => x, [
      ...[isMidScrape && jobs.scrape],
      ...[isMidStore && jobs.store],
      ...[isMidRefresh && jobs.refresh],
      ...[archQueueLength > 0 && jobs.arch],
    ])
  );
  const sync = isSync(
    isMidSearch,
    isMidScrape,
    isMidStore,
    isMidRefresh,
    archQueueLength
  );
  const syncedMsg =
    lastUpdated <= 0 || isNil(lastUpdated)
      ? "Haven't gathered tweets yet."
      : `Last synced: ${getTimeDiff(lastUpdated)} ago.`;
  return greet + (sync ? syncedMsg : jobsMsg);
}

export function GenericSyncIcon({ vanish }) {
  const [synced, setSynced] = useState(false);
  const [nTweets, setNTweets] = useStorage('nTweets', 0);
  const [lastUpdated, setLastUpdated] = useStorage('lastUpdated', 0);
  const [userInfo, setUserInfo] = useStorage('userInfo', 'user');
  const [isMidSearch, setIsMidSearch] = useStorage('isMidSearch', false);
  const [isMidScrape, setIsMidScrape] = useStorage('isMidScrape', false);
  const [isMidStore, seIisMidStore] = useStorage('isMidStore', false);
  const [isMidRefresh, setiIMidRefresh] = useStorage('isMidRefresh', false);
  const [archQueueLength, setArchQueueLength] = useStorage(
    'queue_tempArchive_length',
    0
  );

  useEffect(() => {
    setSynced(
      isSync(
        isMidSearch,
        isMidScrape,
        isMidStore,
        isMidRefresh,
        archQueueLength
      )
    );
  }, [isMidSearch, isMidScrape, isMidStore, isMidRefresh, archQueueLength]);

  return !vanish || !synced ? (
    <Tooltip
      content={makeSyncMsg(
        nTweets,
        lastUpdated,
        userInfo,
        isMidSearch,
        isMidScrape,
        isMidStore,
        isMidRefresh,
        archQueueLength
      )}
      direction="bottom"
      delay={100}
    >
      <div
        class={
          `rounded-full h-3 w-3 mr-2 ` +
          (synced ? 'bg-green-400' : 'bg-yellow-400')
        }
      ></div>
    </Tooltip>
  ) : null;
}

// Vanishes if all is well
export function NinjaSyncIcon() {
  return <GenericSyncIcon vanish={true} />;
}
export function SyncIcon() {
  return <GenericSyncIcon vanish={false} />;
}
