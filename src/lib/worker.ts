import xmlFormat from "xml-formatter";
import type {WorkerTask, WorkerResponse} from "@/lib/worker-utils.ts";
import {v1, v4, v5, v6, v7} from "uuid";

function formatString(str: string, format: string, indentSize: number) {
  if (str.trim() === '') return str
  if (format === 'JSON') return JSON.stringify(JSON.parse(str), null, indentSize);
  if (format === 'XML') {
    if (indentSize === 0) return xmlFormat.minify(str, {collapseContent: true})
    else return xmlFormat(str, {collapseContent: true, indentation: ' '.repeat(indentSize), lineSeparator: '\n'})
  }
  if (format === 'HTML') {
    let header = "";
    if (str.startsWith('<!DOCTYPE html')) {
      const headerEndIdx = str.indexOf('>');
      header = str.substring(0, headerEndIdx + 1);
      str = str.substring(headerEndIdx + 1);
    }
    if (indentSize === 0) return header + xmlFormat.minify(str, {collapseContent: true})
    else return header + "\n" + xmlFormat(str, {
      collapseContent: true,
      indentation: ' '.repeat(indentSize),
      lineSeparator: '\n'
    })
  }
  return str
}

function generatePassword(length: number, characters: string[]) {
  let password = '';
  const chars = characters.reduce((acc, char) => acc + char);
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function generateUuid(count: number, version: string) {
  return [...Array(count)].map(() => {
    switch (version) {
      case 'v1': return v1();
      case 'v4': return v4();
      case 'v5': return v5('https://dev-tools.app', v4());
      case 'v6': return v6();
      case 'v7': return v7();
      default: return ''
    }
  })
}

// Handle messages from the main thread
self.onmessage = (event: MessageEvent<WorkerTask>) => {
  const task = event.data;

  try {
    let result: unknown;
    switch (task.type) {
      case 'GENERATE_PASSWORD':
        result = generatePassword(task.length, task.characters);
        break;
      case 'GENERATE_UUID':
        result = generateUuid(task.count, task.version);
        break;
      case 'FORMAT_STRING':
        result = formatString(task.data, task.format, task.indentSize);
        break;
      case 'ENCODE_BASE64':
        result = btoa(task.data);
        break;
      case 'DECODE_BASE64':
        result = atob(task.data);
        break;
      case 'ENCODE_URL':
        result = encodeURIComponent(task.data);
        break;
      case 'DECODE_URL':
        result = decodeURIComponent(task.data);
        break;
      case 'DECODE_JWT': {
        const parts = task.data.split('.')
        const header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2)
        const body = JSON.stringify(JSON.parse(atob(parts[1])), null, 2)
        result = {header, body};
        break;
      }
      default:
        throw new Error(`Unknown task type: ${(task as any).type}`);
    }

    const response: WorkerResponse = {type: 'success', result};
    self.postMessage(response);
  } catch (error) {
    console.error(error);
    const response: WorkerResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    self.postMessage(response);
  }
};

export {};