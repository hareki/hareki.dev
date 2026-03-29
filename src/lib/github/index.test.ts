import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getRepoCommits, getCommitDetail, getRepoLanguages } from './queries';

import {
  getLastCommitInfo,
  getRecentCommitDetails,
  getLanguageStats,
  getShortenCommitHash,
} from './index';

import type { CommitDetail } from './types';

// vi.mock is auto-hoisted by Vitest — runs before any imports
vi.mock('./queries', () => ({
  getRepoCommits: vi.fn(),
  getCommitDetail: vi.fn(),
  getRepoLanguages: vi.fn(),
}));

const mockGetRepoCommits = vi.mocked(getRepoCommits);
const mockGetCommitDetail = vi.mocked(getCommitDetail);
const mockGetRepoLanguages = vi.mocked(getRepoLanguages);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getShortenCommitHash', () => {
  it('returns first 7 characters', () => {
    expect(getShortenCommitHash('abc1234567890')).toBe('abc1234');
  });
});

describe('getLastCommitInfo', () => {
  it('returns commit info from first commit', async () => {
    mockGetRepoCommits.mockResolvedValue([
      {
        sha: 'abc123def456',
        html_url: 'https://github.com/hareki/hareki.dev/commit/abc123def456',
        commit: {
          message: 'feat: initial commit',
          author: { date: '2024-01-01T00:00:00Z' },
        },
      },
    ]);

    const result = await getLastCommitInfo('hareki/hareki.dev');

    expect(result).toEqual({
      hash: 'abc123def456',
      url: 'https://github.com/hareki/hareki.dev/commit/abc123def456',
      createdAt: '2024-01-01T00:00:00Z',
    });
  });

  it('returns null when API returns null', async () => {
    mockGetRepoCommits.mockResolvedValue(null);

    const result = await getLastCommitInfo('hareki/hareki.dev');
    expect(result).toBeNull();
  });

  it('returns null when API returns empty array', async () => {
    mockGetRepoCommits.mockResolvedValue([]);

    const result = await getLastCommitInfo('hareki/hareki.dev');
    expect(result).toBeNull();
  });
});

describe('getRecentCommitDetails', () => {
  const makeCommit = (sha: string, message: string) => ({
    sha,
    html_url: `https://github.com/hareki/hareki.dev/commit/${sha}`,
    commit: {
      message,
      author: { date: '2024-01-01T00:00:00Z' },
    },
  });

  const makeDetail = (
    message: string,
    additions: number,
    deletions: number,
  ): CommitDetail => ({
    commit: { message },
    stats: { additions, deletions },
  });

  it('maps commits with details', async () => {
    mockGetRepoCommits.mockResolvedValue([makeCommit('abc', 'feat: add')]);
    mockGetCommitDetail.mockResolvedValue(makeDetail('feat: add', 10, 5));

    const result = await getRecentCommitDetails('hareki/hareki.dev', 1);

    expect(result).toHaveLength(1);
    expect(result[0].repoName).toBe('hareki.dev');
    expect(result[0].commitMessage).toBe('feat: add');
    expect(result[0].linesAdded).toBe(10);
    expect(result[0].linesDeleted).toBe(5);
  });

  it('extracts first line of multi-line commit messages', async () => {
    mockGetRepoCommits.mockResolvedValue([
      makeCommit('abc', 'feat: title\n\nbody text here'),
    ]);
    mockGetCommitDetail.mockResolvedValue(
      makeDetail('feat: title\n\nbody text here', 1, 0),
    );

    const result = await getRecentCommitDetails('hareki/hareki.dev', 1);

    // The function slices up to and including the newline
    expect(result[0].commitMessage).toBe('feat: title\n');
  });

  it('falls back to 0 additions/deletions when detail fails', async () => {
    mockGetRepoCommits.mockResolvedValue([makeCommit('abc', 'fix: bug')]);
    mockGetCommitDetail.mockRejectedValue(new Error('API error'));

    const result = await getRecentCommitDetails('hareki/hareki.dev', 1);

    expect(result[0].linesAdded).toBe(0);
    expect(result[0].linesDeleted).toBe(0);
  });

  it('clamps limit to max 10', async () => {
    mockGetRepoCommits.mockResolvedValue([]);

    await getRecentCommitDetails('hareki/hareki.dev', 100);
    expect(mockGetRepoCommits).toHaveBeenCalledWith('hareki', 'hareki.dev', 10);
  });

  it('clamps limit to min 1', async () => {
    mockGetRepoCommits.mockResolvedValue([]);

    await getRecentCommitDetails('hareki/hareki.dev', -5);
    expect(mockGetRepoCommits).toHaveBeenCalledWith('hareki', 'hareki.dev', 1);
  });

  it('returns empty array when API returns null', async () => {
    mockGetRepoCommits.mockResolvedValue(null);

    const result = await getRecentCommitDetails('hareki/hareki.dev');
    expect(result).toEqual([]);
  });
});

describe('getLanguageStats', () => {
  it('computes percentages and sorts by size', async () => {
    mockGetRepoLanguages.mockResolvedValue({
      TypeScript: 700,
      JavaScript: 200,
      CSS: 100,
    });

    const result = await getLanguageStats('hareki/hareki.dev');

    expect(result[0].name).toBe('TypeScript');
    expect(result[1].name).toBe('JavaScript');
    expect(result[2].name).toBe('CSS');
    // Percentages should sum to 100
    const sum = result.reduce((acc, s) => acc + s.percent, 0);
    expect(sum).toBeCloseTo(100, 1);
  });

  it('groups languages below 1.5% as Other', async () => {
    mockGetRepoLanguages.mockResolvedValue({
      TypeScript: 9800,
      Shell: 100, // 1%
      Lua: 50, // 0.5%
      GLSL: 50, // 0.5%
    });

    const result = await getLanguageStats('hareki/hareki.dev');

    const names = result.map((s) => s.name);
    expect(names).toContain('TypeScript');
    expect(names).toContain('Other');
    expect(names).not.toContain('Shell');
    expect(names).not.toContain('Lua');
  });

  it('percentages sum to exactly 100.0 (largest-remainder method)', async () => {
    mockGetRepoLanguages.mockResolvedValue({
      TypeScript: 333,
      JavaScript: 333,
      CSS: 334,
    });

    const result = await getLanguageStats('hareki/hareki.dev');
    const sum = result.reduce((acc, s) => acc + s.percent, 0);
    expect(Number(sum.toFixed(1))).toBe(100.0);
  });

  it('returns empty array when API returns null', async () => {
    mockGetRepoLanguages.mockResolvedValue(null);

    const result = await getLanguageStats('hareki/hareki.dev');
    expect(result).toEqual([]);
  });

  it('returns empty array when total bytes is 0', async () => {
    mockGetRepoLanguages.mockResolvedValue({});

    const result = await getLanguageStats('hareki/hareki.dev');
    expect(result).toEqual([]);
  });

  it('assigns correct badge colors', async () => {
    mockGetRepoLanguages.mockResolvedValue({
      TypeScript: 500,
      Rust: 500,
    });

    const result = await getLanguageStats('hareki/hareki.dev');
    expect(result.find((s) => s.name === 'TypeScript')?.color).toBe('blue');
    expect(result.find((s) => s.name === 'Rust')?.color).toBe('maroon');
  });
});
