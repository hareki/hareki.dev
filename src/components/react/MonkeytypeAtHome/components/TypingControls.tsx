import { cx } from 'tailwind-variants';

import ShortcutHintButton from './ShortcutHintButton';
import TypingProgress from './TypingProgress';
import { useTypingStore } from '../store';

interface TypingControlsProps {
  onRestart: () => void;
  restartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const TypingControls = ({
  onRestart,
  restartButtonRef,
}: TypingControlsProps) => {
  const screen = useTypingStore((s) => s.screen);
  const isTapeModeOn = useTypingStore((s) => s.isTapeModeOn);
  const isTapeModeForced = useTypingStore((s) => s.isTapeModeForced);
  const dispatch = useTypingStore((s) => s.dispatch);

  const showTapeModeButton = screen === 'idle' && !isTapeModeForced;

  return (
    <div
      className={cx(
        'relative mt-3 flex-center gap-4 text-sm',
      )}
    >
      {/* Shortcuts */}
      <div className='flex items-center gap-5'>
        <ShortcutHintButton
          ref={restartButtonRef}
          keys={['Tab', 'Enter']}
          label='Restart'
          onClick={onRestart}
          className={cx(
            'focus-within:opacity-100',
            screen === 'typing' && 'opacity-0',
          )}
        />

        {showTapeModeButton && (
          <ShortcutHintButton
            keys={['Cmd/Ctrl', '.']}
            label='Tape Mode'
            onClick={() => dispatch({ type: 'TOGGLE_TAPE_MODE' })}
            active={isTapeModeOn}
          />
        )}
      </div>

      <TypingProgress
        className={cx(
          `
            absolute top-1/2 right-0 -translate-y-1/2 opacity-0
            transition-opacity
          `,
          screen === 'typing' && 'opacity-100',
        )}
      />
    </div>
  );
};

export default TypingControls;
