import { create } from 'zustand'

interface TransitionState {
  isTransitioning: boolean
  direction: 'entering' | 'exiting' | null
  fromPage: string | null
  toPage: string | null
}

interface TransitionStore extends TransitionState {
  setTransition: (
    transitioning: boolean, 
    direction?: 'entering' | 'exiting' | null,
    fromPage?: string | null,
    toPage?: string | null
  ) => void
  reset: () => void
}

const initialState: TransitionState = {
  isTransitioning: false,
  direction: null,
  fromPage: null,
  toPage: null
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  ...initialState,
  
  setTransition: (transitioning, direction = null, fromPage = null, toPage = null) =>
    set({ 
      isTransitioning: transitioning, 
      direction, 
      fromPage, 
      toPage 
    }),
    
  reset: () => set(initialState)
}))