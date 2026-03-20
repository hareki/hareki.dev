import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'monkeytype-at-home-best-wpm';

function getSnapshot(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val ? parseFloat(val) : 0;
  } catch {
    return 0;
  }
}

function getServerSnapshot(): number {
  return 0;
}

function subscribe(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {callback();}
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export function useBestWpm() {
  const bestWpm = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateBestWpm = useCallback((wpm: number): boolean => {
    if (wpm > bestWpm) {
      try {
        localStorage.setItem(STORAGE_KEY, String(wpm));
      } catch {
        // localStorage full or unavailable
      }
      return true;
    }
    return false;
  }, [bestWpm]);

  return { bestWpm, updateBestWpm };
}
