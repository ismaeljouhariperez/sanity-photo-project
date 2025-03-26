import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SanityAdapter } from '@/adapters'
import { Project } from '@/lib/sanity.types'

// Type Category pour typer correctement la catégorie
type Category = 'black-and-white' | 'early-color' | null

export interface ProjectsState {
  // État
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

  // Sélecteurs
  getProjectsByCategory: (category: Category) => Project[]
}

// Création d'une instance d'adaptateur Sanity à l'extérieur du store
// pour éviter de créer une nouvelle instance à chaque utilisation
const sanityAdapter = new SanityAdapter()

/**
 * Store Zustand pour la gestion des projets
 * Gère le chargement, la mise en cache et l'accès aux projets par catégorie
 */
export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => {
      // Mise en cache des résultats de filtrage pour éviter des re-rendus en chaîne
      const categoryProjectsCache: Record<string, Project[]> = {}

      return {
        // État initial
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

          // Vérifier si les projets pour cette catégorie ont déjà été chargés
          const { hasFetched } = get()

          if (hasFetched[category]) {
            // Retourner les projets filtrés par catégorie du cache interne
            return get().getProjectsByCategory(category)
          }

          // Sinon, charger depuis l'API
          try {
            set({ isLoading: true })

            const projects = await sanityAdapter.fetchProjects(category)

            // Traiter les projets pour normaliser les slugs
            const processedProjects = projects.map((project) => ({
              ...project,
              normalizedSlug: project.slug.current || String(project.slug),
            }))

            // Mettre à jour l'état
            set((state) => {
              // Réinitialiser le cache pour cette catégorie
              if (category) delete categoryProjectsCache[category]

              return {
                projectsList: [
                  // Conserver les projets des autres catégories
                  ...state.projectsList.filter((p) => p.category !== category),
                  // Ajouter les nouveaux projets
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
            console.error(
              `Erreur lors du chargement des projets (${category}):`,
              error
            )
            set({ isLoading: false })
            return []
          }
        },

        setProjects: (projects, category) => {
          if (!category) return

          set((state) => {
            // Réinitialiser le cache pour cette catégorie
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
          // Vider complètement le cache
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

        // Sélecteur optimisé pour filtrer les projets par catégorie
        getProjectsByCategory: (category) => {
          if (!category) return []

          // Utiliser le cache si disponible
          if (categoryProjectsCache[category]) {
            return categoryProjectsCache[category]
          }

          // Sinon, filtrer et mettre en cache
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
      // On ne persiste que les données essentielles pour éviter de surcharger le stockage
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
