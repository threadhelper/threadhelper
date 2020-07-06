//testing indexedb

if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
}

//Article stre
async function demo() {
    
    const db = await idb.openDB('ThreadHelper', 1, {
      upgrade(db) {
        switch (upgradeDb.oldVersion) {
            case 0:
                // Create a store of objects
                const store = db.createObjectStore('tweets', {
                    // The 'id' property of the object will be the key.
                    keyPath: 'id',
                    // If it isn't explicitly set, create a value by auto incrementing.
                    autoIncrement: true,
                });
                // Create an index on the 'date' property of the objects.
                store.createIndex('time', 'time');
              // a placeholder case so that the switch block will
              // execute when the database is first created
              // (oldVersion is 0)
            default:
            // TODO 4.1 - create 'name' index
        
            // TODO 4.2 - create 'price' and 'description' indexes
        
            // TODO 5.1 - create an 'orders' object store
        
          }
        
      },
    });
  
    // Add an article:
    await db.add('tweets', {
      id: 0,
      name: 'Article 1',
      time: new Date('2019-01-01').getTime(),
      text: '…',
    });
  
    // Add multiple tweets in one transaction:
    {
      const tx = db.transaction('tweets', 'readwrite');
      await Promise.all([
        tx.store.add({
          id: 1,
          name: 'Article 2',
          time: new Date('2019-01-01').getTime(),
          text: '…',
        }),
        tx.store.add({
          id: 2,
          name: 'Article 3',
          time: new Date('2019-01-02').getTime(),
          text: '…',
        }),
        tx.done,
      ]);
    }
  
    // Get all the articles in date order:
    console.log(await db.getAllFromIndex('tweets', 'time'));
  
    // Add 'And, happy new year!' to all articles on 2019-01-01:
    {
      const tx = db.transaction('tweets', 'readwrite');
      const index = tx.store.index('time');
  
      for await (const cursor of index.iterate(new Date('2019-01-01').getTime())) {
        const tweet = { ...cursor.value };
        tweet.text += ' And, happy new year!';
        cursor.update(tweet);
      }
  
      await tx.done;
    }
  }