export type LastCommit = {
  commitHash: string;
  commitUrl: string;
  createdAt: string;
};

export type LanguageStat = { name: string; percent: number };

export type RecentCommit = {
  repoName: string;
  commitUrl: string;
  commitMessage: string;
  linesAdded: number;
  linesDeleted: number;
  languageStats: LanguageStat[];
};

export type CommitDetail = {
  commit: { message: string };
  stats: { additions: number; deletions: number };
};

export type CommitSummary = {
  sha: string;
  repoFullName: string;
  repoName: string;
};

export type UserEvent = {
  type: string;
  repo: { name: string };
  payload: {
    head: string;
    ref: string;
  };
};
