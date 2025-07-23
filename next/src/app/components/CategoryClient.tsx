'use client'

import { useEffect } from 'react'
import { useProjectsStore } from '@/store'
import ProjectsView from '@/app/components/ProjectsView'

type CategoryType = 'black-and-white' | 'early-color'

/**
 * Composant client générique pour charger et afficher les projets d'une catégorie
 */
export default function CategoryClient({
  category,
}: {
  category: CategoryType
}) {
  const projects = useProjectsStore((state) =>
    state.getProjectsByCategory(category)
  )
  const loadProjects = useProjectsStore((state) => state.loadProjects)
  const isLoading = useProjectsStore((state) => state.isLoading)
  const hasFetched = useProjectsStore((state) => state.hasFetched)

  useEffect(() => {
    if (!hasFetched[category]) {
      loadProjects(category)
    }
  }, [category, loadProjects, hasFetched])

  if (isLoading) {
    return <div></div>
  }

  return (
    <ProjectsView projects={projects} category={category} activeSlugs={[]} />
  )
}
