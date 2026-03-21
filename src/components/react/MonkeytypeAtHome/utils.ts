import type { ResultStats, WordState } from './types';

export const calculateResults = (
  words: WordState[],
  startTime: number,
  endTime: number,
  totalKeystrokes: number,
): ResultStats => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  for (const word of words) {
    for (const letter of word.letters) {
      switch (letter.status) {
        case 'correct':
          correct++;
          break;
        case 'incorrect':
          incorrect++;
          break;
        case 'extra':
          extra++;
          break;
        case 'untyped':
          missed++;
          break;
      }
    }
  }

  const timeSeconds = (endTime - startTime) / 1000;
  const timeMinutes = timeSeconds / 60;
  const wpm = correct > 0 ? correct / 5 / timeMinutes : 0;
  // Accuracy uses totalKeystrokes (includes backspaced chars) instead of just final letter states
  const accuracy = totalKeystrokes > 0 ? (correct / totalKeystrokes) * 100 : 0;

  return {
    wpm,
    accuracy,
    timeSeconds,
    correct,
    incorrect,
    extra,
    missed,
    totalKeystrokes,
  };
};
