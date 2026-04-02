import { describe, it, expect } from 'vitest';

import { parseConventionalCommit, parseRepoFullName } from './utils';

describe('parseRepoFullName', () => {
  it('parses owner/repo format', () => {
    expect(parseRepoFullName('hareki/hareki.dev')).toEqual({
      owner: 'hareki',
      repo: 'hareki.dev',
    });
  });

  it('trims whitespace', () => {
    expect(parseRepoFullName('  owner/repo  ')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('throws on empty string', () => {
    expect(() => parseRepoFullName('')).toThrow();
  });

  it('throws on single segment', () => {
    expect(() => parseRepoFullName('just-one')).toThrow();
  });

  it('throws on three segments', () => {
    expect(() => parseRepoFullName('a/b/c')).toThrow();
  });
});

describe('parseConventionalCommit', () => {
  it('parses type and message', () => {
    expect(parseConventionalCommit('feat: add login')).toEqual({
      prefix: 'feat:',
      message: 'add login',
    });
  });

  it('parses type with scope', () => {
    expect(parseConventionalCommit('fix(auth): handle timeout')).toEqual({
      prefix: 'fix(auth):',
      message: 'handle timeout',
    });
  });

  it('parses breaking change indicator', () => {
    expect(parseConventionalCommit('feat!: remove v1 api')).toEqual({
      prefix: 'feat!:',
      message: 'remove v1 api',
    });
  });

  it('parses scope with breaking change', () => {
    expect(
      parseConventionalCommit('refactor(core)!: new architecture'),
    ).toEqual({
      prefix: 'refactor(core)!:',
      message: 'new architecture',
    });
  });

  it('returns null prefix for non-conventional messages', () => {
    expect(parseConventionalCommit('just a plain message')).toEqual({
      prefix: null,
      message: 'just a plain message',
    });
  });

  it('returns null prefix for messages without colon-space', () => {
    expect(parseConventionalCommit('feat:no space')).toEqual({
      prefix: null,
      message: 'feat:no space',
    });
  });

  it('parses scope with slash (e.g. nvim/deps)', () => {
    expect(
      parseConventionalCommit(
        'chore(nvim/deps): update lazy.nvim, remove sidekick.nvim\n',
      ),
    ).toEqual({
      prefix: 'chore(nvim/deps):',
      message: 'update lazy.nvim, remove sidekick.nvim',
    });
  });

  it('parses scope with slash and hyphen (e.g. nvim/nvim-treesitter)', () => {
    expect(
      parseConventionalCommit(
        'chore(nvim/nvim-treesitter): update plugin lock and auto-install missing parsers\n',
      ),
    ).toEqual({
      prefix: 'chore(nvim/nvim-treesitter):',
      message: 'update plugin lock and auto-install missing parsers',
    });
  });

  it('handles trailing newline on standard messages', () => {
    expect(parseConventionalCommit('feat: add login\n')).toEqual({
      prefix: 'feat:',
      message: 'add login',
    });
  });

  it('parses scope with multiple entries separated by comma', () => {
    expect(parseConventionalCommit('feat(nvim, zsh): add plugins')).toEqual({
      prefix: 'feat(nvim, zsh):',
      message: 'add plugins',
    });
  });

  it('parses scope with slash and multiple entries', () => {
    expect(
      parseConventionalCommit('feat(nvim/deps, zsh): update dependencies'),
    ).toEqual({
      prefix: 'feat(nvim/deps, zsh):',
      message: 'update dependencies',
    });
  });
});
