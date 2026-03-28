import { cn } from 'tailwind-variants';

import RestartButton from './components/RestartButton';
import ToggleTapeModeButton from './components/ToggleTapeModeButton';

interface TypingControlsProps {
  onRestart?: () => void;
  onToggleTapeMode?: () => void;
  restartButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

const TypingControls = ({
  onRestart,
  onToggleTapeMode,
  restartButtonRef,
}: TypingControlsProps) => {
  return (
    <div className={cn('relative mt-3 flex-center gap-4 text-sm')}>
      {/* Shortcuts */}
      <div className='flex items-center gap-5'>
        <RestartButton onRestart={onRestart} ref={restartButtonRef} />
        <ToggleTapeModeButton onToggleTapeMode={onToggleTapeMode} />
      </div>
    </div>
  );
};

export default TypingControls;
