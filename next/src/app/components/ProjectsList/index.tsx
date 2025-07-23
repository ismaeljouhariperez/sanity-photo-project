'use client'

import { useEffect } from 'react'
import { useProjectsStore } from '@/store'
import ProjectsView from '../ProjectsView'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

/**
 * Container component for projects of a specific category
 * Manages data loading and renders the projects view
 */
export default function ProjectsList({ category }: ProjectsListProps) {
  const { loadProjects, setActiveCategory, getProjectsByCategory } =
    useProjectsStore()

  useEffect(() => {
    setActiveCategory(category)
    loadProjects(category, true)
  }, [category, loadProjects, setActiveCategory])

  const filteredProjects = getProjectsByCategory(category)

  return <ProjectsView projects={filteredProjects} category={category} />
}
