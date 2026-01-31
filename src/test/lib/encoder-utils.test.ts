import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  decodeBase64,
  decodeJwt,
  decodeUrl,
  encodeBase64,
  encodeUrl
} from '@/lib/encoder-utils';

// Define a minimal Worker mock BEFORE importing formatter-utils
(globalThis as any).Worker = class {
  onmessage: any = null;
  onerror: any = null;

  postMessage(data: any) {
    // Small delay to simulate async nature of Workers
    setTimeout(() => {
      import('../../lib/worker').then(() => {
        const event = {data} as MessageEvent;
        const originalPostMessage = globalThis.postMessage;
        (globalThis as any).postMessage = (response: any) => {
          if (this.onmessage) {
            this.onmessage({data: response} as MessageEvent);
          }
        };

        try {
          if (typeof (globalThis as any).onmessage === 'function') {
            (globalThis as any).onmessage(event);
          }
        } finally {
          (globalThis as any).postMessage = originalPostMessage;
        }
      });
    }, 0);
  }

  terminate() {
  }

  addEventListener() {
  }

  removeEventListener() {
  }

  dispatchEvent() {
    return true;
  }
};

describe('encoder-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

// Mock the worker module to return the global Worker
  vi.mock('./worker?worker', () => {
    return {
      default: globalThis.Worker,
    };
  });

  describe('encodeBase64', () => {
    it('should encode string to Base64', async () => {
      const input = 'hello world';
      const result = await encodeBase64(input);
      expect(result).toBe('aGVsbG8gd29ybGQ=');
    });

    it('should encode empty string', async () => {
      const result = await encodeBase64('');
      expect(result).toBe('');
    });
  });

  describe('encodeUrl', () => {
    it('should encode URL component', async () => {
      const input = 'hello world?&';
      const result = await encodeUrl(input);
      expect(result).toBe('hello%20world%3F%26');
    });
  });

  describe('decodeBase64', () => {
    it('should decode Base64 string', async () => {
      const input = 'aGVsbG8gd29ybGQ=';
      const result = await decodeBase64(input);
      expect(result).toBe('hello world');
    });

    it('should throw error for invalid Base64', async () => {
      const input = '!!!invalid!!!';
      await expect(decodeBase64(input)).rejects.toThrow();
    });
  });

  describe('decodeUrl', () => {
    it('should decode percent-encoded string', async () => {
      const input = 'hello%20world%3F%26';
      const result = await decodeUrl(input);
      expect(result).toBe('hello world?&');
    });
  });

  describe('decodeJwt', () => {
    it('should decode a valid JWT', async () => {
      const header = { alg: 'HS256', typ: 'JWT' };
      const body = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
      const encodedHeader = btoa(JSON.stringify(header));
      const encodedBody = btoa(JSON.stringify(body));
      const jwt = `${encodedHeader}.${encodedBody}.signature`;

      const result = await decodeJwt(jwt);
      
      expect(JSON.parse(result.header)).toEqual(header);
      expect(JSON.parse(result.body)).toEqual(body);
    });

    it('should throw error for malformed JWT', async () => {
      const jwt = 'invalid.jwt';
      await expect(decodeJwt(jwt)).rejects.toThrow();
    });
  });
});