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

  const isTyping = screen === 'typing';
  const isIdle = screen === 'idle';
  const isResult = screen === 'result';

  return (
    <div
      className={cx(
        'mt-3 flex items-center gap-4 text-sm',
        isResult ? 'justify-center' : 'justify-between',
      )}
    >
      {/* Shortcuts */}
      <div className='flex items-center gap-5'>
        <ShortcutHintButton
          ref={restartButtonRef}
          keys={['Tab', 'Enter']}
          label='Restart'
          onClick={onRestart}
          className={cx('focus-within:opacity-100', isTyping && 'opacity-0')}
        />

        {!isTapeModeForced && isIdle && (
          <ShortcutHintButton
            keys={['Cmd/Ctrl', '.']}
            label='Tape Mode'
            onClick={() => dispatch({ type: 'TOGGLE_TAPE_MODE' })}
            active={isTapeModeOn}
          />
        )}
      </div>

      {!isResult && (
        <TypingProgress
          className={cx(
            'opacity-0 transition-opacity',
            isTyping && 'opacity-100',
          )}
        />
      )}
    </div>
  );
};

export default TypingControls;
