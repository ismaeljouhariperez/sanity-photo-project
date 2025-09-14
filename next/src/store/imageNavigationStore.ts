import { create } from 'zustand'

interface ImageNavigationStore {
  targetImageIndex: number | null
  setTargetImage: (index: number) => void
  clearTarget: () => void
}

export const useImageNavigationStore = create<ImageNavigationStore>((set) => ({
  targetImageIndex: null,
  setTargetImage: (index: number) => set({ targetImageIndex: index }),
  clearTarget: () => set({ targetImageIndex: null }),
}))