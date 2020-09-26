// import * as idb from 'idb'
import { openDB } from 'idb/with-async-ittr.js';
import { curry } from 'ramda'

/*
DB:
test tweets 

timeline tweets

bookmarks

*/

export const open = async () => {
  console.log("OPENING DB")
  const db = await openDB('ThreadHelper', 1, {
    upgrade(db) {
      console.log("version ",db.oldVersion)
      let oldV = db.oldVersion != null ? db.oldVersion : 0
      switch (oldV) {
        case 0:
          // Create a store of objects
          const store = db.createObjectStore('tweets', {
            // The 'id' property of the object will be the key.
            keyPath: 'id',
            // If it isn't explicitly set, create a value by auto incrementing.
            // autoIncrement: true,
          });
          const misc = db.createObjectStore('misc', {
            // The 'id' property of the object will be the key.
            // keyPath: 'key',
            // If it isn't explicitly set, create a value by auto incrementing.
            // autoIncrement: true,
          });
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
  return db
}


export const get = curry( async (db, storeName, key) => {
  return db.get(storeName, key);
})

export const del = curry( async (db, storeName, key_list) => {
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  let promises = []
  try{
    for (let k of key_list) {
      promises.push(store.delete(k))
    }
    promises.push(tx.done)
    return await Promise.all(promises)        
  } catch(e){
    console.log(promises)
    throw(e)
  }
  return this.db.get(storeName, key);
})

// list as input
// used only to add tweets to the store
export const put = curry( async (db, storeName, item_list) => {
  console.log('putting in db', {db})
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  let promises = []
  try{
    for(let item of item_list){
      promises.push(store.put(item))
    }
    promises.push(tx.done)
    return await Promise.all(promises)        
  } catch(e){
    throw(e)
  }
})

      
export const clear = curry( async (db) => {
  let storeNames = ["tweets", "misc"]
  for (let storeName of storeNames){
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
    await tx.done;
  }
})

export const iterate = curry(async(db, storeName)=>{
  console.log('iterating db')
  // const index = db.transaction('books').store.index('author');
  const tx = db.transaction(storeName);

  // for await (const cursor of index.iterate('Douglas Adams')) {
  for await (const cursor of tx.store) {
    console.log(cursor.value);
    
  }
})

export const filterDb = curry(async (db, storeName, condFn) =>{
  const tx = db.transaction(storeName);
  let accum = []

  // for await (const cursor of index.iterate('Douglas Adams')) {
  for await (const cursor of tx.store) {
    if(condFn(cursor.value)) accum.push(cursor.value)
  }
  return accum
})