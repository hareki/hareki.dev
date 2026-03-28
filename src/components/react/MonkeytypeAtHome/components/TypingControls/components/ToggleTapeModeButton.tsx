import { cn } from 'tailwind-variants';

import ShortcutHintButton from './ShortcutHintButton';
import { useTypingStore } from '../../../hooks/useTypingStore';

interface ToggleTapeModeButtonProps {
  onToggleTapeMode?: () => void;
}

const ToggleTapeModeButton = ({
  onToggleTapeMode,
}: ToggleTapeModeButtonProps) => {
  const screen = useTypingStore((s) => s.screen);
  const isTypingPaused = useTypingStore((s) => s.isTypingPaused);
  const isTapeModeOn = useTypingStore((s) => s.isTapeModeOn);
  const isTapeModeForced = useTypingStore((s) => s.isTapeModeForced);
  const dispatch = useTypingStore((s) => s.dispatch);

  const shouldShowTapeMode = screen === 'idle' && !isTapeModeForced;
  const shouldUnmountTapeMode = screen === 'result' || isTapeModeForced;

  return (
    !shouldUnmountTapeMode && (
      <ShortcutHintButton
        keys={['Cmd/Ctrl', '.']}
        label='Tape Mode'
        onClick={() => {
          dispatch({ type: 'TOGGLE_TAPE_MODE' });
          onToggleTapeMode?.();
        }}
        checked={isTapeModeOn}
        className={cn(
          `
            component-transition
            focus-within:opacity-100
          `,
          !shouldShowTapeMode && !isTypingPaused && 'opacity-0',
        )}
      />
    )
  );
};

export default ToggleTapeModeButton;
