import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOS, useBrowser } from '@/lib/utils';

describe('useOS', () => {
  it('detects MacOS correctly', () => {
    vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: 'Mozilla/5.0' });
    const { result } = renderHook(() => useOS());
    expect(result.current).toBe('MacOS');
  });

  it('detects Windows correctly', () => {
    vi.stubGlobal('navigator', { platform: 'Win32', userAgent: 'Mozilla/5.0' });
    const { result } = renderHook(() => useOS());
    expect(result.current).toBe('Windows');
  });

  it('detects Linux correctly', () => {
    vi.stubGlobal('navigator', { platform: 'Linux x86_64', userAgent: 'Mozilla/5.0' });
    const { result, rerender } = renderHook(() => useOS());
    expect(result.current).toBe('Linux');

    vi.stubGlobal('navigator', { platform: '', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' });
    rerender();
    expect(result.current).toBe('Linux');
  });
});

describe('useBrowser', () => {
  it('detects Firefox correctly', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0' });
    const { result } = renderHook(() => useBrowser());
    expect(result.current).toBe('Firefox');
  });

  it('detects Chrome correctly', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' });
    const { result } = renderHook(() => useBrowser());
    expect(result.current).toBe('Chrome');
  });
});
