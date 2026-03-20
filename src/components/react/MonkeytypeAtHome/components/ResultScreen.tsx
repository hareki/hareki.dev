import { useMemo } from 'react';

import { useBestWpm } from '../hooks/useBestWpm';
import { calculateResults } from '../utils';
import { CrownIcon } from './CrownIcon';
import { StatItem } from './StatItem';

import type { TypingState } from '../types';

interface ResultScreenProps {
  state: TypingState;
}

export const ResultScreen = ({ state }: ResultScreenProps) => {
  const stats = useMemo(
    () => calculateResults(state.words, state.startTime!, state.endTime!, state.totalKeystrokes),
    [state.words, state.startTime, state.endTime, state.totalKeystrokes],
  );

  const { updateBestWpm } = useBestWpm();
  const isNewBest = useMemo(() => updateBestWpm(stats.wpm), [updateBestWpm, stats.wpm]);

  const wpmLabel = (
    <span className='flex items-center gap-1'>
      {isNewBest && <CrownIcon className='text-yellow' />}
      wpm
    </span>
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-center gap-8'>
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
          label='Characters'
          value={`${stats.correct}/${stats.incorrect}/${stats.extra}/${stats.missed}`}
          tooltip={`correct: ${stats.correct}\nincorrect: ${stats.incorrect}\nextra: ${stats.extra}\nmissed: ${stats.missed}`}
        />
      </div>

      <p className='text-sm text-overlay1'>
        {"You didn't have to try this, glad you did. Thanks!"}
      </p>
    </div>
  );
};
