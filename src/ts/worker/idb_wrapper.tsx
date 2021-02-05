// import * as idb from 'idb'
import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr.js';
import { curry } from 'ramda'; // Function
import { User } from 'twitter-d';
import { thTweet } from '../types/tweetTypes';
import { thTwitterDB, StoreName } from '../types/dbTypes';
/*
DB:
test tweets

timeline tweets

bookmarks

*/

export const dbOpen = async () => {
  console.log('OPENING DB');
  const db = await openDB<thTwitterDB>('ThreadHelper', 1, {
    upgrade(db) {
      console.log('version ', (db as any).oldVersion);
      let oldV = (db as any).oldVersion != null ? (db as any).oldVersion : 0;
      switch (oldV) {
        case 0:
          // Create a store of objects
          const store = db.createObjectStore('tweets', {
            // The 'id' property of the object will be the key.
            keyPath: 'id',
          });
          const accounts = db.createObjectStore('accounts', {
            keyPath: 'id_str',
          });
          const users = db.createObjectStore('users', {
            keyPath: 'id_str',
          });
          const misc = db.createObjectStore('misc', {});
          // Create an index on the 'date' property of the objects.
          // store.createIndex('time', 'time');
          // a placeholder case so that the switch block will
          // execute when the database is first created
          // (oldVersion is 0)
          break;
        default:
          break;
      }
    },
  });
  return db;
};
export const dbGet = curry(
  async (db: IDBPDatabase, storeName: string, key: any) => {
    return db.get(storeName, key);
  }
);
export const dbGetMany = curry(async (db: IDBPDatabase, storeName, keys) => {
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  let promises: any[] = [];
  try {
    for (let key of keys) {
      promises.push(store.get(key));
    }
    promises.push(tx.done);
    return await Promise.all(promises);
  } catch (e) {
    throw e;
  }
});
export const dbDelMany = curry(
  async (
    db: IDBPDatabase,
    storeName: StoreName,
    key_list: string[]
  ): Promise<any[]> => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let promises: any[] = [];
    try {
      for (let k of key_list) {
        promises.push(store.delete(k));
      }
      promises.push(tx.done);
      return await Promise.all(promises);
    } catch (e) {
      console.log({ promises, key_list });
    }
  }
);
// list as input
// used only to add tweets to the store
export const dbPutMany = curry(
  async (
    db: IDBPDatabase<thTwitterDB>,
    storeName: StoreName,
    item_list: object[]
  ): Promise<any[]> => {
    console.log('putting in db', { db, storeName, item_list });
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let promises: any[] = [];
    try {
      for (let item of item_list) {
        promises.push(store.put(item));
      }
      promises.push(tx.done);
      return await Promise.all(promises);
    } catch (e) {
      console.trace('[ERROR] putMany', { e, storeName, item_list });
      throw e;
    }
  }
);
export const dbClear = curry(async (db: IDBPDatabase<thTwitterDB>) => {
  let storeNames: StoreName[] = [
    StoreName.tweets,
    StoreName.accounts,
    StoreName.users,
    StoreName.misc,
  ];
  for (let storeName of storeNames) {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
    await tx.done;
  }
});
export const dbIterate = curry(
  async (db: IDBPDatabase, storeName: StoreName) => {
    console.log('iterating db');
    const tx = db.transaction(storeName);
    for await (const cursor of tx.store) {
      console.log(cursor.value);
    }
  }
);
export const dbFilter = curry(
  async <T,>(
    db: IDBPDatabase<thTwitterDB>,
    storeName: StoreName,
    condFn: (arg0: T) => boolean
  ): Promise<T[]> => {
    const tx = db.transaction(storeName);
    let accum: T[] = [];
    for await (const cursor of tx.store) {
      if (condFn(cursor.value)) accum.push(cursor.value);
    }
    return accum;
  }
);
