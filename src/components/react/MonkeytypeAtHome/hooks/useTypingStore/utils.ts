import type { WordState, LetterState } from './types';

export const createWord = (word: string): WordState => {
  return {
    letters: word.split('').map((char) => ({
      expected: char,
      typed: null,
      status: 'untyped' as const,
    })),
    expectedLength: word.length,
    isCompleted: false,
    isCorrect: false,
  };
};

export const computeIsCorrect = (letters: LetterState[]): boolean => {
  return letters.every((l) => l.status === 'correct');
};
