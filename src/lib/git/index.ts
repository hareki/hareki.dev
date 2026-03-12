import {
  getRepoCommits,
  getUserEvents,
  getCommitDetail,
  getRepoLanguages,
} from './queries';
import { parseOwnerRepo, cachedFetch } from './utils';

import type {
  RecentCommit,
  LastCommit,
  CommitSummary,
  LanguageStat,
} from './types';

const MAX_RECENT_COMMITS = 10;

const EMPTY_LAST_COMMIT_INFO: LastCommit = {
  commitHash: '',
  commitUrl: '',
  createdAt: '',
};

export const getLastCommitInfo = async (
  githubUrl?: string,
): Promise<LastCommit> => {
  const url = githubUrl ?? 'https://github.com/hareki/hareki.dev';
  const { owner, repo } = parseOwnerRepo(url);

  return cachedFetch(`git:lastCommit:${owner}/${repo}`, async () => {
    const commits = await getRepoCommits(owner, repo, 1);

    if (!commits || commits.length === 0) {
      return EMPTY_LAST_COMMIT_INFO;
    }

    const c = commits[0];
    return {
      commitHash: c.sha,
      commitUrl: c.html_url,
      createdAt: c.commit.author.date,
    };
  });
};

export const getRecentCommitDetails = async (
  limit: number = 5,
  githubProfile?: string,
): Promise<RecentCommit[]> => {
  const clampedLimit = Math.min(
    Math.max(1, Math.floor(limit)),
    MAX_RECENT_COMMITS,
  );
  const profile = githubProfile ?? 'https://github.com/hareki';
  const username = new URL(profile).pathname.replace(/^\//, '').split('/')[0];

  return cachedFetch(
    `git:recentCommits:${username}:${clampedLimit}`,
    async () => {
      // Not all events are PushEvents, so fetch more than needed.
      // ~5x multiplier accounts for non-push events in the feed.
      const eventsPerPage = Math.min(clampedLimit * 5, 100);

      // 1. Fetch public events
      const events = await getUserEvents(username, eventsPerPage);

      if (!events) {
        return [];
      }

      // 2. Extract unique commits from PushEvents (one per push, using head SHA)
      const seen = new Set<string>();
      const commits: CommitSummary[] = [];

      for (const event of events) {
        if (event.type !== 'PushEvent') {
          continue;
        }
        const sha = event.payload.head;
        if (seen.has(sha)) {
          continue;
        }
        seen.add(sha);

        const repoFullName = event.repo.name;
        const repoName = repoFullName.split('/')[1];
        commits.push({ sha, repoFullName, repoName });

        if (commits.length >= clampedLimit) {
          break;
        }
      }

      if (commits.length === 0) {
        return [];
      }

      // 3. Fetch commit details (message + additions/deletions) in parallel
      const commitDetails = await Promise.allSettled(
        commits.map((c) => getCommitDetail(c.repoFullName, c.sha)),
      );

      // 4. Fetch repo languages (deduplicated) in parallel
      const uniqueRepos = [...new Set(commits.map((c) => c.repoFullName))];
      const langMap = new Map<string, LanguageStat[]>();

      await Promise.allSettled(
        uniqueRepos.map(async (repoFullName) => {
          const bytes = await getRepoLanguages(repoFullName);
          if (!bytes) {
            return;
          }
          const total = Object.values(bytes).reduce((a, b) => a + b, 0);
          if (total === 0) {
            return;
          }
          const stats: LanguageStat[] = Object.entries(bytes)
            .map(([name, count]) => ({
              name,
              percent: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.percent - a.percent);
          langMap.set(repoFullName, stats);
        }),
      );

      // 5. Assemble results
      return commits.map((commit, index) => {
        const detailResult = commitDetails[index];
        const detail =
          detailResult.status === 'fulfilled' ? detailResult.value : null;

        return {
          repoName: commit.repoName,
          commitUrl: `https://github.com/${commit.repoFullName}/commit/${commit.sha}`,
          commitMessage: detail?.commit.message ?? '',
          linesAdded: detail?.stats.additions ?? 0,
          linesDeleted: detail?.stats.deletions ?? 0,
          languageStats: langMap.get(commit.repoFullName) ?? [],
        };
      });
    },
  );
};

export const getLanguageStatsSummary = (
  commits: RecentCommit[],
): LanguageStat[] => {
  const totals: Record<string, number> = {};

  for (const commit of commits) {
    for (const stat of commit.languageStats) {
      totals[stat.name] = (totals[stat.name] ?? 0) + stat.percent;
    }
  }

  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  if (sum === 0) {
    return [];
  }

  return Object.entries(totals)
    .map(([name, raw]) => ({ name, percent: Math.round((raw / sum) * 100) }))
    .sort((a, b) => b.percent - a.percent);
};
