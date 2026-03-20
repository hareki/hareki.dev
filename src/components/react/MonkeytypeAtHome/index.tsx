import { useReducer, useRef } from 'react';

import { cn } from 'tailwind-variants';

import { ResultScreen } from './components/ResultScreen';
import { ShortcutHints } from './components/ShortcutHints';
import { TypingScreen } from './components/TypingScreen';
import { useTapeMode } from './hooks/useTapeMode';
import { createInitialState, typingReducer } from './reducer';

export const MonkeytypeAtHome = () => {
  const [state, dispatch] = useReducer(typingReducer, undefined, () =>
    createInitialState(),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  const effectiveTapeMode = state.isTapeModeOn || state.isTapeModeForced;

  const { measureElement } = useTapeMode({
    isTapeModeOn: effectiveTapeMode,
    currentWordIndex: state.currentWordIndex,
    currentCharIndex: state.currentCharIndex,
    containerRef,
    typingAreaRef,
    wordsContainerRef,
    dispatch,
  });

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
    focusInput();
  };

  const handleToggleTapeMode = () => {
    dispatch({ type: 'TOGGLE_TAPE_MODE' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + . → toggle tape mode
    if (e.key === '.' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_TAPE_MODE' });
      return;
    }

    // Tab → focus restart button
    if (e.key === 'Tab') {
      e.preventDefault();
      restartButtonRef.current?.focus();
      return;
    }

    // On result screen: ignore typing keys
    if (state.screen === 'result') {
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      dispatch({ type: 'SPACE', timestamp: Date.now() });
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      dispatch({ type: 'BACKSPACE' });
      return;
    }

    // Single printable character (no meta/ctrl modifiers)
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      dispatch({ type: 'TYPE_CHAR', char: e.key, timestamp: Date.now() });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleFocus = () => dispatch({ type: 'FOCUS' });
  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    dispatch({ type: 'BLUR' });
  };

  const handleContainerClick = () => focusInput();

  return (
    <div
      ref={containerRef}
      className={cn(
        `
          relative min-h-50 cursor-text rounded-md p-4 text-sm transition-colors
          duration-350
        `,
        state.isFocused ? 'bg-secondary' : 'bg-inner-box',
      )}
      onClick={handleContainerClick}
    >
      {measureElement}

      <input
        ref={inputRef}
        className='absolute size-0 opacity-0'
        aria-label='Typing input'
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize='off'
        autoCorrect='off'
        autoComplete='off'
      />

      {state.screen !== 'result' && (
        <TypingScreen
          state={state}
          isTapeModeOn={effectiveTapeMode}
          typingAreaRef={typingAreaRef}
          wordsContainerRef={wordsContainerRef}
        />
      )}

      {state.screen === 'result' && <ResultScreen state={state} />}

      {/* Always present; hidden during typing, revealed on focus via Tab */}
      <div
        className={cn(
          'transition-opacity',
          state.screen === 'typing' &&
            `
              opacity-0
              focus-within:opacity-100
            `,
        )}
      >
        <ShortcutHints
          isTapeModeOn={state.isTapeModeOn}
          isTapeModeForced={state.isTapeModeForced}
          onRestart={handleRestart}
          onToggleTapeMode={handleToggleTapeMode}
          restartButtonRef={restartButtonRef}
        />
      </div>
    </div>
  );
};
