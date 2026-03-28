import { useEffect, useRef, type MouseEvent } from 'react';

import { cx } from 'tailwind-variants';

import ResultScreen from './components/ResultScreen';
import TypingControls from './components/TypingControls';
import TypingProgress from './components/TypingControls/components/TypingProgress';
import TypingScreen from './components/TypingScreen';
import { useTypingStore } from './hooks/useTypingStore';

const SENTINEL = ' ';

const resetInput = (el: HTMLInputElement) => {
  el.value = SENTINEL;
  el.selectionStart = 1;
  el.selectionEnd = 1;
};

const MonkeytypeAtHome = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  const screen = useTypingStore((s) => s.screen);
  const isFocused = useTypingStore((s) => s.isFocused);
  const dispatch = useTypingStore((s) => s.dispatch);

  // Initialize sentinel on mount
  useEffect(() => {
    if (inputRef.current) {
      resetInput(inputRef.current);
    }
  }, []);

  // Native beforeinput listener (React's onBeforeInput is polyfilled, not native)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) {
      return;
    }

    const handler = (event: InputEvent) => {
      const inputEvent = event;
      inputEvent.preventDefault();

      if (screen === 'result') {
        return;
      }

      const { inputType, data } = inputEvent;

      if (inputType === 'deleteContentBackward') {
        dispatch({ type: 'BACKSPACE' });
        return;
      }

      if (inputType === 'insertText' && data) {
        if (data === ' ') {
          dispatch({ type: 'SPACE', timestamp: performance.now() });
        } else if (data.length === 1) {
          dispatch({
            type: 'TYPE_CHAR',
            char: data,
            timestamp: performance.now(),
          });
        }
      }
    };

    el.addEventListener('beforeinput', handler);
    return () => el.removeEventListener('beforeinput', handler);
  }, [screen, dispatch]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleMouseMove = () => {
    dispatch({ type: 'PAUSE_TYPING' });
  };

  const handleRestart = () => {
    if (inputRef.current) {
      resetInput(inputRef.current);
    }
    focusInput();
  };

  const handleToggleTapeMode = () => {
    focusInput();
  };

  // Only handle shortcuts that don't produce text input (no beforeinput fired)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '.' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_TAPE_MODE' });
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      restartButtonRef.current?.focus();
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.selectionStart = 1;
      inputRef.current.selectionEnd = 1;
    }
    dispatch({ type: 'FOCUS' });
  };

  const handleBlur = () => {
    dispatch({ type: 'BLUR' });
  };

  const handleContainerClick = () => {
    focusInput();
  };

  const handleContainerMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    // PERF: Avoid stealing input focus and flashing isFocused state
    event.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className={cx(
        `
          relative flex-center min-h-58 rounded-md bg-inner-box px-6 py-4
          text-sm transition-shadow duration-350
        `,
        screen !== 'result' && 'cursor-text',
        isFocused && screen !== 'result' && 'ring-2 ring-primary/80',
      )}
      onClick={handleContainerClick}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleMouseMove}
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

      <div className='relative max-w-full'>
        {screen !== 'result' && (
          <TypingScreen
            containerRef={containerRef}
            className='component-transition'
          />
        )}
        {screen === 'result' && (
          <ResultScreen className='component-transition' />
        )}
        <TypingControls
          onRestart={handleRestart}
          onToggleTapeMode={handleToggleTapeMode}
          restartButtonRef={restartButtonRef}
        />

        {screen === 'typing' && (
          <TypingProgress
            className={cx(`absolute right-0 bottom-1 component-transition`)}
          />
        )}
      </div>
    </div>
  );
};

export default MonkeytypeAtHome;
