import { create } from 'zustand'

export interface ProjectViewState {
  // View state derived from URL
  mode: 'list' | 'detail'
  activeSlug: string | null
  
  // Animation state  
  hasEntered: boolean
  hoveredProject: string | null
  
  // Actions
  setMode: (mode: 'list' | 'detail') => void
  setActiveSlug: (slug: string | null) => void
  setHasEntered: (entered: boolean) => void
  setHoveredProject: (projectId: string | null) => void
  
  // URL sync
  syncWithURL: (pathname: string) => void
}

export const useProjectViewStore = create<ProjectViewState>()((set) => ({
  // Initial state
  mode: 'list',
  activeSlug: null,
  hasEntered: false,
  hoveredProject: null,
  
  // Basic setters
  setMode: (mode) => set({ mode }),
  setActiveSlug: (activeSlug) => set({ activeSlug }),
  setHasEntered: (hasEntered) => set({ hasEntered }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
  
  // URL synchronization
  syncWithURL: (pathname) => {
    const segments = pathname.split('/').filter(Boolean)
    
    if (segments.length === 2) {
      // /category/slug = detail mode
      const [, slug] = segments
      console.log('📍 [Store] Detail mode:', slug)
      set({ mode: 'detail', activeSlug: slug })
    } else if (segments.length === 1) {
      // /category = list mode  
      const [category] = segments
      console.log('📍 [Store] List mode:', category)
      set({ mode: 'list', activeSlug: null })
    }
  },
}))