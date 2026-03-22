import { useEffect, useState } from 'react';

import { IconCrownFilled } from '@tabler/icons-react';

import { useBestWpm } from '../hooks/useBestWpm';
import { useTypingStore } from '../store';
import { calculateResults } from '../utils';
import StatItem from './StatItem';
import StarwindTooltip from '../../StarwindTooltip';

const ResultScreen = function ResultScreen() {
  const words = useTypingStore((s) => s.words);
  const startTime = useTypingStore((s) => s.startTime);
  const endTime = useTypingStore((s) => s.endTime);
  const totalKeystrokes = useTypingStore((s) => s.totalKeystrokes);

  const stats = calculateResults(words, startTime!, endTime!, totalKeystrokes);

  const { bestWpm, setBestWpm } = useBestWpm();
  const [isNewBest] = useState(() => stats.wpm > bestWpm);

  useEffect(() => {
    if (isNewBest) {
      setBestWpm(stats.wpm);
    }
  }, [isNewBest, stats.wpm, setBestWpm]);

  const wpmLabel = (
    <span className='flex items-center gap-1.5'>
      <span>wpm</span>
      {isNewBest && (
        <StarwindTooltip content='Your best wpm'>
          <div
            className='rounded-sm bg-primary p-0.5'
            aria-label='Your best wpm'
          >
            <IconCrownFilled className='size-3.5 text-inner-box' />
          </div>
        </StarwindTooltip>
      )}
    </span>
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-start justify-center gap-x-8 gap-y-2'>
        <StatItem
          label={wpmLabel}
          value={String(Math.round(stats.wpm))}
          tooltip={stats.wpm.toFixed(2)}
        />
        <StatItem
          label='acc'
          value={`${Math.round(stats.accuracy)}%`}
          tooltip={`${stats.accuracy.toFixed(2)}%`}
        />
        <StatItem
          label='time'
          value={`${Math.round(stats.timeSeconds)}s`}
          tooltip={`${stats.timeSeconds.toFixed(2)}s`}
        />
        <StatItem
          label='characters'
          value={`${stats.correct}/${stats.incorrect}/${stats.extra}/${stats.missed}`}
          tooltip={`correct: ${stats.correct}\nincorrect: ${stats.incorrect}\nextra: ${stats.extra}\nmissed: ${stats.missed}`}
        />
      </div>

      <p className='max-w-prose text-center text-base text-subtext0-foreground'>
        You didn't have to try this, glad you did. Thanks!
      </p>
    </div>
  );
};

export default ResultScreen;
