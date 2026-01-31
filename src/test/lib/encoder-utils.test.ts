import {beforeEach, describe, expect, it, vi} from 'vitest';
import {decode, encode} from '@/lib/encoder-utils';

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
  describe('encode', () => {
    it('should encode string to Base64', async () => {
      const input = 'hello';
      const result = await encode(input, 'Base64');
      expect(result).toBe(btoa(input));
    });

    it('should return original string for other formats', async () => {
      const input = 'hello';
      const result = await encode(input, 'JSON');
      expect(result).toBe(input);
    });
  });

  describe('decode', () => {
    it('should decode Base64 string', async () => {
      const input = btoa('hello');
      const result = await decode(input, 'Base64');
      expect(result).toBe('hello');
    });

    it('should throw error for invalid Base64', async () => {
      const input = '!!!invalid!!!';
      await expect(decode(input, 'Base64')).rejects.toThrow();
    });

    it('should return original string for other formats', async () => {
      const input = 'hello';
      const result = await decode(input, 'JSON');
      expect(result).toBe(input);
    });
  });
});