export type LastCommitInfo = {
  hash: string;
  url: string;
  createdAt: string;
};

export type RecentCommit = {
  repoName: string;
  commitUrl: string;
  commitMessage: string;
  createdAt: Date;
  linesAdded: number;
  linesDeleted: number;
};

export type LanguageStat = { name: string; percent: number };

export type CommitDetail = {
  commit: { message: string };
  stats: { additions: number; deletions: number };
};
