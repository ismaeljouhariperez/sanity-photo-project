import { create } from 'zustand'
import type { Project } from '@/lib/sanity.types'

interface CurrentProjectStore {
  project: Project | null
  setProject: (project: Project | null) => void
  clearProject: () => void
}

/**
 * Store for managing current project data
 * Shared between ProjectSlider and Header/GalleryOverlay
 * Prevents duplicate fetches and ensures data consistency
 */
export const useCurrentProjectStore = create<CurrentProjectStore>((set) => ({
  project: null,
  
  setProject: (project) => set({ project }),
  
  clearProject: () => set({ project: null }),
}))