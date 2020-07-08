let idb = require('idb')

self.addEventListener('message', onMessage)

async function onMessage(ev){
    let data = ev.data;
    switch(data.type){
//        case 'Get Started':
//            self.postMessage('Web Worker Started');
//            break;
//        case 'Other':
//            self.postMessage('Other task...');
//            break;
        case 'getIndex':
            let index_json = await getIndex().then()
            console.time("worker geting index")
            self.postMessage({type:`getIndex`, index_json: index_json});
            break;
        case 'setIndex':
            await setIndex(data.index_json)
            console.time("worker setting index")
            self.postMessage({type:`setIndex`, index_json: data.index_json});
            // data.utils.putDB([{index: data.index_json, id:1, time:2}], 'staged_tweets').then(()=>{console.timeEnd("set index")})
            break;
        case 'handleQuery':
            break;
        default:
            console.log('Invalid access');
            self.postMessage(`got ${data}`);
            // self.close();
    }
}

async function getIndex(){
    let db = await idb.openDB('ThreadHelper', 1)
    console.log("loaded db in worker", db)
    return await db.get('misc', 'index');   
}

async function setIndex(index_json){
    let db = await idb.openDB('ThreadHelper', 1)
    console.log("loaded db in worker", db)
    db.put('misc', index_json, 'index');
}