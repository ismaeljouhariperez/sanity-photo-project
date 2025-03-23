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
}

// Création d'une instance d'adaptateur Sanity à l'extérieur du store
// pour éviter de créer une nouvelle instance à chaque utilisation
const sanityAdapter = new SanityAdapter()

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      // État initial
      activeCategory: null,
      activeSlug: null,
      projectsList: [],
      isLoading: false,
      hasFetched: {
        'black-and-white': false,
        'early-color': false,
      },

      // Actions
      setActiveProject: (category, slug) =>
        set({ activeCategory: category, activeSlug: slug }),

      setActiveCategory: (category) => set({ activeCategory: category }),

      loadProjects: async (category) => {
        if (!category) return []

        // Vérifier si les projets pour cette catégorie ont déjà été chargés
        const { hasFetched, projectsList } = get()

        if (hasFetched[category]) {
          // Retourner les projets filtrés par catégorie du cache interne
          return projectsList.filter((p) => p.category === category)
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
          set((state) => ({
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
          }))

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

        set((state) => ({
          projectsList: [
            ...state.projectsList.filter((p) => p.category !== category),
            ...projects,
          ],
          hasFetched: {
            ...state.hasFetched,
            [category]: true,
          },
        }))
      },

      setLoading: (isLoading) => set({ isLoading }),

      resetState: () =>
        set({
          activeCategory: null,
          activeSlug: null,
          projectsList: [],
          isLoading: false,
          hasFetched: {
            'black-and-white': false,
            'early-color': false,
          },
        }),
    }),
    {
      name: 'projects-storage',
      // On ne persiste que les données essentielles pour éviter de surcharger le stockage
      partialize: (state) => ({
        activeCategory: state.activeCategory,
        activeSlug: state.activeSlug,
        projectsList: state.projectsList,
        hasFetched: state.hasFetched,
      }),
    }
  )
)
