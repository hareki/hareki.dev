import { useTypingStore } from '../hooks/useTypingStore';

import type { Screen } from '../hooks/useTypingStore/types';

const screenMessages: Record<Screen, string> = {
  idle: 'Typing test ready. Click or focus to start typing.',
  typing: 'Typing in progress.',
  result: 'Typing test complete. Results are shown.',
};

const ScreenAnnouncer = () => {
  const screen = useTypingStore((s) => s.screen);

  return (
    <div aria-live='assertive' aria-atomic='true' className='sr-only'>
      {screenMessages[screen]}
    </div>
  );
};

export default ScreenAnnouncer;
