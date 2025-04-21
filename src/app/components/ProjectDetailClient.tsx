'use client'

import { useEffect, useState } from 'react'
import { useProjectsStore } from '@/store'
import ProjectsView from '@/app/components/ProjectsView'
import PhotoGrid from '@/app/components/ProjectDetail/PhotoGrid'
import { Photo } from '@/lib/sanity.types'

type CategoryType = 'black-and-white' | 'early-color'

/**
 * Composant client générique pour la page de détail d'un projet
 */
export default function ProjectDetailClient({
  slug,
  category,
}: {
  slug: string
  category: CategoryType
}) {
  const projects = useProjectsStore((state) =>
    state.getProjectsByCategory(category)
  )
  const loadProjects = useProjectsStore((state) => state.loadProjects)
  const loadProjectDetails = useProjectsStore(
    (state) => state.loadProjectDetails
  )
  const isLoading = useProjectsStore((state) => state.isLoading)
  const isPhotoLoading = useProjectsStore((state) => state.isPhotoLoading)
  const hasFetched = useProjectsStore((state) => state.hasFetched)

  const [photos, setPhotos] = useState<Photo[]>([])

  // Charger les projets et les détails du projet actuel
  useEffect(() => {
    if (!hasFetched[category]) {
      loadProjects(category)
    }

    const loadPhotos = async () => {
      const project = await loadProjectDetails(category, slug)
      if (project?.photos) {
        setPhotos(project.photos)
      }
    }

    loadPhotos()
  }, [category, slug, loadProjects, loadProjectDetails, hasFetched])

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Chargement des projets...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Afficher les titres des projets avec le titre actif */}
      <ProjectsView
        projects={projects}
        category={category}
        activeSlugs={[slug]}
      />

      {/* Afficher les photos du projet */}
      {isPhotoLoading ? (
        <div className="px-16 py-20 text-center">
          <p>Chargement des photos...</p>
        </div>
      ) : (
        <PhotoGrid photos={photos} />
      )}
    </div>
  )
}
