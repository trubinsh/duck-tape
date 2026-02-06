import type {Format} from "@/lib/utils.ts";
import {postMessage} from "@/lib/worker-utils.ts";

function indentString(data: string, format: Format, indentSize: number): Promise<string> {
  return postMessage<string>({type: 'FORMAT_STRING', data, format, indentSize});
}

export {indentString};