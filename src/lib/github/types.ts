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

export interface LanguageStat { name: string; percent: number }

export interface CommitDetail {
  commit: { message: string };
  stats: { additions: number; deletions: number };
}
