'use client'

import { useEffect, useState, useCallback } from 'react'
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
  const setActiveProject = useProjectsStore((state) => state.setActiveProject)

  const [photos, setPhotos] = useState<Photo[]>([])
  const [mounted, setMounted] = useState(false)

  // Fonction de chargement des photos mémorisée pour éviter les recréations
  const fetchProjectDetails = useCallback(async () => {
    try {
      const project = await loadProjectDetails(category, slug)
      if (project?.photos) {
        setPhotos(project.photos)
      }
    } catch (error) {
      console.error('Error loading project details:', error)
    }
  }, [category, slug, loadProjectDetails])

  // Premier effet: charger les données de base au montage du composant
  useEffect(() => {
    setMounted(true)

    // Marquer ce projet comme actif pour le state global
    setActiveProject(category, slug)

    // Charger les projets de la catégorie s'ils ne sont pas déjà chargés
    if (!hasFetched[category]) {
      loadProjects(category)
    }

    // Charger les détails du projet spécifique
    fetchProjectDetails()

    // Nettoyage lors du démontage
    return () => {
      setMounted(false)
    }
  }, [
    category,
    slug,
    loadProjects,
    fetchProjectDetails,
    hasFetched,
    setActiveProject,
  ])

  // État de chargement initial avant le montage du composant
  if (!mounted) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Chargement...</p>
      </div>
    )
  }

  // Si les projets sont en cours de chargement
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
