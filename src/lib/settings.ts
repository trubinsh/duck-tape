import React, { createContext, useContext, useCallback, useState } from 'react';

export const SETTINGS_KEY = 'dev-tools-settings';

export interface UserSettings {
  lastPage: string;
  general: {
    theme: 'light' | 'dark';
    smartSearchEnabled: boolean;
  };
  formatter: {
    indentSize: number;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  lastPage: '/',
  general: {
    theme: 'light',
    smartSearchEnabled: true,
  },
  formatter: {
    indentSize: 2,
  },
};

function loadSettingsInternal(): UserSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        general: { ...DEFAULT_SETTINGS.general, ...parsed.general },
        formatter: { ...DEFAULT_SETTINGS.formatter, ...parsed.formatter },
      };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

function saveSettingsInternal(settings: UserSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(loadSettingsInternal());

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
        general: newSettings.general ? { ...prev.general, ...newSettings.general } : prev.general,
        formatter: newSettings.formatter ? { ...prev.formatter, ...newSettings.formatter } : prev.formatter,
      };
      saveSettingsInternal(updated);
      return updated;
    });
  }, []);

  return React.createElement(
    SettingsContext.Provider,
    { value: { settings, updateSettings } },
    children
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Keep these for backward compatibility during migration
export const loadSettings = loadSettingsInternal;
export function saveSettings(settings: Partial<UserSettings>) {
  const current = loadSettingsInternal();
  const updated = {
    ...current,
    ...settings,
    general: settings.general ? { ...current.general, ...settings.general } : current.general,
    formatter: settings.formatter ? { ...current.formatter, ...settings.formatter } : current.formatter,
  };
  saveSettingsInternal(updated);
}
