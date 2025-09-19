import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Consolidated animation and transition state
interface AnimationTransitionState {
  // Header animation state (persisted)
  hasPlayedHeaderAnimation: boolean
  isInProjectsSection: boolean
  
  // Page transition state (not persisted)
  isTransitioning: boolean
  direction: 'entering' | 'exiting' | null
  fromPage: string | null
  toPage: string | null
}

interface AnimationTransitionStore extends AnimationTransitionState {
  // Header animation actions
  setHeaderAnimationPlayed: () => void
  resetHeaderAnimation: () => void
  setInProjectsSection: (value: boolean) => void
  
  // Page transition actions
  setTransition: (
    transitioning: boolean, 
    direction?: 'entering' | 'exiting' | null,
    fromPage?: string | null,
    toPage?: string | null
  ) => void
  resetTransition: () => void
}

const initialTransitionState = {
  isTransitioning: false,
  direction: null as 'entering' | 'exiting' | null,
  fromPage: null as string | null,
  toPage: null as string | null
}

export const useAnimationStore = create<AnimationTransitionStore>()(
  persist(
    (set) => ({
      // Header animation state (persisted)
      hasPlayedHeaderAnimation: false,
      isInProjectsSection: false,
      
      // Page transition state (not persisted, always starts fresh)
      ...initialTransitionState,
      
      // Header animation actions
      setHeaderAnimationPlayed: () => set({ hasPlayedHeaderAnimation: true }),
      resetHeaderAnimation: () => set({ hasPlayedHeaderAnimation: false }),
      setInProjectsSection: (value) => set({ isInProjectsSection: value }),
      
      // Page transition actions
      setTransition: (transitioning, direction = null, fromPage = null, toPage = null) =>
        set({ 
          isTransitioning: transitioning, 
          direction, 
          fromPage, 
          toPage 
        }),
      resetTransition: () => set(initialTransitionState)
    }),
    {
      name: 'animation-storage',
      partialize: (state) => ({
        // Only persist header animation state
        hasPlayedHeaderAnimation: state.hasPlayedHeaderAnimation,
        isInProjectsSection: state.isInProjectsSection,
      }),
    }
  )
)

// Export transition-specific hook for backward compatibility
export const useTransitionStore = () => {
  const store = useAnimationStore()
  return {
    isTransitioning: store.isTransitioning,
    direction: store.direction,
    fromPage: store.fromPage,
    toPage: store.toPage,
    setTransition: store.setTransition,
    reset: store.resetTransition,
  }
}
