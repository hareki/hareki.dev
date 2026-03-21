import type { FC } from 'react';

import { useTypingStore } from '../store';
import { WORDS } from '../types';

type Props = object;

const TypingProgress: FC<Props> = () => {
  const screen = useTypingStore((s) => s.screen);
  const wordsTyped = useTypingStore((s) => s.wordsTyped);

  return (
    screen === 'typing' && (
      <div className='text-right text-sm text-overlay1'>
        {wordsTyped}/{WORDS.length}
      </div>
    )
  );
};

export default TypingProgress;
