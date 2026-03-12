const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const githubFetch = async (url: string): Promise<Response> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };

  const token = import.meta.env.VITE_PUBLIC_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { headers });
};

export const cachedFetch = async <T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
): Promise<T> => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const cached: { ts: number; data: T } = JSON.parse(raw);
      if (Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch {
    // Corrupted cache entry — continue to fetch
  }

  const data = await fetcher();
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // localStorage full or unavailable — ignore
  }
  return data;
};

export const parseOwnerRepo = (
  githubUrl: string,
): {
  owner: string;
  repo: string;
} => {
  const parts = new URL(githubUrl).pathname.replace(/^\//, '').split('/');
  return { owner: parts[0], repo: parts[1] };
};
