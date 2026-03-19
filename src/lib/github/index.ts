import { PROJECT_REPO_FULL_NAME } from '@/data/git';

import { getLanguageBadgeColor } from './language-colors';
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

const OTHER_LANGUAGE_THRESHOLD_PERCENT = 1.5;

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

  const rawStats = Object.entries(languageMap)
    .map(([name, count]) => ({
      name,
      rawPercent: (count / total) * 100,
      color: getLanguageBadgeColor(name),
    }))
    .sort((a, b) => b.rawPercent - a.rawPercent);

  const majorRaw = rawStats.filter(
    (s) => s.rawPercent >= OTHER_LANGUAGE_THRESHOLD_PERCENT,
  );
  const minorRawTotal = rawStats
    .filter((s) => s.rawPercent < OTHER_LANGUAGE_THRESHOLD_PERCENT)
    .reduce((sum, s) => sum + s.rawPercent, 0);

  const entries = majorRaw.map((s) => ({
    name: s.name,
    rawPercent: s.rawPercent,
    color: s.color,
  }));

  if (minorRawTotal > 0) {
    entries.push({
      name: 'Other',
      rawPercent: minorRawTotal,
      color: 'text',
    });
  }

  // Largest-remainder method: round to 1 decimal place summing to exactly 100.0
  const floored = entries.map((e) => Math.floor(e.rawPercent * 10) / 10);
  const flooredSum = floored.reduce((a, b) => a + b, 0);
  const deficit = Math.round((100.0 - flooredSum) * 10);

  const indexed = entries.map((e, i) => ({
    index: i,
    remainder: e.rawPercent * 10 - Math.floor(e.rawPercent * 10),
  }));
  indexed.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < deficit; i++) {
    floored[indexed[i].index] += 0.1;
  }

  return entries.map((e, i) => ({
    name: e.name,
    percent: Number(floored[i].toFixed(1)),
    color: e.color,
  }));
};

export const getShortenCommitHash = (hash: string) => hash.slice(0, 7);
