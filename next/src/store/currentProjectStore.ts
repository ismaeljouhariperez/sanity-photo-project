import { create } from 'zustand'
import type { Project } from '@/lib/sanity.types'

// Consolidated project and image navigation state
interface ProjectStore {
  // Current project data
  project: Project | null
  
  // Image navigation within project
  targetImageIndex: number | null
  
  // Project actions
  setProject: (project: Project | null) => void
  clearProject: () => void
  
  // Image navigation actions
  setTargetImage: (index: number) => void
  clearTargetImage: () => void
}

/**
 * Consolidated store for managing project and image navigation state
 * Shared between ProjectSlider, Header/GalleryOverlay, and image navigation
 * Prevents duplicate fetches and ensures data consistency
 */
export const useProjectStore = create<ProjectStore>((set) => ({
  // Project state
  project: null,
  
  // Image navigation state
  targetImageIndex: null,
  
  // Project actions
  setProject: (project) => set({ project }),
  clearProject: () => set({ project: null }),
  
  // Image navigation actions
  setTargetImage: (index: number) => set({ targetImageIndex: index }),
  clearTargetImage: () => set({ targetImageIndex: null }),
}))

// Backward compatibility hooks
export const useCurrentProjectStore = (selector?: (state: ProjectStore) => any) => {
  const store = useProjectStore()
  if (selector) return selector(store)
  return {
    project: store.project,
    setProject: store.setProject,
    clearProject: store.clearProject,
  }
}

export const useImageNavigationStore = (selector?: (state: ProjectStore) => any) => {
  const store = useProjectStore()
  if (selector) return selector(store)
  return {
    targetImageIndex: store.targetImageIndex,
    setTargetImage: store.setTargetImage,
    clearTarget: store.clearTargetImage,
  }
}