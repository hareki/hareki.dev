import { describe, it, expect } from 'vitest';

import { createInitialState, typingReducer } from './reducer';

import type { TypingState } from './types';

const makeState = (text: string, overrides?: Partial<TypingState>) => ({
  ...createInitialState(text),
  ...overrides,
});

const typeChars = (state: TypingState, chars: string): TypingState => {
  let s = state;
  for (const char of chars) {
    s = typingReducer(s, { type: 'TYPE_CHAR', char, timestamp: 1000 });
  }
  return s;
};

describe('createInitialState', () => {
  it('creates state from text with correct word structure', () => {
    const state = createInitialState('hello world');

    expect(state.screen).toBe('idle');
    expect(state.words).toHaveLength(2);
    expect(state.words[0].expectedLength).toBe(5);
    expect(state.words[1].expectedLength).toBe(5);
    expect(state.currentWordIndex).toBe(0);
    expect(state.currentCharIndex).toBe(0);
    expect(state.startTime).toBeNull();
    expect(state.endTime).toBeNull();
  });

  it('applies overrides', () => {
    const state = createInitialState('test', {
      isTapeModeOn: true,
      isFocused: true,
    });

    expect(state.isTapeModeOn).toBe(true);
    expect(state.isFocused).toBe(true);
    expect(state.isTapeModeForced).toBe(false);
  });
});

describe('typingReducer — TYPE_CHAR', () => {
  it('transitions from idle to typing on first char', () => {
    const state = makeState('hi');
    const next = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'h',
      timestamp: 100,
    });

    expect(next.screen).toBe('typing');
    expect(next.startTime).toBe(100);
  });

  it('marks correct char', () => {
    const state = makeState('hi');
    const next = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'h',
      timestamp: 100,
    });

    expect(next.words[0].letters[0].status).toBe('correct');
    expect(next.words[0].letters[0].typed).toBe('h');
    expect(next.currentCharIndex).toBe(1);
  });

  it('marks incorrect char', () => {
    const state = makeState('hi');
    const next = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'x',
      timestamp: 100,
    });

    expect(next.words[0].letters[0].status).toBe('incorrect');
    expect(next.words[0].letters[0].typed).toBe('x');
  });

  it('adds extra letter when typing past word length', () => {
    const state = makeState('ab cd');
    const typed = typeChars(state, 'ab');

    const extra = typingReducer(typed, {
      type: 'TYPE_CHAR',
      char: 'z',
      timestamp: 100,
    });

    expect(extra.words[0].letters).toHaveLength(3);
    expect(extra.words[0].letters[2].status).toBe('extra');
  });

  it('increments totalKeystrokes', () => {
    const state = makeState('hi');
    const next = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'h',
      timestamp: 100,
    });

    expect(next.totalKeystrokes).toBe(1);
  });

  it('is a no-op on result screen', () => {
    const state = makeState('hi', { screen: 'result' });
    const next = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'h',
      timestamp: 100,
    });

    expect(next).toBe(state);
  });

  it('auto-finishes when last word is fully typed correctly', () => {
    // Single word "ab"
    const state = makeState('ab');
    const afterA = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'a',
      timestamp: 100,
    });
    const afterB = typingReducer(afterA, {
      type: 'TYPE_CHAR',
      char: 'b',
      timestamp: 200,
    });

    expect(afterB.screen).toBe('result');
    expect(afterB.endTime).toBe(200);
    expect(afterB.words[0].isCompleted).toBe(true);
    expect(afterB.words[0].isCorrect).toBe(true);
    expect(afterB.wordsTyped).toBe(1);
  });

  it('does not auto-finish on incorrect last char', () => {
    const state = makeState('ab');
    const afterA = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'a',
      timestamp: 100,
    });
    const afterWrong = typingReducer(afterA, {
      type: 'TYPE_CHAR',
      char: 'x',
      timestamp: 200,
    });

    expect(afterWrong.screen).toBe('typing');
    expect(afterWrong.endTime).toBeNull();
  });
});

