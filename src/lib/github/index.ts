import { PROJECT_REPO_FULL_NAME } from '@/data/git';

import { getRepoCommits, getCommitDetail, getRepoLanguages } from './queries';
import { parseRepoFullName } from './utils';

import type { RecentCommit, LastCommitInfo, LanguageStat } from './types';

const MAX_RECENT_COMMITS = 10;

export const getLastCommitInfo = async (
  repoFullName?: string,
): Promise<LastCommitInfo | null> => {
  const resolvedRepoFullName = repoFullName ?? PROJECT_REPO_FULL_NAME;
  const { owner, repo } = parseRepoFullName(resolvedRepoFullName);

  const commits = await getRepoCommits(owner, repo, 1);

  if (!commits || commits.length === 0) {
    return null;
  }

  const firstCommit = commits[0];
  return {
    hash: firstCommit.sha,
    url: firstCommit.html_url,
    createdAt: firstCommit.commit.author.date,
  };
};

export const getRecentCommitDetails = async (
  repoFullName?: string,
  limit: number = 5,
): Promise<RecentCommit[]> => {
  const resolvedRepoFullName = repoFullName ?? PROJECT_REPO_FULL_NAME;
  const { owner, repo } = parseRepoFullName(resolvedRepoFullName);
  const clampedLimit = Math.min(
    Math.max(1, Math.floor(limit)),
    MAX_RECENT_COMMITS,
  );

  const commits = await getRepoCommits(owner, repo, clampedLimit);

  if (!commits || commits.length === 0) {
    return [];
  }

  const commitDetails = await Promise.allSettled(
    commits.map((commit) => getCommitDetail(resolvedRepoFullName, commit.sha)),
  );

  return commits.map((commit, index) => {
    const detailResult = commitDetails[index];
    const detail =
      detailResult.status === 'fulfilled' ? detailResult.value : null;

    return {
      repoName: repo,
      commitUrl: commit.html_url,
      commitMessage: detail?.commit.message ?? commit.commit.message,
      createdAt: new Date(commit.commit.author.date),
      linesAdded: detail?.stats.additions ?? 0,
      linesDeleted: detail?.stats.deletions ?? 0,
    };
  });
};

export const getLanguageStats = async (
  repoFullName?: string,
): Promise<LanguageStat[]> => {
  const resolvedRepoFullName = repoFullName ?? PROJECT_REPO_FULL_NAME;
  const { owner, repo } = parseRepoFullName(resolvedRepoFullName);

  const languageMap = await getRepoLanguages(`${owner}/${repo}`);
  if (!languageMap) {
    return [];
  }

  const total = Object.values(languageMap).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return [];
  }

  return Object.entries(languageMap)
    .map(([name, count]) => ({
      name,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
};

export const getShortenCommitHash = (hash: string) => hash.slice(0, 7);
