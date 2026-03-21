import { IconCrownFilled } from '@tabler/icons-react';

import { useBestWpm } from '../hooks/useBestWpm';
import { useTypingStore } from '../store';
import { calculateResults } from '../utils';
import StatItem from './StatItem';

const ResultScreen = function ResultScreen() {
  const words = useTypingStore((s) => s.words);
  const startTime = useTypingStore((s) => s.startTime);
  const endTime = useTypingStore((s) => s.endTime);
  const totalKeystrokes = useTypingStore((s) => s.totalKeystrokes);

  const stats = calculateResults(words, startTime!, endTime!, totalKeystrokes);

  const { updateBestWpm } = useBestWpm();
  const isNewBest = updateBestWpm(stats.wpm);

  const wpmLabel = (
    <span className='flex items-center gap-1'>
      {isNewBest && <IconCrownFilled className='text-yellow' />}
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

export default ResultScreen;
