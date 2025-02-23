import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnimationState {
  hasPlayedHeaderAnimation: boolean
  setHeaderAnimationPlayed: () => void
  resetHeaderAnimation: () => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      hasPlayedHeaderAnimation: false,
      setHeaderAnimationPlayed: () => set({ hasPlayedHeaderAnimation: true }),
      resetHeaderAnimation: () => set({ hasPlayedHeaderAnimation: false }),
    }),
    {
      name: 'animation-storage',
    }
  )
)
