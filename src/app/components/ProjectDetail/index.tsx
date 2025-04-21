'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useProjectsStore } from '@/store'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import PhotoGrid from './PhotoGrid'
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

  const [isClientReady, setIsClientReady] = useState(false)
  const [projectPhotos, setProjectPhotos] = useState<Photo[]>([])

  useEffect(() => {
    setIsClientReady(true)
    setActiveProject(category, slug)

    if (!hasFetched[category]) {
      loadProjects(category)
    }

    loadProjectDetails(category, slug).then((project) => {
      if (project?.photos && project.photos.length > 0) {
        setProjectPhotos(project.photos)
      } else {
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
    setActiveProject(category, slug)
    navigateWithTransition(`/${category}`)
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

  const photos =
    projectPhotos.length > 0 ? projectPhotos : currentProject?.photos || []

  if (isPhotoLoading) {
    return (
      <>
        {memoizedProjectsView}
        <div className="px-16 py-20 text-center">
          <DelayedLoader isLoading={true} message="Chargement des photos..." />
        </div>
      </>
    )
  }

  return (
    <>
      <PhotoGrid photos={photos} />
    </>
  )
}
