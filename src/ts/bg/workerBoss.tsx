
export function initWorker(){
  const workerPath = 'worker.bundle.js';
  let worker = new Worker(chrome.extension.getURL(workerPath));
  worker.onmessage = testOnMsg
  worker.onerror = onWorkerError
  return worker
}

const testOnMsg = (ev) =>{
  // console.log("Message from worker: ", ev)
}

export function onWorkerError(err: { message: any; filename: any; }){
  console.log('[ERROR] Worker Error',{err});
}