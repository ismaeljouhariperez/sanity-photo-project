import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnimationState {
  hasPlayedHeaderAnimation: boolean
  isInProjectsSection: boolean
  setHeaderAnimationPlayed: () => void
  resetHeaderAnimation: () => void
  setInProjectsSection: (value: boolean) => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      hasPlayedHeaderAnimation: false,
      isInProjectsSection: false,
      setHeaderAnimationPlayed: () => set({ hasPlayedHeaderAnimation: true }),
      resetHeaderAnimation: () => set({ hasPlayedHeaderAnimation: false }),
      setInProjectsSection: (value) => set({ isInProjectsSection: value }),
    }),
    {
      name: 'animation-storage',
    }
  )
)
