import type {Format} from "@/lib/utils.ts";
import MyWorker from './worker?worker';


function encode(data: string, format: Format): Promise<string> {
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

    w.onerror = (error: any) => {
      reject(error);
      w.terminate();
    };
    w.postMessage({action: "encode", value: {data, format}});
  });
}

function decode(data: string, format: Format): Promise<string> {
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

    w.onerror = (error: any) => {
      reject(error);
      w.terminate();
    };
    w.postMessage({action: "decode", value: {data, format}});
  });
}

export {encode, decode};