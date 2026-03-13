export const githubFetch = async (url: string): Promise<Response> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    ['User-Agent']: 'hareki/hareki.dev',
  };

  const token = import.meta.env.VITE_PUBLIC_GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { headers });
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
