import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SanityAdapter } from '@/adapters'
import { Project } from '@/lib/sanity.types'

// Type Category pour typer correctement la catégorie
type Category = 'black-and-white' | 'early-color' | null

export interface ProjectsState {
  // State
  activeCategory: Category
  activeSlug: string | null
  previousSlug: string | null
  projectsList: Project[]
  isLoading: boolean
  hasFetched: {
    'black-and-white': boolean
    'early-color': boolean
  }

  // Actions
  setActiveProject: (category: Category, slug: string | null) => void
  setActiveCategory: (category: Category) => void
  loadProjects: (category: Category) => Promise<Project[]>
  setProjects: (projects: Project[], category: Category) => void
  setLoading: (isLoading: boolean) => void
  resetState: () => void

  // Selectors
  getProjectsByCategory: (category: Category) => Project[]
}

// Singleton Sanity adapter to avoid repeated instantiation
const sanityAdapter = new SanityAdapter()

/**
 * Zustand store for projects management
 * Handles loading, caching, and accessing projects by category
 */
export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => {
      // Cache for filtered projects to prevent chain re-renders
      const categoryProjectsCache: Record<string, Project[]> = {}

      return {
        // Initial state
        activeCategory: null,
        activeSlug: null,
        previousSlug: null,
        projectsList: [],
        isLoading: false,
        hasFetched: {
          'black-and-white': false,
          'early-color': false,
        },

        // Actions
        setActiveProject: (category, slug) =>
          set((state) => ({
            activeCategory: category,
            previousSlug: state.activeSlug,
            activeSlug: slug,
          })),

        setActiveCategory: (category) => set({ activeCategory: category }),

        loadProjects: async (category) => {
          if (!category) return []

          // Check if projects for this category are already loaded
          const { hasFetched } = get()

          if (hasFetched[category]) {
            // Return filtered projects from internal cache
            return get().getProjectsByCategory(category)
          }

          // Load from API if not cached
          try {
            set({ isLoading: true })

            const projects = await sanityAdapter.fetchProjects(category)

            // Process projects to normalize slugs
            const processedProjects = projects.map((project) => ({
              ...project,
              normalizedSlug: project.slug.current || String(project.slug),
            }))

            // Update state
            set((state) => {
              // Reset cache for this category
              if (category) delete categoryProjectsCache[category]

              return {
                projectsList: [
                  // Keep projects from other categories
                  ...state.projectsList.filter((p) => p.category !== category),
                  // Add new projects
                  ...processedProjects,
                ],
                hasFetched: {
                  ...state.hasFetched,
                  [category]: true,
                },
                isLoading: false,
              }
            })

            return processedProjects
          } catch (error) {
            console.error(`Error loading projects (${category}):`, error)
            set({ isLoading: false })
            return []
          }
        },

        setProjects: (projects, category) => {
          if (!category) return

          set((state) => {
            // Reset cache for this category
            if (category) delete categoryProjectsCache[category]

            return {
              projectsList: [
                ...state.projectsList.filter((p) => p.category !== category),
                ...projects,
              ],
              hasFetched: {
                ...state.hasFetched,
                [category]: true,
              },
            }
          })
        },

        setLoading: (isLoading) => set({ isLoading }),

        resetState: () => {
          // Clear the entire cache
          Object.keys(categoryProjectsCache).forEach((key) => {
            delete categoryProjectsCache[key]
          })

          set({
            activeCategory: null,
            activeSlug: null,
            previousSlug: null,
            projectsList: [],
            isLoading: false,
            hasFetched: {
              'black-and-white': false,
              'early-color': false,
            },
          })
        },

        // Optimized selector to filter projects by category
        getProjectsByCategory: (category) => {
          if (!category) return []

          // Use cache if available
          if (categoryProjectsCache[category]) {
            return categoryProjectsCache[category]
          }

          // Filter and cache results
          const filtered = get().projectsList.filter(
            (p) => p.category === category
          )
          categoryProjectsCache[category] = filtered
          return filtered
        },
      }
    },
    {
      name: 'projects-storage',
      // Only persist essential data to avoid storage bloat
      partialize: (state) => ({
        activeCategory: state.activeCategory,
        activeSlug: state.activeSlug,
        previousSlug: state.previousSlug,
        projectsList: state.projectsList,
        hasFetched: state.hasFetched,
      }),
    }
  )
)
