const shuffle = (length: number): number[] => {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

export const createShuffledCycler = (length: number) => {
  let indices = shuffle(length);
  let position = -1;

  return {
    next(): number {
      position++;
      if (position >= indices.length) {
        const lastIndex = indices[indices.length - 1];
        do {
          indices = shuffle(length);
        } while (indices[0] === lastIndex);
        position = 0;
      }
      return indices[position];
    },
  };
};
