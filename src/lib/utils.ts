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
  const [browser, setBrowser] = useState<BrowserType>("Unknown");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browserName: BrowserType = 'Unknown';

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
      browserName = 'IE';
    }

    setBrowser(browserName);
  }, []);

  return browser;
}

export type OSType = "Windows" | "MacOS" | "Linux" | "Android" | "iOS" | "Unknown";

export function useOS() {
  const [os, setOS] = useState<OSType>("Unknown");

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    let detectedOS: OSType = 'Unknown';

    if (macosPlatforms.indexOf(platform) !== -1) {
      detectedOS = 'MacOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      detectedOS = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      detectedOS = 'Windows';
    } else if (/Android/.test(userAgent)) {
      detectedOS = 'Android';
    } else if (/Linux/.test(platform) || /Linux/.test(userAgent)) {
      detectedOS = 'Linux';
    }

    setOS(detectedOS);
  }, []);

  return os;
}