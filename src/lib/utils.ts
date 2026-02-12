import {useEffect, useState} from "react";

export type Format =
  'URL'
  | 'JSON'
  | 'XML'
  | 'HTML'
  | 'Base64'
  | 'Text'
  | 'JWT'

export interface ToolGroup {
  group: string,
  clipboardAware: boolean,
  tools: Tool[]
}

export interface Tool {
  name: string,
  redirectUrl: string,
  format?: Format,
}

export function isToolGroup(tool: ToolGroup | Tool): tool is ToolGroup {
  return 'group' in tool;
}

export const tools: (ToolGroup | Tool)[] = [
  {
    group: 'Formatter',
    clipboardAware: true,
    tools: [
      {
        name: 'JSON Formatter',
        format: 'JSON',
        redirectUrl: "/formatter?format=JSON"
      },
      {
        name: 'XML Formatter',
        format: 'XML',
        redirectUrl: "/formatter?format=XML"
      },
      {
        name: 'HTML Formatter',
        format: 'HTML',
        redirectUrl: "/formatter?format=HTML"
      }
    ]
  },
  {
    group: 'Encode/Decode',
    redirectUrl: '/encoder',
    clipboardAware: true,
    tools: [
      {
        name: "Base64 Encode/Decode",
        format: "Base64",
        redirectUrl: "/encoder?format=Base64"
      },
      {
        name: "URL Encode/Decode",
        format: "URL",
        redirectUrl: "/encoder?format=URL"
      },
      {
        name: "JWT Encode/Decode",
        format: "JWT",
        redirectUrl: "/encoder?format=JWT"
      }
    ]
  },
  {
    name: 'Diff Viewer',
    redirectUrl: '/diff-viewer'
  },
  {
    group: 'Generator',
    clipboardAware: false,
    tools: [
      {
        name: 'Password Generator',
        redirectUrl: '/password-generator'
      },
      {
        name: 'UUID Generator',
        redirectUrl: '/uuid-generator'
      }
    ]
  },
  {
    name: 'Regex',
    redirectUrl: '/regex'
  },
  {
    group: 'Converter',
    clipboardAware: false,
    tools: [
      {
        name: 'Timestamp converter',
        redirectUrl: '/timestamp-converter'
      }
    ]
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOS(detectedOS);
  }, []);

  return os;
}