'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useProjectsStore } from '@/store'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import PhotoGrid from './PhotoGrid'
import Debug from './Debug'

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
      if (project?.photos) {
        console.log(`Photos récupérées : ${project.photos.length}`)
      } else {
        console.log('Aucune photo trouvée dans le projet')
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
    projects,
    currentProject,
    activeSlugs,
    handleBackToProjects,
    isClientReady,
  }
}

const ProjectNotFound = ({
  onBackClick,
}: {
  onBackClick: (e: React.MouseEvent) => void
}) => (
  <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
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
    projects,
    currentProject,
    activeSlugs,
    handleBackToProjects,
    isClientReady,
  } = useProjectDetail(category, slug)

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

  // Récupération directe des photos pour affichage
  const hasPhotos = Boolean(currentProject?.photos?.length)
  const photos = currentProject?.photos || []

  console.log('Rendu du composant ProjectDetail', {
    hasPhotos,
    photosCount: photos.length,
    photos,
  })

  return (
    <>
      <ProjectsView
        projects={projects}
        category={category}
        activeSlugs={activeSlugs}
      />

      {/* Affichage direct des photos, en ignorant les conditions */}
      <PhotoGrid photos={photos} />

      {/* Composant de débogage */}
      <Debug slug={slug} category={category} />
    </>
  )
}
