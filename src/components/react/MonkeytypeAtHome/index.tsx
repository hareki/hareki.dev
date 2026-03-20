import { useRef } from 'react';

import { cn } from 'tailwind-variants';

import { ResultScreen } from './components/ResultScreen';
import { ShortcutHints } from './components/ShortcutHints';
import { TapeModeManager } from './components/TapeModeManager';
import { TypingScreen } from './components/TypingScreen';
import { useTypingStore } from './store';
import { isMac } from './utils';

export const MonkeytypeAtHome = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  const screen = useTypingStore((s) => s.screen);
  const isFocused = useTypingStore((s) => s.isFocused);
  const dispatch = useTypingStore((s) => s.dispatch);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
    focusInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const modKey = isMac() ? e.metaKey : e.ctrlKey;
    if (e.key === '.' && modKey) {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_TAPE_MODE' });
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      restartButtonRef.current?.focus();
      return;
    }

    // On result screen: ignore typing keys
    if (screen === 'result') {
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
        isFocused ? 'bg-secondary' : 'bg-inner-box',
      )}
      onClick={handleContainerClick}
    >
      <TapeModeManager
        containerRef={containerRef}
        typingAreaRef={typingAreaRef}
        wordsContainerRef={wordsContainerRef}
      />

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

      {screen !== 'result' && (
        <TypingScreen
          typingAreaRef={typingAreaRef}
          wordsContainerRef={wordsContainerRef}
        />
      )}

      {screen === 'result' && <ResultScreen />}

      {/* Always present; hidden during typing, revealed on focus via Tab */}
      <div
        className={cn(
          'transition-opacity',
          screen === 'typing' &&
            `
              opacity-0
              focus-within:opacity-100
            `,
        )}
      >
        <ShortcutHints
          onRestart={handleRestart}
          restartButtonRef={restartButtonRef}
        />
      </div>
    </div>
  );
};
