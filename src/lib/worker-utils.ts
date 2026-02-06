import MyWorker from './worker?worker';
import type {Format} from "@/lib/utils.ts";

export type WorkerTask =
  | { type: 'GENERATE_PASSWORD', length: number, characters: string[] }
  | { type: 'GENERATE_UUID', count: number, version: string }
  | { type: 'FORMAT_STRING', data: string, format: Format, indentSize: number }
  | { type: 'ENCODE_BASE64', data: string }
  | { type: 'DECODE_BASE64', data: string }
  | { type: 'ENCODE_URL', data: string }
  | { type: 'DECODE_URL', data: string }
  | { type: 'DECODE_JWT', data: string };

export type WorkerResponse<T = any> =
  | { type: 'success', result: T }
  | { type: 'error', error: string, stack?: string };

function postMessage<T>(task: WorkerTask): Promise<T> {
  const w = new MyWorker();
  return new Promise((resolve, reject) => {
    w.onmessage = (e: MessageEvent<WorkerResponse<T>>) => {
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
    w.postMessage(task);
  });
}

export {postMessage};