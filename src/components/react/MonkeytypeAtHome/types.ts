export const TEXT = 'The quick brown fox jumps over the lazy dog';
export const WORDS = TEXT.split(' ');

export type Screen = 'idle' | 'typing' | 'result';
export type LetterStatus = 'untyped' | 'correct' | 'incorrect' | 'extra';

export interface LetterState {
  expected: string;
  typed: string | null;
  status: LetterStatus;
}

export interface WordState {
  letters: LetterState[];
  isCompleted: boolean;
  isCorrect: boolean;
}

export interface TypingState {
  screen: Screen;
  words: WordState[];
  currentWordIndex: number;
  currentCharIndex: number;
  wordsTyped: number;
  totalKeystrokes: number;
  startTime: number | null;
  endTime: number | null;
  isTapeModeOn: boolean;
  isTapeModeForced: boolean;
  isFocused: boolean;
}

export interface ResultStats {
  wpm: number;
  accuracy: number;
  timeSeconds: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  totalKeystrokes: number;
}

export type TypingAction =
  | { type: 'TYPE_CHAR'; char: string; timestamp: number }
  | { type: 'BACKSPACE' }
  | { type: 'SPACE'; timestamp: number }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'TOGGLE_TAPE_MODE' }
  | { type: 'SET_TAPE_MODE_FORCED'; forced: boolean }
  | { type: 'RESTART' };
