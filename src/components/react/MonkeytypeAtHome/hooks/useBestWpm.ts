import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'monkeytype-at-home-best-wpm';

const getSnapshot = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
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
    if (e.key === STORAGE_KEY) {
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
      localStorage.setItem(STORAGE_KEY, String(wpm));
    } catch {
      // localStorage full or unavailable
    }
  };

  return { bestWpm, setBestWpm };
};
