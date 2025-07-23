import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CategoryType } from '@/lib/constants'

interface ProjectStore {
  selectedSlug: string | null
  selectedCategory: CategoryType | null
  setSelectedSlug: (slug: string | null) => void
  setSelectedCategory: (category: CategoryType | null) => void
  resetSelection: () => void
}

/**
 * Simplified project store for the new shared layout approach
 * Stores only essential state for smooth animations
 */
export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      selectedSlug: null,
      selectedCategory: null,
      
      setSelectedSlug: (slug) => set({ selectedSlug: slug }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      resetSelection: () => set({ selectedSlug: null, selectedCategory: null }),
    }),
    {
      name: 'project-store',
    }
  )
)