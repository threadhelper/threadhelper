import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useStorage } from '../hooks/useStorage';
import Tooltip from './Tooltip';
import { msgBG } from '../utils/dutils';
import { getTimeDiff } from './Tweet';
import { join, filter } from 'ramda';

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
    lastUpdated == 'never'
      ? "Haven't gathered tweets yet."
      : `Last synced: ${getTimeDiff(lastUpdated)} ago.`;
  return greet + (sync ? syncedMsg : jobsMsg);
}

export function SyncIcon() {
  const [nTweets, setNTweets] = useStorage('nTweets', 0);
  const [lastUpdated, setLastUpdated] = useStorage('lastUpdated', 'never');
  const [userInfo, setUserInfo] = useStorage('userInfo', 'user');
  const [isMidSearch, setIsMidSearch] = useStorage('isMidSearch', false);
  const [isMidScrape, setIsMidScrape] = useStorage('isMidScrape', false);
  const [isMidStore, seIisMidStore] = useStorage('isMidStore', false);
  const [isMidRefresh, setiIMidRefresh] = useStorage('isMidRefresh', false);
  const [archQueueLength, setArchQueueLength] = useStorage(
    'queue_tempArchive_length',
    0
  );

  return (
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
          (isSync(
            isMidSearch,
            isMidScrape,
            isMidStore,
            isMidRefresh,
            archQueueLength
          )
            ? 'bg-green-400'
            : 'bg-yellow-400')
        }
      ></div>
    </Tooltip>
  );
}
