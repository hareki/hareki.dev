export const STORAGE_KEYS = {
  themeFlavor: 'THEME_ctp-flavor',
  themeAccent: 'THEME_ctp-accent',
  typingBestWpm: 'TYPING_best-wpm',
} as const;

type Key = keyof typeof STORAGE_KEYS;

export const getStorageItem = (key: Key): string | null => {
  return localStorage.getItem(STORAGE_KEYS[key]);
};

export const setStorageItem = (key: Key, value: string): void => {
  localStorage.setItem(STORAGE_KEYS[key], value);
};