describe('typingReducer — SPACE', () => {
  it('completes word and advances to next', () => {
    const state = makeState('ab cd');
    const typed = typeChars(state, 'ab');
    const next = typingReducer(typed, { type: 'SPACE', timestamp: 200 });

    expect(next.words[0].isCompleted).toBe(true);
    expect(next.words[0].isCorrect).toBe(true);
    expect(next.currentWordIndex).toBe(1);
    expect(next.currentCharIndex).toBe(0);
    expect(next.wordsTyped).toBe(1);
  });

  it('marks incorrect word on space', () => {
    const state = makeState('ab cd');
    const typed = typeChars(state, 'ax');
    const next = typingReducer(typed, { type: 'SPACE', timestamp: 200 });

    expect(next.words[0].isCompleted).toBe(true);
    expect(next.words[0].isCorrect).toBe(false);
  });

  it('is a no-op when no chars typed (currentCharIndex === 0)', () => {
    const state = makeState('ab cd');
    const next = typingReducer(state, { type: 'SPACE', timestamp: 200 });

    expect(next).toBe(state);
  });

  it('transitions to result on last word space', () => {
    const state = makeState('ab cd');
    const typedFirst = typeChars(state, 'ab');
    const spaced = typingReducer(typedFirst, { type: 'SPACE', timestamp: 200 });
    // Type incorrectly so auto-finish doesn't trigger before SPACE
    const typedSecond = typeChars(spaced, 'cx');
    const result = typingReducer(typedSecond, {
      type: 'SPACE',
      timestamp: 300,
    });

    expect(result.screen).toBe('result');
    expect(result.endTime).toBe(300);
  });

  it('is a no-op on result screen', () => {
    const state = makeState('ab', { screen: 'result' });
    const next = typingReducer(state, { type: 'SPACE', timestamp: 200 });

    expect(next).toBe(state);
  });
});

describe('typingReducer — BACKSPACE', () => {
  it('resets last typed character to untyped', () => {
    const state = makeState('abc');
    const typed = typeChars(state, 'ab');
    const next = typingReducer(typed, { type: 'BACKSPACE' });

    expect(next.currentCharIndex).toBe(1);
    expect(next.words[0].letters[1].status).toBe('untyped');
    expect(next.words[0].letters[1].typed).toBeNull();
  });

  it('removes extra letters', () => {
    const state = makeState('ab cd');
    const typed = typeChars(state, 'abc');
    // 'abc' on word 'ab' → 2 normal + 1 extra
    expect(typed.words[0].letters).toHaveLength(3);

    const next = typingReducer(typed, { type: 'BACKSPACE' });
    expect(next.words[0].letters).toHaveLength(2);
    expect(next.currentCharIndex).toBe(2);
  });

  it('is a no-op at start of first word', () => {
    const state = makeState('hello');
    const next = typingReducer(state, { type: 'BACKSPACE' });

    expect(next).toBe(state);
  });

  it('goes back to previous incorrect word', () => {
    const state = makeState('ab cd');
    // Type "ax" (incorrect) then space to next word
    const typed = typeChars(state, 'ax');
    const spaced = typingReducer(typed, { type: 'SPACE', timestamp: 200 });

    expect(spaced.currentWordIndex).toBe(1);
    expect(spaced.words[0].isCompleted).toBe(true);
    expect(spaced.words[0].isCorrect).toBe(false);

    const back = typingReducer(spaced, { type: 'BACKSPACE' });

    expect(back.currentWordIndex).toBe(0);
    expect(back.words[0].isCompleted).toBe(false);
    expect(back.currentCharIndex).toBe(2); // after last typed char
    expect(back.wordsTyped).toBe(0);
  });

  it('does not go back to previous correct word', () => {
    const state = makeState('ab cd');
    const typed = typeChars(state, 'ab');
    const spaced = typingReducer(typed, { type: 'SPACE', timestamp: 200 });

    expect(spaced.currentWordIndex).toBe(1);
    expect(spaced.words[0].isCorrect).toBe(true);

    const back = typingReducer(spaced, { type: 'BACKSPACE' });
    expect(back).toBe(spaced);
  });

  it('is a no-op on result screen', () => {
    const state = makeState('ab', { screen: 'result' });
    const next = typingReducer(state, { type: 'BACKSPACE' });

    expect(next).toBe(state);
  });
});

