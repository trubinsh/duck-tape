import type {Format} from "@/lib/utils.ts";
import xmlFormat from "xml-formatter";
import {postMessage} from "@/lib/worker-utils.ts";

function indentString(data: string, format: Format, indentSize: number): Promise<string> {
  return postMessage(() => formatString(data, format, indentSize));
}

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

export {indentString};