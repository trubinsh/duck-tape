import type {Format} from "@/lib/utils.ts";
import xmlFormat from 'xml-formatter';

export type Action = 'indent'

// Handle messages from the main thread
self.onmessage = (event: MessageEvent) => {
  const { action, value } = event.data as {action: Action, value: {data: string, format: Format, indentSize: number}};

  try {
    let result: string = "";
    if (action === 'indent') {
      result = formatString(value.data, value.format, value.indentSize)
    }
    else {
      throw new Error(`Unknown action: ${action}`)
    }
    self.postMessage({ type: 'success', result });
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

function formatString(str: string, format: Format, indentSize: number) {
  if (str.trim() === '') return str
  if (format === 'JSON') return JSON.stringify(JSON.parse(str), null, indentSize);
  if (format === 'XML') {
    if(indentSize === 0) return xmlFormat.minify(str, { collapseContent: true })
    else return xmlFormat(str, { collapseContent: true, indentation: ' '.repeat(indentSize), lineSeparator: '\n' })
  }
  if (format === 'HTML') {
    let header = "";
    if(str.startsWith('<!DOCTYPE html')) {
      const headerEndIdx = str.indexOf('>');
      header = str.substring(0, headerEndIdx + 1);
      str = str.substring(headerEndIdx + 1);
      console.debug("HTML header:", header)
      console.debug("HTML body:", str)
    }
    if(indentSize === 0) return header + xmlFormat.minify(str, { collapseContent: true })
    else return header + "\n" + xmlFormat(str, { collapseContent: true, indentation: ' '.repeat(indentSize), lineSeparator: '\n' })
  }
  return str
}

export {};