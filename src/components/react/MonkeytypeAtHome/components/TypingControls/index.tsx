import { cx } from 'tailwind-variants';

import ShortcutHintButton from './components/ShortcutHintButton';
import { useTypingStore } from '../../hooks/useTypingStore';

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

  const shouldShowTapeMode = screen === 'idle' && !isTapeModeForced;
  const shouldUnmountTapeMode = screen === 'result' || isTapeModeForced;

  return (
    <div className={cx('relative mt-3 flex-center gap-4 text-sm')}>
      {/* Shortcuts */}
      <div className='flex items-center gap-5'>
        <ShortcutHintButton
          ref={restartButtonRef}
          keys={['Tab', 'Enter']}
          label='Restart'
          onClick={onRestart}
          className={cx(
            `
              component-transition
              focus-within:opacity-100
            `,
            screen === 'typing' && 'opacity-0',
          )}
        />

        {!shouldUnmountTapeMode && (
          <ShortcutHintButton
            keys={['Cmd/Ctrl', '.']}
            label='Tape Mode'
            onClick={() => dispatch({ type: 'TOGGLE_TAPE_MODE' })}
            checked={isTapeModeOn}
            hidden={!shouldShowTapeMode}
            className={cx(
              'component-transition',
              !shouldShowTapeMode && 'opacity-0',
            )}
          />
        )}
      </div>
    </div>
  );
};

export default TypingControls;
