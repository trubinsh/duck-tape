import {useContext, useEffect, useState} from "react";
import {ClipboardAwareContext} from "@/components/clipboard-provider.tsx";
import type {Format} from "@/lib/utils.ts";

function useClipboardAwareContext() {
  return useContext(ClipboardAwareContext);
}

const isUrl = (str: string) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(str) || /^https?:\/\/localhost(:\d+)?(\/.*)?$/.test(str)
const isJson = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
const isBase64 = (str: string) => {
  if (str.length % 4 !== 0) {
    return false;
  }
  if (!/^[a-zA-Z0-9+/]*={0,2}$/.test(str)) {
    return false;
  }
  try {
    atob(str);
    return true;
  } catch {
    return false;
  }
}
const isXml = (str: string) => {

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return false;
    }

    // Check if it has at least one element
    return doc.documentElement !== null && doc.documentElement.nodeName !== 'html';
  } catch {
    return false;
  }
}
const isHtml = (str: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    // Check if parsing produced actual HTML elements
    // In jsdom/browsers, parsing a string often wraps it in html/body
    const bodyChildren = Array.from(doc.body.childNodes);
    const hasElements = bodyChildren.some(node => node.nodeType === 1); // Node.ELEMENT_NODE
    
    // Simple heuristic: if it contains tags that looks like HTML
    // We check for common HTML-only tags or presence of common attributes
    const hasHtmlTags = /<(html|body|div|span|p|a|ul|ol|li|h[1-6]|br|hr|img|table|tr|td|th|form|input|button|label|style|script|meta|link|head|header|footer|nav|section|article|aside|main|canvas|video|audio|iframe|select|option|textarea)/i.test(str);
    const hasAttributes = / (href|src|style|class|id|type|value|name|placeholder|onclick|onchange|onsubmit|target|rel|alt|width|height|data-[a-z0-9-]+)="/i.test(str);
    
    // SVG is also valid XML, so we treat it as XML unless it's inside HTML
    return hasElements && (hasHtmlTags || hasAttributes);
  } catch {
    return false;
  }
}

const detectFormat = (text: string): Format => {
  if (!text || text.trim() === '') return 'Text';
  if (isUrl(text)) return 'URL';
  if (isJson(text)) return 'JSON';
  if (isBase64(text)) return 'Base64';
  if (isHtml(text)) return 'HTML';
  if (isXml(text)) return 'XML';
  return 'Text';
};

const useClipboardMonitor = (intervalMs: number = 1000, enabled: boolean = false) => {
  const [clipboardData, setClipboardData] = useState<Format | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let lastText = '';

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();

        if (text !== lastText) {
          lastText = text;
          const format = detectFormat(text)
          console.debug("Clipboard format:", format)
          setClipboardData(format);
        }
      } catch (err) {
        console.debug('Clipboard access denied:', err);
      }
    };

    const interval = setInterval(checkClipboard, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, intervalMs]);

  return clipboardData;
};

export {useClipboardMonitor, useClipboardAwareContext, detectFormat}