

export function initWorker(){
  const workerPath = 'worker.js';
  let worker = new Worker(chrome.extension.getURL(workerPath));
  worker.onmessage = testOnMsg
  worker.onerror = onWorkerError
  return worker
}

const testOnMsg = (ev) =>{
  // console.log("Message from worker: ", ev)
}

export function onWorkerMessage(ev){
  console.log("Message from worker: ", ev.data)
  switch(ev.data.type){
    case 'getIndex':
      console.log('got index', ev.data.index_json)
      nlp.onIndexLoaded(ev.data.index_json)
      break;
    case 'setIndex':
      console.log('set index', ev.data.index_json)
      break;
    case 'updateIndex':
      nlp.onIndexLoaded(ev.data.index_json)
      break;
    case 'handleQuery':
      // wiz.has_archive = true
      // console.log("SET HAS ARCHIVE", wiz.tweets_meta)
      // wiz.midRequest = false
      // // wiz.getProfilePics()
      // utils.removeData(["temp_archive"])
      // utils.msgCS({type: "tweets-done", query_type: 'archive'})
      // console.log("archive done!")
      break;
    case 'setTweets':
      wiz.afterUpdateTweets()
  }
}

export function onWorkerError(err){
  console.log(err.message, err.filename);
  console.log(err);
}