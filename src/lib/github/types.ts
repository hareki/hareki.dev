export interface LastCommitInfo {
  hash: string;
  url: string;
  createdAt: string;
}

export interface RecentCommit {
  repoName: string;
  commitUrl: string;
  commitMessage: string;
  createdAt: Date;
  linesAdded: number;
  linesDeleted: number;
}

import type { BadgeColor } from './language-colors';

export interface LanguageStat {
  name: string;
  percent: number;
  color: BadgeColor;
}

export interface CommitDetail {
  commit: { message: string };
  stats: { additions: number; deletions: number };
}
