import { describe, it, expect } from 'vitest';

import { createWord, computeIsCorrect } from './utils';

import type { LetterState } from './types';

describe('createWord', () => {
  it('creates a word with untyped letters', () => {
    const word = createWord('abc');

    expect(word.letters).toEqual([
      { expected: 'a', typed: null, status: 'untyped' },
      { expected: 'b', typed: null, status: 'untyped' },
      { expected: 'c', typed: null, status: 'untyped' },
    ]);
    expect(word.expectedLength).toBe(3);
    expect(word.isCompleted).toBe(false);
    expect(word.isCorrect).toBe(false);
  });

  it('handles single character', () => {
    const word = createWord('x');
    expect(word.letters).toHaveLength(1);
    expect(word.expectedLength).toBe(1);
  });
});

describe('computeIsCorrect', () => {
  it('returns true when all letters are correct', () => {
    const letters: LetterState[] = [
      { expected: 'a', typed: 'a', status: 'correct' },
      { expected: 'b', typed: 'b', status: 'correct' },
    ];
    expect(computeIsCorrect(letters)).toBe(true);
  });

  it('returns false when any letter is incorrect', () => {
    const letters: LetterState[] = [
      { expected: 'a', typed: 'a', status: 'correct' },
      { expected: 'b', typed: 'x', status: 'incorrect' },
    ];
    expect(computeIsCorrect(letters)).toBe(false);
  });

  it('returns false when any letter is untyped', () => {
    const letters: LetterState[] = [
      { expected: 'a', typed: 'a', status: 'correct' },
      { expected: 'b', typed: null, status: 'untyped' },
    ];
    expect(computeIsCorrect(letters)).toBe(false);
  });

  it('returns false when any letter is extra', () => {
    const letters: LetterState[] = [
      { expected: 'a', typed: 'a', status: 'correct' },
      { expected: '', typed: 'z', status: 'extra' },
    ];
    expect(computeIsCorrect(letters)).toBe(false);
  });
});
