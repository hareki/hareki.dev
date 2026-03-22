import { createShuffledCycler } from './shuffledCycler';
import { TEXTS } from './types';

import type {
  LetterState,
  TypingAction,
  TypingState,
  WordState,
} from './types';

export const textCycler = createShuffledCycler(TEXTS.length);

const createWord = (word: string): WordState => {
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

export const createInitialState = (
  textIndex: number,
  overrides?: Partial<
    Pick<TypingState, 'isTapeModeOn' | 'isTapeModeForced' | 'isFocused'>
  >,
): TypingState => {
  const words = TEXTS[textIndex].split(' ');
  return {
    screen: 'idle',
    words: words.map(createWord),
    currentWordIndex: 0,
    currentCharIndex: 0,
    wordsTyped: 0,
    totalKeystrokes: 0,
    startTime: null,
    endTime: null,
    isTapeModeOn: overrides?.isTapeModeOn ?? false,
    isTapeModeForced: overrides?.isTapeModeForced ?? false,
    isFocused: overrides?.isFocused ?? false,
  };
};

const computeIsCorrect = (letters: LetterState[]): boolean => {
  return letters.every((l) => l.status === 'correct');
};

export const typingReducer = (
  state: TypingState,
  action: TypingAction,
): TypingState => {
  switch (action.type) {
    case 'TYPE_CHAR': {
      if (state.screen === 'result') {
        return state;
      }

      const word = state.words[state.currentWordIndex];
      const { currentCharIndex } = state;
      let newScreen = state.screen;
      let newStartTime = state.startTime;

      if (state.screen === 'idle') {
        newScreen = 'typing';
        newStartTime = action.timestamp;
      }

      let newLetters: LetterState[];
      if (currentCharIndex < word.letters.length) {
        const letter = word.letters[currentCharIndex];
        const isCorrect = action.char === letter.expected;
        newLetters = word.letters.map((l, i) =>
          i === currentCharIndex
            ? {
                ...l,
                typed: action.char,
                status: isCorrect ? 'correct' : 'incorrect',
              }
            : l,
        );
      } else {
        newLetters = [
          ...word.letters,
          { expected: '', typed: action.char, status: 'extra' as const },
        ];
      }

      const newWords = state.words.map((w, i) =>
        i === state.currentWordIndex ? { ...w, letters: newLetters } : w,
      );

      const newTotalKeystrokes = state.totalKeystrokes + 1;

      // Auto-finish: last word, all letters typed correctly, no extras
      const isLastWord = state.currentWordIndex === state.words.length - 1;
      if (
        isLastWord &&
        computeIsCorrect(newLetters) &&
        newLetters.length ===
          state.words[state.currentWordIndex].expectedLength &&
        currentCharIndex + 1 === newLetters.length
      ) {
        const finalWords = newWords.map((w, i) =>
          i === state.currentWordIndex
            ? { ...w, isCompleted: true, isCorrect: true }
            : w,
        );
        return {
          ...state,
          screen: 'result',
          startTime: newStartTime,
          words: finalWords,
          currentCharIndex: currentCharIndex + 1,
          wordsTyped: state.wordsTyped + 1,
          totalKeystrokes: newTotalKeystrokes,
          endTime: action.timestamp,
        };
      }

      return {
        ...state,
        screen: newScreen,
        startTime: newStartTime,
        words: newWords,
        currentCharIndex: currentCharIndex + 1,
        totalKeystrokes: newTotalKeystrokes,
      };
    }

    case 'SPACE': {
      if (state.screen === 'result') {
        return state;
      }
      if (state.currentCharIndex === 0) {
        return state;
      }

      const word = state.words[state.currentWordIndex];
      const isCorrect = computeIsCorrect(word.letters);
      const newWords = state.words.map((w, i) =>
        i === state.currentWordIndex
          ? { ...w, isCompleted: true, isCorrect }
          : w,
      );
      const newWordsTyped = state.wordsTyped + 1;

      if (state.currentWordIndex === state.words.length - 1) {
        return {
          ...state,
          words: newWords,
          wordsTyped: newWordsTyped,
          endTime: action.timestamp,
          screen: 'result',
        };
      }

      let newScreen = state.screen;
      let newStartTime = state.startTime;
      if (state.screen === 'idle') {
        newScreen = 'typing';
        newStartTime = action.timestamp;
      }

      return {
        ...state,
        screen: newScreen,
        startTime: newStartTime,
        words: newWords,
        currentWordIndex: state.currentWordIndex + 1,
        currentCharIndex: 0,
        wordsTyped: newWordsTyped,
      };
    }

    case 'BACKSPACE': {
      if (state.screen === 'result') {
        return state;
      }

      const { currentWordIndex, currentCharIndex } = state;

      if (currentCharIndex > 0) {
        const word = state.words[currentWordIndex];
        const newCharIndex = currentCharIndex - 1;

        let newLetters: LetterState[];
        if (newCharIndex >= state.words[currentWordIndex].expectedLength) {
          // Remove extra letter
          newLetters = word.letters.slice(0, -1);
        } else {
          // Reset letter to untyped
          newLetters = word.letters.map((l, i) =>
            i === newCharIndex
              ? { ...l, typed: null, status: 'untyped' as const }
              : l,
          );
        }

        const newWords = state.words.map((w, i) =>
          i === currentWordIndex ? { ...w, letters: newLetters } : w,
        );

        return {
          ...state,
          words: newWords,
          currentCharIndex: newCharIndex,
        };
      }

      // currentCharIndex === 0, try to go back to previous word
      if (currentWordIndex === 0) {
        return state;
      }

      const prevWord = state.words[currentWordIndex - 1];
      if (!prevWord.isCompleted || prevWord.isCorrect) {
        return state;
      }

      // Go back to previous incorrect word, place caret after the last typed char
      const newWords = state.words.map((w, i) =>
        i === currentWordIndex - 1 ? { ...w, isCompleted: false } : w,
      );

      const lastTypedIndex = prevWord.letters.findLastIndex(
        (l) => l.typed !== null,
      );
      return {
        ...state,
        words: newWords,
        currentWordIndex: currentWordIndex - 1,
        currentCharIndex: lastTypedIndex + 1,
        wordsTyped: state.wordsTyped - 1,
      };
    }

    case 'FOCUS':
      return { ...state, isFocused: true };

    case 'BLUR':
      return { ...state, isFocused: false };

    case 'TOGGLE_TAPE_MODE':
      if (state.isTapeModeForced) {
        return state;
      }
      return { ...state, isTapeModeOn: !state.isTapeModeOn };

    case 'SET_TAPE_MODE_FORCED':
      return {
        ...state,
        isTapeModeForced: action.forced,
        isTapeModeOn: action.forced ? true : state.isTapeModeOn,
      };

    case 'RESTART':
      return createInitialState(textCycler.next(), {
        isTapeModeOn: state.isTapeModeOn,
        isTapeModeForced: state.isTapeModeForced,
      });

    default:
      return state;
  }
};
