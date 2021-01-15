// import * as idb from 'idb'
import { IDBPDatabase, openDB } from 'idb/with-async-ittr.js';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math
/*
DB:
test tweets

timeline tweets

bookmarks

*/
export const open = async () => {
    console.log("OPENING DB");
    const db = await openDB('ThreadHelper', 1, {
        upgrade(db) {
            console.log("version ", (db as any).oldVersion);
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
                    store.createIndex('time', 'time');
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
export const get = curry(async (db: IDBPDatabase, storeName:string, key:any) => {
    return db.get(storeName, key);
});
export const getMany = curry(async (db: IDBPDatabase, storeName, keys) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let promises: any[] = [];
    try {
        for (let key of keys) {
            promises.push(store.get(key));
        }
        promises.push(tx.done);
        return await Promise.all(promises);
    }
    catch (e) {
        throw (e);
    }
});
export const delMany = curry(async (db: IDBPDatabase, storeName, key_list) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let promises: any[] = [];
    try {
        for (let k of key_list) {
            promises.push(store.delete(k));
        }
        promises.push(tx.done);
        return await Promise.all(promises);
    }
    catch (e) {
        console.log({ promises, key_list });
        // throw(e)
    }
});
// list as input
// used only to add tweets to the store
export const putMany = curry(async (db: IDBPDatabase, storeName, item_list) => {
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
    }
    catch (e) {
        console.trace('[ERROR] putMany', { e, storeName, item_list });
        throw (e);
    }
});
export const clear = curry(async (db: IDBPDatabase) => {
    let storeNames = ["tweets", "misc"];
    for (let storeName of storeNames) {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.clear();
        await tx.done;
    }
});
export const iterate = curry(async (db: IDBPDatabase, storeName) => {
    console.log('iterating db');
    // const index = db.transaction('books').store.index('author');
    const tx = db.transaction(storeName);
    // for await (const cursor of index.iterate('Douglas Adams')) {
    for await (const cursor of tx.store) {
        console.log(cursor.value);
    }
});
export const filterDb = curry(async (db: IDBPDatabase, storeName, condFn: (arg0: any) => any) => {
    const tx = db.transaction(storeName);
    let accum: any[] = [];
    // for await (const cursor of index.iterate('Douglas Adams')) {
    for await (const cursor of tx.store) {
        if (condFn(cursor.value))
            accum.push(cursor.value);
    }
    return accum;
});
