import { create } from 'zustand';

import { createInitialState, textCycler, typingReducer } from './reducer';

import type { TypingAction, TypingState } from './types';

export interface TypingStore extends TypingState {
  dispatch: (action: TypingAction) => void;
  getEffectiveTapeMode: () => boolean;
}

let cachedState: TypingState = createInitialState(textCycler.next());

export const useTypingStore = create<TypingStore>((set, get) => ({
  ...cachedState,
  getEffectiveTapeMode: () => {
    const state = get();
    return state.isTapeModeOn || state.isTapeModeForced;
  },
  dispatch: (action) => {
    const next = typingReducer(cachedState, action);
    if (next === cachedState) {
      return;
    }
    cachedState = next;
    set(next);
  },
}));
