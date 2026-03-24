import { type TypingState } from './types';

export const selectShowRedUnderline = (wordIndex: number) => (s: TypingState) =>
  s.words[wordIndex].isCompleted && !s.words[wordIndex].isCorrect;

export const selectEffectiveTapeMode = (s: TypingState) =>
  s.isTapeModeOn || s.isTapeModeForced;
