import { useRef } from 'react';

import { cx } from 'tailwind-variants';

import ResultScreen from './components/ResultScreen';
import TypingControls from './components/TypingControls';
import TypingScreen from './components/TypingScreen';
import { useTypingStore } from './store';

const MonkeytypeAtHome = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

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
    if (e.key === '.' && (e.metaKey || e.ctrlKey)) {
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
  const handleBlur = () => {
    dispatch({ type: 'BLUR' });
  };

  const handleContainerClick = () => focusInput();

  return (
    <div
      ref={containerRef}
      className={cx(
        `
          relative flex-center min-h-56 rounded-md bg-inner-box p-4 text-sm
          transition-shadow duration-350
        `,
        screen !== 'result' && 'cursor-text',
        isFocused && screen !== 'result' && 'ring-2 ring-primary/70',
      )}
      onClick={handleContainerClick}
    >
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

      <div className='max-w-full'>
        {screen !== 'result' && <TypingScreen containerRef={containerRef} />}
        {screen === 'result' && <ResultScreen />}

        <TypingControls
          onRestart={handleRestart}
          restartButtonRef={restartButtonRef}
        />
      </div>
    </div>
  );
};

export default MonkeytypeAtHome;
