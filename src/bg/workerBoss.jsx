
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

export function onWorkerError(err){
  console.log(err.message, err.filename);
  console.log(err);
}