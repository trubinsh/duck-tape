import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingsProvider, useSettings, SETTINGS_KEY } from '@/lib/settings.ts';
import React from 'react';

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SettingsProvider>{children}</SettingsProvider>
  );

  it('should provide default settings when localStorage is empty', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings).toEqual({
      lastPage: '/',
      general: {
        theme: 'light',
        smartSearchEnabled: true,
      },
      formatter: {
        indentSize: 2,
      },
      uuidGenerator: {
        version: 'v7',
        count: 1,
      },
      passwordGenerator: {
        characters: expect.any(Array),
        length: 16,
      },
    });
  });

  it('should load settings from localStorage', () => {
    const savedSettings = {
      general: {
        theme: 'dark',
        smartSearchEnabled: false,
      },
      formatter: {
        indentSize: 4,
      },
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(savedSettings));

    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings.general.theme).toBe('dark');
    expect(result.current.settings.general.smartSearchEnabled).toBe(false);
    expect(result.current.settings.formatter.indentSize).toBe(4);
    // Should still have other defaults
    expect(result.current.settings.uuidGenerator.count).toBe(1);
  });

  it('should update settings and save to localStorage', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.updateSettings({
        general: { theme: 'dark', smartSearchEnabled: false },
        formatter: { indentSize: 4 },
      });
    });

    expect(result.current.settings.general.theme).toBe('dark');
    expect(result.current.settings.general.smartSearchEnabled).toBe(false);
    expect(result.current.settings.formatter.indentSize).toBe(4);

    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    expect(saved.general.theme).toBe('dark');
    expect(saved.formatter.indentSize).toBe(4);
  });

  it('should throw error when used outside of SettingsProvider', () => {
    // Suppress console.error for this test as we expect an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useSettings())).toThrow('useSettings must be used within a SettingsProvider');
    
    consoleSpy.mockRestore();
  });
});
