import type {Format} from "@/lib/utils.ts";
import MyWorker from './worker?worker';

const worker = new MyWorker();

// Async wrapper
function indentString(data: string, format: Format, indentSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'success') {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error));
      }
    };

    worker.onerror = (error) => reject(error);
    worker.postMessage({action: "indent", value: {data, format, indentSize}});
  });
}

export {indentString};