import { githubFetch } from './utils';

import type { CommitDetail, UserEvent } from './types';

const GITHUB_API = 'https://api.github.com';

type RepoCommitResponse = {
  sha: string;
  html_url: string;
  commit: { author: { date: string } };
}[];

export const getRepoCommits = async (
  owner: string,
  repo: string,
  perPage: number = 1,
): Promise<RepoCommitResponse | null> => {
  const res = await githubFetch(
    `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
  );
  if (!res.ok) {
    console.warn(
      `GitHub API error (${res.status}) fetching commits for ${owner}/${repo}`,
    );
    return null;
  }
  return res.json() as Promise<RepoCommitResponse>;
};

export const getUserEvents = async (
  username: string,
  perPage: number,
): Promise<UserEvent[] | null> => {
  const res = await githubFetch(
    `${GITHUB_API}/users/${username}/events/public?per_page=${perPage}`,
  );
  if (!res.ok) {
    console.warn(
      `GitHub API error (${res.status}) fetching events for ${username}`,
    );
    return null;
  }

  return res.json() as Promise<UserEvent[]>;
};

export const getCommitDetail = async (
  repoFullName: string,
  sha: string,
): Promise<CommitDetail | null> => {
  const res = await githubFetch(
    `${GITHUB_API}/repos/${repoFullName}/commits/${sha}`,
  );
  if (!res.ok) {
    return null;
  }
  return res.json() as Promise<CommitDetail>;
};

export const getRepoLanguages = async (
  repoFullName: string,
): Promise<Record<string, number> | null> => {
  const res = await githubFetch(
    `${GITHUB_API}/repos/${repoFullName}/languages`,
  );
  if (!res.ok) {
    return null;
  }
  return res.json() as Promise<Record<string, number>>;
};
