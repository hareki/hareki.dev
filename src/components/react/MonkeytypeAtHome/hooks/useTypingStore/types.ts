export type Screen = 'idle' | 'typing' | 'result';
export type LetterStatus = 'untyped' | 'correct' | 'incorrect' | 'extra';

interface UntypedLetterState {
  expected: string;
  typed: null;
  status: 'untyped';
}

interface TypedLetterState {
  expected: string;
  typed: string;
  status: 'correct' | 'incorrect' | 'extra';
}

export type LetterState = UntypedLetterState | TypedLetterState;

export interface WordState {
  letters: LetterState[];
  expectedLength: number;
  isCompleted: boolean;
  isCorrect: boolean;
}

export interface TypingState {
  screen: Screen;
  text: string;
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
  isTypingPaused: boolean;
}

export type TypingAction =
  | { type: 'TYPE_CHAR'; char: string; timestamp: number }
  | { type: 'BACKSPACE' }
  | { type: 'SPACE'; timestamp: number }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'TOGGLE_TAPE_MODE' }
  | { type: 'SET_TAPE_MODE_FORCED'; forced: boolean }
  | { type: 'RESTART' }
  | { type: 'PAUSE_TYPING' };
