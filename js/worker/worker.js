// "use strict";
let idb = require('idb')
let elasticlunr = require('elasticlunr')
let db = {}
idb.openDB('ThreadHelper', 1).then((_db)=>{db = _db})

self.addEventListener('message', onMessage)


async function onMessage(ev){
    let data = ev.data;
    db = db != null ? db : await idb.openDB('ThreadHelper', 1)
    let index_json = ''
    console.log("WORKER GOT MESSAGE", ev.data)
    switch(data.type){
//        case 'Get Started':
//            self.postMessage('Web Worker Started');
//            break;
//        case 'Other':
//            self.postMessage('Other task...');
//            break;
        case 'getIndex':
            // let db = await idb.openDB('ThreadHelper', 1)
            index_json = await getIndex(db).then()
            self.postMessage({type:`getIndex`, index_json: index_json});
            break;
        case 'setIndex':
            // let db = await idb.openDB('ThreadHelper', 1)
            await setIndex(db, data.index_json)
            self.postMessage({type:`setIndex`, index_json: data.index_json});
            // data.utils.putDB([{index: data.index_json, id:1, time:2}], 'staged_tweets').then(()=>{console.timeEnd("set index")})
            break;
        case 'handleQuery':
            console.log("handling archive")
            handleQuery(data)
            self.postMessage({type:`handleQuery`});
            break;
        case 'getProfilePics':
            console.log('(not) getting profile pics')
            break;
        case 'addToIndex':
            let tweets = data.tweets
            index_json = await getIndex(db)
            console.assert(index_json!=null)
            let loaded_index = elasticlunr.Index.load(index_json)
            let _index = await addToIndex(loaded_index, tweets)
            index_json = _index.toJSON()
            await setIndex(db, index_json)
            self.postMessage({type:'addToIndex', index_json: index_json})
            break;
        default:
            console.log('Invalid access');
            self.postMessage(`got ${data}`);
            // self.close();
    }
}

async function getIndex(db){
    console.time("worker getting index")
    console.log("loaded db in worker", db)
    let index_json = await db.get('misc', 'index');   
    console.timeEnd("worker getting index")
    return index_json
}

async function setIndex(db, index_json){
    console.time("worker setting index")
    console.log("loaded db in worker", db)
    db.put('misc', index_json, 'index');
    console.timeEnd("worker setting index")
}

async function handleQuery(data){
    console.time("handle query")
    await saveTweets(data.temp_archive, 'archive')
}

async function addToIndex(index,_tweets){
    console.time(`add ${Object.keys(_tweets).length} To Index`)
    let tweet_fields = [
        "id",
        "text", 
        "name", 
        "username", 
        //"time", 
        "reply_to",
        "mentions"
      ]

    for (const [id, tweet] of Object.entries(_tweets)){
        var doc = {}
        for (var f of tweet_fields){
        doc[f] = tweet[f]
        }
        doc["id"] = id
        index.addDoc(doc)
    }
    console.timeEnd(`add ${Object.keys(_tweets).length} To Index`)
    return index
}