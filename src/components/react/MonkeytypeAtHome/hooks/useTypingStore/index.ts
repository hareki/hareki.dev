import { create } from 'zustand';

import { TYPING_TEXTS } from './constants';
import { createInitialState, typingReducer } from './reducer';
import { createShuffledCycler } from '../../utils/shuffled-cycler';

import type { TypingState, TypingAction } from './types';

export { createInitialState, typingReducer } from './reducer';

export const textCycler = createShuffledCycler(TYPING_TEXTS.length);

export interface TypingStore extends TypingState {
  dispatch: (action: TypingAction) => void;
}

let cachedState: TypingState = createInitialState(TYPING_TEXTS[0]);

export const useTypingStore = create<TypingStore>((set) => ({
  ...cachedState,
  dispatch: (action) => {
    let next: TypingState;
    if (action.type === 'RESTART') {
      next = createInitialState(TYPING_TEXTS[textCycler.next()], {
        isTapeModeOn: cachedState.isTapeModeOn,
        isTapeModeForced: cachedState.isTapeModeForced,
        isFocused: cachedState.isFocused,
      });
    } else {
      next = typingReducer(cachedState, action);
      if (next === cachedState) {
        return;
      }
    }
    cachedState = next;
    set(next);
  },
}));
