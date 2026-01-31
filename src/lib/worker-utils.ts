import MyWorker from './worker?worker';

function postMessage<T>(fun: () => T): Promise<T> {
  const w = new MyWorker();
  return new Promise((resolve, reject) => {
    w.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'success') {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
      w.terminate();
    };

    w.onerror = (error) => {
      reject(error);
      w.terminate();
    };
    w.postMessage({executableFunction: fun});
  });
}

export {postMessage};