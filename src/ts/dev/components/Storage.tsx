import { h, render, Fragment } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { andThen, isEmpty, isNil, length, map, pipe, __ } from 'ramda';
import { useEffect } from 'react';
import { archToTweet } from '../../bg/tweetImporter';
import { useStorage } from '../../hooks/useStorage';
import { inspect } from '../../utils/putils';
import { extractTweetPropIfNeeded } from '../../utils/bgUtils';
import { dbOpen, dbPutMany } from '../../worker/idb_wrapper';
import { makeIndex } from '../../worker/nlp';
import { Query } from '../dev';
import { userInfo } from '../data/user';
import { thTweet } from '../../types/tweetTypes';
import { IDBPDatabase } from 'idb';
import { StoreName, thTwitterDB } from '../../types/dbTypes';

const db_promise = dbOpen();
const index = makeIndex();

const prepArchTweet = pipe(extractTweetPropIfNeeded, archToTweet(userInfo));
const Storage = () => {
  const [query, setQuery] = useStorage('query', '');

  return (
    <div id="Storage" class="m-4 bg-gray-100">
      <div class="title">Storage</div>
      <TweetStg />
      {/* <div>{'Archive: ' + JSON.stringify(archive)}</div> */}
      <div>{'Query: ' + query}</div>
    </div>
  );
};

const importData = <T, S>(
  db: IDBPDatabase<thTwitterDB>,
  storeName: StoreName,
  prepFn: (x: S) => T,
  tweets: S[]
) => {
  return pipe(() => tweets, map(prepFn), dbPutMany(db, storeName))();
};

const TweetStg = () => {
  const [tempArchive, setTempArchive] = useStorage('temp_archive', []);
  const [nTweets, setNTweets] = useState(0);

  console.log('TweetStg render');

  useEffect(() => {
    console.log('Storage', { tempArchive });
    if (!(isEmpty(tempArchive) || isNil(tempArchive))) {
      db_promise.then((db) =>
        pipe(
          () => tempArchive,
          importData(db, StoreName.tweets, prepArchTweet),
          andThen((_) => setTempArchive([])),
          andThen((_) => getTweetN())
        )()
      );
    }
    return () => {};
  }, [tempArchive]);

  const getTweetN = pipe(
    () => db_promise,
    andThen((db) => db.getAllKeys('tweets')),
    andThen(length),
    andThen(setNTweets)
  );

  return <div>{`Tweet Stg: ${nTweets}`}</div>;
};

export default Storage;
