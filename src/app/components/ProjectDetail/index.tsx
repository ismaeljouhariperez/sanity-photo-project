'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useProjectsStore } from '@/store'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import PhotoGrid from './PhotoGrid'
import Debug from './Debug'
import { Photo } from '@/lib/sanity.types'

interface ProjectDetailProps {
  slug: string
  category: 'black-and-white' | 'early-color'
}

/**
 * Custom hook for project data management and navigation
 * Handles project loading, state tracking, and navigation between views
 */
function useProjectDetail(
  category: ProjectDetailProps['category'],
  slug: string
) {
  const isLoading = useProjectsStore((state) => state.isLoading)
  const isPhotoLoading = useProjectsStore((state) => state.isPhotoLoading)
  const hasFetched = useProjectsStore((state) => state.hasFetched)
  const loadProjects = useProjectsStore((state) => state.loadProjects)
  const loadProjectDetails = useProjectsStore(
    (state) => state.loadProjectDetails
  )
  const setActiveProject = useProjectsStore((state) => state.setActiveProject)
  const getProjectsByCategory = useProjectsStore(
    (state) => state.getProjectsByCategory
  )
  const getProjectBySlug = useProjectsStore((state) => state.getProjectBySlug)

  const projects = useMemo(
    () => getProjectsByCategory(category),
    [getProjectsByCategory, category]
  )

  const currentProject = useMemo(
    () => getProjectBySlug(category, slug),
    [getProjectBySlug, category, slug]
  )

  const { navigateWithTransition } = useTransitionNavigation()
  const activeSlugs = useMemo(() => [slug], [slug])

  // État client uniquement pour éviter les problèmes d'hydratation
  const [isClientReady, setIsClientReady] = useState(false)
  const [projectPhotos, setProjectPhotos] = useState<Photo[]>([])

  useEffect(() => {
    // Marquer comme prêt côté client après hydratation
    setIsClientReady(true)

    setActiveProject(category, slug)

    if (!hasFetched[category]) {
      // Charger tous les projets de la catégorie pour l'affichage de la liste
      loadProjects(category)
    }

    // Charger les détails du projet spécifique (avec les photos)
    loadProjectDetails(category, slug).then((project) => {
      console.log('Projet chargé avec détails :', project)
      if (project?.photos && project.photos.length > 0) {
        console.log(`Photos récupérées : ${project.photos.length}`)
        console.log('Première photo :', project.photos[0])
        setProjectPhotos(project.photos)
      } else {
        console.log('Aucune photo trouvée dans le projet')
        setProjectPhotos([])
      }
    })
  }, [
    category,
    slug,
    loadProjects,
    loadProjectDetails,
    setActiveProject,
    hasFetched,
  ])

  const handleBackToProjects = (e: React.MouseEvent) => {
    e.preventDefault()

    // Mark this project as previously active for better transition experience
    setActiveProject(category, slug)

    navigateWithTransition(`/projects/${category}`)
  }

  return {
    isLoading,
    isPhotoLoading,
    projects,
    currentProject,
    activeSlugs,
    handleBackToProjects,
    isClientReady,
    projectPhotos,
  }
}

const ProjectNotFound = ({
  onBackClick,
}: {
  onBackClick: (e: React.MouseEvent) => void
}) => (
  <div className="min-h-100vh flex justify-center items-center px-16">
    <p className="mb-4">Aucun projet trouvé.</p>
    <button onClick={onBackClick} className="text-blue-500 hover:underline">
      Retour aux projets
    </button>
  </div>
)

const LoadingState = () => (
  <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
    <DelayedLoader isLoading={true} message="Chargement du projet..." />
  </div>
)

/**
 * Project detail view that displays a specific project
 * Uses ProjectsView but focuses on the active project
 */
export default function ProjectDetail({ slug, category }: ProjectDetailProps) {
  const {
    isLoading,
    isPhotoLoading,
    projects,
    currentProject,
    activeSlugs,
    handleBackToProjects,
    isClientReady,
    projectPhotos,
  } = useProjectDetail(category, slug)

  // Mémoriser le composant ProjectsView pour éviter les remontages inutiles
  const memoizedProjectsView = useMemo(
    () => (
      <ProjectsView
        projects={projects}
        category={category}
        activeSlugs={activeSlugs}
      />
    ),
    [projects, category, activeSlugs]
  )

  // Débogage du projet courant
  useEffect(() => {
    if (currentProject) {
      console.log('État actuel du projet :', {
        slug,
        category,
        hasPhotos: Boolean(currentProject?.photos?.length),
        photosCount: currentProject?.photos?.length || 0,
        currentProject,
      })
    }
  }, [slug, category, currentProject])

  // État de chargement initial pour éviter l'erreur d'hydratation
  if (!isClientReady) {
    return (
      <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
        <DelayedLoader isLoading={true} message="Initialisation..." />
      </div>
    )
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (!projects.length) {
    return <ProjectNotFound onBackClick={handleBackToProjects} />
  }

  // Utiliser directement projectPhotos qui est plus fiable que currentProject?.photos
  const photos =
    projectPhotos.length > 0 ? projectPhotos : currentProject?.photos || []

  console.log('Rendu du composant ProjectDetail', {
    hasPhotos: photos.length > 0,
    photosCount: photos.length,
    photosSources:
      projectPhotos.length > 0 ? 'From useState' : 'From currentProject',
    firstPhoto: photos.length > 0 ? photos[0] : null,
  })

  if (isPhotoLoading) {
    return (
      <>
        {/* Utiliser l'instance mémorisée */}
        {memoizedProjectsView}
        <div className="px-16 py-20 text-center">
          <DelayedLoader isLoading={true} message="Chargement des photos..." />
        </div>
        <Debug slug={slug} category={category} />
      </>
    )
  }

  return (
    <>
      {/* Utiliser l'instance mémorisée */}
      {memoizedProjectsView}

      {/* Utiliser les photos depuis l'état local pour garantir une donnée à jour */}
      <PhotoGrid photos={photos} />

      {/* Composant de débogage */}
      {/* <Debug slug={slug} category={category} /> */}
    </>
  )
}
