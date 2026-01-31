import {postMessage} from "@/lib/worker-utils.ts";

function encodeBase64(data: string): Promise<string> {
  return postMessage(() => btoa(data));
}

function encodeUrl(data: string): Promise<string> {
  return postMessage(() => encodeURIComponent(data));
}

function decodeBase64(data: string): Promise<string> {
  return postMessage(() => atob(data));
}

function decodeUrl(data: string): Promise<string> {
  return postMessage(() => decodeURIComponent(data));
}

function decodeJwt(data: string): Promise<{ header: string, body: string }> {
  const fun = () => {
    const parts = data.split('.')
    const header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2)
    const body = JSON.stringify(JSON.parse(atob(parts[1])), null, 2)
    return {header, body}
  }
  return postMessage(fun);
}

export {encodeBase64, encodeUrl, decodeUrl, decodeBase64, decodeJwt};