describe('typingReducer — simple actions', () => {
  it('FOCUS sets isFocused to true', () => {
    const state = makeState('test', { isFocused: false });
    const next = typingReducer(state, { type: 'FOCUS' });

    expect(next.isFocused).toBe(true);
  });

  it('BLUR sets isFocused to false', () => {
    const state = makeState('test', { isFocused: true });
    const next = typingReducer(state, { type: 'BLUR' });

    expect(next.isFocused).toBe(false);
  });

  it('TOGGLE_TAPE_MODE flips isTapeModeOn', () => {
    const state = makeState('test', { isTapeModeOn: false });
    const toggled = typingReducer(state, { type: 'TOGGLE_TAPE_MODE' });
    expect(toggled.isTapeModeOn).toBe(true);

    const toggledBack = typingReducer(toggled, { type: 'TOGGLE_TAPE_MODE' });
    expect(toggledBack.isTapeModeOn).toBe(false);
  });

  it('TOGGLE_TAPE_MODE is a no-op when forced', () => {
    const state = makeState('test', {
      isTapeModeForced: true,
      isTapeModeOn: true,
    });
    const next = typingReducer(state, { type: 'TOGGLE_TAPE_MODE' });

    expect(next).toBe(state);
  });

  it('SET_TAPE_MODE_FORCED enables forced and tape mode', () => {
    const state = makeState('test', {
      isTapeModeForced: false,
      isTapeModeOn: false,
    });
    const next = typingReducer(state, {
      type: 'SET_TAPE_MODE_FORCED',
      forced: true,
    });

    expect(next.isTapeModeForced).toBe(true);
    expect(next.isTapeModeOn).toBe(true);
  });

  it('SET_TAPE_MODE_FORCED preserves isTapeModeOn when unforcing', () => {
    const state = makeState('test', {
      isTapeModeForced: true,
      isTapeModeOn: true,
    });
    const next = typingReducer(state, {
      type: 'SET_TAPE_MODE_FORCED',
      forced: false,
    });

    expect(next.isTapeModeForced).toBe(false);
    expect(next.isTapeModeOn).toBe(true);
  });

  it('PAUSE_TYPING sets isTypingPaused when typing', () => {
    const state = makeState('test', { screen: 'typing' });
    const next = typingReducer(state, { type: 'PAUSE_TYPING' });

    expect(next.isTypingPaused).toBe(true);
  });

  it('PAUSE_TYPING is a no-op when not typing', () => {
    const state = makeState('test', { screen: 'idle' });
    const next = typingReducer(state, { type: 'PAUSE_TYPING' });

    expect(next).toBe(state);
  });

  it('PAUSE_TYPING is a no-op when already paused', () => {
    const state = makeState('test', {
      screen: 'typing',
      isTypingPaused: true,
    });
    const next = typingReducer(state, { type: 'PAUSE_TYPING' });

    expect(next).toBe(state);
  });

  it('RESTART is a no-op in the pure reducer', () => {
    const state = makeState('test');
    const next = typingReducer(state, { type: 'RESTART' });

    expect(next).toBe(state);
  });
});

describe('typingReducer — identity check optimization', () => {
  it('returns same reference for no-op BACKSPACE at start', () => {
    const state = makeState('hello');
    const next = typingReducer(state, { type: 'BACKSPACE' });

    expect(next).toBe(state);
  });

  it('returns same reference for TYPE_CHAR on result screen', () => {
    const state = makeState('hi', { screen: 'result' });
    const next = typingReducer(state, {
      type: 'TYPE_CHAR',
      char: 'h',
      timestamp: 100,
    });

    expect(next).toBe(state);
  });

  it('returns same reference for SPACE on result screen', () => {
    const state = makeState('hi', { screen: 'result' });
    const next = typingReducer(state, { type: 'SPACE', timestamp: 100 });

    expect(next).toBe(state);
  });
});
