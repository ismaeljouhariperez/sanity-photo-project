import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AnimationState {
  hasPlayedHeaderAnimation: boolean
  isInProjectsSection: boolean
  isLeavingPage: boolean
  setHeaderAnimationPlayed: () => void
  resetHeaderAnimation: () => void
  setInProjectsSection: (value: boolean) => void
  setLeavingPage: (value: boolean) => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      hasPlayedHeaderAnimation: false,
      isInProjectsSection: false,
      isLeavingPage: false,
      setHeaderAnimationPlayed: () => set({ hasPlayedHeaderAnimation: true }),
      resetHeaderAnimation: () => set({ hasPlayedHeaderAnimation: false }),
      setInProjectsSection: (value) => set({ isInProjectsSection: value }),
      setLeavingPage: (value) => set({ isLeavingPage: value }),
    }),
    {
      name: 'animation-storage',
    }
  )
)
