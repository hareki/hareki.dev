import { useSyncExternalStore } from 'react';

import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '@/utils/local-storage';

const getSnapshot = (): number => {
  try {
    const val = getStorageItem('typingBestWpm');
    return val ? parseFloat(val) : 0;
  } catch {
    return 0;
  }
};

const getServerSnapshot = (): number => {
  return 0;
};

type Callback = () => void;
type Cleanup = () => void;

const subscribe = (callback: Callback): Cleanup => {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.typingBestWpm) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

export const useBestWpm = () => {
  const bestWpm = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setBestWpm = (wpm: number) => {
    try {
      setStorageItem('typingBestWpm', String(wpm));
    } catch {
      // localStorage full or unavailable
    }
  };

  return { bestWpm, setBestWpm };
};
