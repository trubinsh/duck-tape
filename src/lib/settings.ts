export const SETTINGS_KEY = 'dev-tools-settings';

export interface UserSettings {
  lastPage: string;
  theme: 'light' | 'dark' | 'auto';
  smartSearchEnabled: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  lastPage: '/',
  theme: 'dark',
  smartSearchEnabled: false
};

export function loadSettings(): UserSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<UserSettings>) {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
