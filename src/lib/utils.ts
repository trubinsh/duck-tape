import {useEffect, useState} from "react";

export type Format =
  'URL'
  | 'JSON'
  | 'XML'
  | 'HTML'
  | 'Base64'
  | 'Text'

export interface Tool {
  group: string,
  redirectUrl: string,
  formats: Format[],
  clipboardAware: boolean
}

export const tools: Tool[] = [
  {
    group: 'Escape/Unescape',
    redirectUrl: '/escape-unescape',
    formats: ['URL', 'JSON', 'XML', 'HTML'],
    clipboardAware: false
  },
  {
    group: 'Formatter',
    redirectUrl: '/formatter',
    formats: ['JSON', 'XML', 'HTML'],
    clipboardAware: true
  }
]

export type BrowserType =
  "Opera"
  | "Firefox"
  | "Safari"
  | "IE"
  | "Edge"
  | "Chrome"
  | "Blink"
  | "Unknown";

export function useBrowser() {
  const [browser, setBrowser] = useState<BrowserType>();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';

    // Detect browser name and version
    if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
    } else if (userAgent.indexOf('Edg') > -1) {
      browserName = 'Edge';
    } else if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
      browserName = 'Internet Explorer';
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowser(browserName as BrowserType);
  }, [browser]);

  return browser;
}