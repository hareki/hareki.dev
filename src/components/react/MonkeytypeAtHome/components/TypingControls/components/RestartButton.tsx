import type { RefObject } from 'react';

import { cx } from 'tailwind-variants';

import ShortcutHintButton from './ShortcutHintButton';
import { useTypingStore } from '../../../hooks/useTypingStore';

interface RestartButtonProps {
  onRestart?: () => void;
  ref?: RefObject<HTMLButtonElement | null>;
}

const RestartButton = ({ onRestart, ref }: RestartButtonProps) => {
  const screen = useTypingStore((s) => s.screen);
  const isTypingPaused = useTypingStore((s) => s.isTypingPaused);
  const dispatch = useTypingStore((s) => s.dispatch);

  return (
    <ShortcutHintButton
      ref={ref}
      keys={['Tab', 'Enter']}
      label='Restart'
      onClick={() => {
        dispatch({ type: 'RESTART' });
        onRestart?.();
      }}
      className={cx(
        `
          component-transition
          focus-within:opacity-100
        `,
        screen === 'typing' && !isTypingPaused && 'opacity-0',
      )}
    />
  );
};

export default RestartButton;
