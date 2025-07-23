import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProjects, getProjectBySlug } from '@/lib/sanity'
import { Project } from '@/lib/sanity.types'

type Category = 'black-and-white' | 'early-color' | null

export interface ProjectsState {
  // State
  activeCategory: Category
  activeSlug: string | null
  previousSlug: string | null
  previousPathname: string | null
  projectsList: Project[]
  isLoading: boolean
  isPhotoLoading: boolean
  projectViewMounted: boolean
  hasFetched: {
    'black-and-white': boolean
    'early-color': boolean
  }

  // Actions
  setActiveProject: (category: Category, slug: string | null) => void
  setActiveCategory: (category: Category) => void
  setPreviousPathname: (pathname: string) => void
  loadProjects: (
    category: Category,
    forceReload?: boolean
  ) => Promise<Project[]>
  loadProjectDetails: (
    category: Category,
    slug: string
  ) => Promise<Project | undefined>
  setProjects: (projects: Project[], category: Category) => void
  setLoading: (isLoading: boolean) => void
  setProjectViewMounted: (isMounted: boolean) => void
  setPhotoLoading: (isLoading: boolean) => void
  resetState: () => void

  // Selectors
  getProjectsByCategory: (category: Category) => Project[]
  getProjectBySlug: (category: Category, slug: string) => Project | undefined
}

// Direct Sanity function usage - no adapter needed

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
        previousPathname: null,
        projectsList: [],
        isLoading: false,
        isPhotoLoading: false,
        projectViewMounted: false,
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

        setPreviousPathname: (pathname) => set({ previousPathname: pathname }),

        setProjectViewMounted: (isMounted) =>
          set({ projectViewMounted: isMounted }),

        setPhotoLoading: (isLoading) => set({ isPhotoLoading: isLoading }),

        loadProjects: async (category, forceReload = false) => {
          if (!category) return []

          // Check if projects for this category are already loaded
          const { hasFetched } = get()

          // Skip loading if data is already loaded, unless forceReload is true
          if (hasFetched[category] && !forceReload) {
            // Return filtered projects from internal cache
            return get().getProjectsByCategory(category)
          }

          // Load from API if not cached or force reload
          try {
            set({ isLoading: true })

            const projects = await getProjects(category)

            // Process projects to normalize slugs
            const processedProjects = projects.map((project: Project) => ({
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
          } catch {
            set({ isLoading: false })
            return []
          }
        },

        loadProjectDetails: async (category, slug) => {
          if (!category || !slug) return undefined

          try {
            // Utiliser un état de chargement spécifique pour les photos
            set({ isPhotoLoading: true })

            // Récupérer le projet complet avec photos
            const projectDetail = await getProjectBySlug(slug, category)

            if (!projectDetail) {
              set({ isPhotoLoading: false })
              return undefined
            }

            // Normaliser le slug
            const normalizedProject = {
              ...projectDetail,
              normalizedSlug:
                projectDetail.slug.current || String(projectDetail.slug),
            }

            // Mettre à jour ce projet dans l'état
            set((state) => {
              // Trouver l'index du projet si déjà présent
              const projectsList = [...state.projectsList]
              const existingIndex = projectsList.findIndex(
                (p) =>
                  p.category === category &&
                  (p.normalizedSlug === slug ||
                    p.slug.current === slug ||
                    String(p.slug) === slug)
              )

              // Remplacer ou ajouter le projet
              if (existingIndex >= 0) {
                projectsList[existingIndex] = normalizedProject
              } else {
                projectsList.push(normalizedProject)
              }

              // Reset cache for this category
              if (category) delete categoryProjectsCache[category]

              return {
                projectsList,
                isPhotoLoading: false,
              }
            })

            return normalizedProject
          } catch {
            set({ isPhotoLoading: false })
            return undefined
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
            previousPathname: null,
            projectsList: [],
            isLoading: false,
            isPhotoLoading: false,
            projectViewMounted: false,
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

        // Get a specific project by slug and category
        getProjectBySlug: (category, slug) => {
          if (!category || !slug) return undefined

          const projects = get().getProjectsByCategory(category)
          return projects.find(
            (project) =>
              project.normalizedSlug === slug ||
              project.slug.current === slug ||
              String(project.slug) === slug
          )
        },
      }
    },
    {
      name: 'projects-storage',
      // Only persist essential data for animations
      partialize: (state) => ({
        activeCategory: state.activeCategory,
        activeSlug: state.activeSlug,
        previousSlug: state.previousSlug,
        previousPathname: state.previousPathname,
      }),
    }
  )
)
