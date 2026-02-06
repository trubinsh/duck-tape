import {postMessage} from "@/lib/worker-utils.ts";

function encodeBase64(data: string): Promise<string> {
  return postMessage<string>({type: 'ENCODE_BASE64', data});
}

function encodeUrl(data: string): Promise<string> {
  return postMessage<string>({type: 'ENCODE_URL', data});
}

function decodeBase64(data: string): Promise<string> {
  return postMessage<string>({type: 'DECODE_BASE64', data});
}

function decodeUrl(data: string): Promise<string> {
  return postMessage<string>({type: 'DECODE_URL', data});
}

function decodeJwt(data: string): Promise<{ header: string, body: string }> {
  return postMessage<{ header: string, body: string }>({type: 'DECODE_JWT', data});
}

export {encodeBase64, encodeUrl, decodeUrl, decodeBase64, decodeJwt};