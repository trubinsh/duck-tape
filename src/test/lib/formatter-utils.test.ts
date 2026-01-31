import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define a minimal Worker mock BEFORE importing formatter-utils
(globalThis as any).Worker = class {
  onmessage: any = null;
  onerror: any = null;
  
  postMessage(data: any) {
    // Small delay to simulate async nature of Workers
    setTimeout(() => {
      import('../../lib/worker').then(() => {
        const event = { data } as MessageEvent;
        const originalPostMessage = globalThis.postMessage;
        (globalThis as any).postMessage = (response: any) => {
          if (this.onmessage) {
            this.onmessage({ data: response } as MessageEvent);
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
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
};

import { indentString } from '@/lib/formatter-utils';

// Mock the worker module to return the global Worker
vi.mock('./worker?worker', () => {
  return {
    default: globalThis.Worker,
  };
});

describe('formatter-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('indentString', () => {
    it('should indent JSON string', async () => {
      const input = '{"a":1}';
      const result = await indentString(input, 'JSON', 2);
      expect(result).toBe('{\n  "a": 1\n}');
    });

    it('should indent HTML string', async () => {
      const input = '<div><p>Hello</p></div>';
      const result = await indentString(input, 'HTML', 2);
      expect(result).toContain('<div>');
      expect(result).toContain('<p>Hello</p>');
    });

    it('should throw error for invalid JSON', async () => {
      const input = '{"a":1';
      await expect(indentString(input, 'JSON', 2)).rejects.toThrow();
    });

    it('should return original string for unknown format', async () => {
      const input = 'some text';
      const result = await indentString(input, 'Text' as any, 2);
      expect(result).toBe(input);
    });
  });
});
