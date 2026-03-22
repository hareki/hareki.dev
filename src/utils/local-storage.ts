export const STORAGE_KEYS = {
  themeFlavor: 'THEME_ctp-flavor',
  themeAccent: 'THEME_ctp-accent',
  themeMatchSystem: 'THEME_match-system',
  themeDarkFlavor: 'THEME_dark-flavor',
  typingBestWpm: 'TYPING_best-wpm',
} as const;

type Key = keyof typeof STORAGE_KEYS;

export const getStorageItem = (key: Key): string | null => {
  return localStorage.getItem(STORAGE_KEYS[key]);
};

export const setStorageItem = (key: Key, value: string): void => {
  localStorage.setItem(STORAGE_KEYS[key], value);
};

export const removeStorageItem = (key: Key): void => {
  localStorage.removeItem(STORAGE_KEYS[key]);
};
