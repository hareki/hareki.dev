import { create } from 'zustand';

import { createInitialState, typingReducer } from './reducer';

import type { TypingAction, TypingState } from './types';

export interface TypingStore extends TypingState {
  dispatch: (action: TypingAction) => void;
}

let cachedState: TypingState = createInitialState();

export const useTypingStore = create<TypingStore>((set) => ({
  ...cachedState,
  dispatch: (action) => {
    const next = typingReducer(cachedState, action);
    if (next === cachedState) {return;}
    cachedState = next;
    set(next);
  },
}));
