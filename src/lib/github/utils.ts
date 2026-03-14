export const githubFetch = async (url: string): Promise<Response> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    ['User-Agent']: 'hareki/hareki.dev',
  };

  const token = import.meta.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { headers });
};

export const parseRepoFullName = (
  repoFullName: string,
): {
  owner: string;
  repo: string;
} => {
  const [owner, repo, ...rest] = repoFullName.trim().split('/').filter(Boolean);

  if (!owner || !repo || rest.length > 0) {
    throw new Error('Expected repoFullName in the format "<owner>/<repo>".');
  }

  return { owner, repo };
};
