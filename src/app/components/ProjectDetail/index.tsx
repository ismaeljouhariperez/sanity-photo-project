'use client'

import React, { useEffect, useMemo } from 'react'
import { useProjectsStore } from '@/store'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

interface ProjectDetailProps {
  slug: string
  category: 'black-and-white' | 'early-color'
}

/**
 * Custom hook that manages project data fetching and navigation
 */
function useProjectDetail(
  category: ProjectDetailProps['category'],
  slug: string
) {
  const { isLoading, hasFetched, loadProjects, setActiveProject } =
    useProjectsStore((state) => ({
      isLoading: state.isLoading,
      hasFetched: state.hasFetched,
      loadProjects: state.loadProjects,
      setActiveProject: state.setActiveProject,
    }))

  const projects = useProjectsStore((state) =>
    state.projectsList.filter((p) => p.category === category)
  )

  const { navigateTo } = useTransitionNavigation()
  const activeSlugs = useMemo(() => [slug], [slug])

  useEffect(() => {
    setActiveProject(category, slug)

    if (!hasFetched[category]) {
      loadProjects(category)
    }
  }, [category, slug, loadProjects, setActiveProject, hasFetched])

  const handleBackToProjects = (e: React.MouseEvent) => {
    e.preventDefault()
    navigateTo(`/projects/${category}`)
  }

  return {
    isLoading,
    projects,
    activeSlugs,
    handleBackToProjects,
  }
}

const ProjectNotFound = ({
  onBackClick,
}: {
  onBackClick: (e: React.MouseEvent) => void
}) => (
  <div className="flex flex-col justify-center items-center min-h-[70vh]">
    <p className="mb-4">Aucun projet trouvé.</p>
    <button onClick={onBackClick} className="text-blue-500 hover:underline">
      Retour aux projets
    </button>
  </div>
)

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <DelayedLoader isLoading={true} message="Chargement du projet..." />
  </div>
)

/**
 * Displays project details with a visual emphasis on the active project
 */
export default function ProjectDetail({ slug, category }: ProjectDetailProps) {
  const { isLoading, projects, activeSlugs, handleBackToProjects } =
    useProjectDetail(category, slug)

  if (isLoading) {
    return <LoadingState />
  }

  if (!projects.length) {
    return <ProjectNotFound onBackClick={handleBackToProjects} />
  }

  return (
    <ProjectsView
      projects={projects}
      category={category}
      activeSlugs={activeSlugs}
    />
  )
}
