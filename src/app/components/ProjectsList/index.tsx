'use client'

import React, { useEffect } from 'react'
import { useProjectsStore } from '@/store'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'
import Link from 'next/link'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

/**
 * Composant qui affiche la liste des projets d'une catégorie spécifique.
 * Gère le chargement des données depuis le store et affiche différents états:
 * - Chargement
 * - Liste vide
 * - Liste des projets
 */
export default function ProjectsList({ category }: ProjectsListProps) {
  const {
    isLoading,
    loadProjects,
    setActiveCategory,
    hasFetched,
    getProjectsByCategory,
  } = useProjectsStore()

  useEffect(() => {
    setActiveCategory(category)

    if (!hasFetched[category]) {
      loadProjects(category)
    }
  }, [category, loadProjects, setActiveCategory, hasFetched])

  const filteredProjects = getProjectsByCategory(category)

  if (isLoading) {
    return <LoadingView />
  }

  if (!filteredProjects?.length) {
    return <EmptyView />
  }

  return <ProjectsView projects={filteredProjects} category={category} />
}

// Composants d'UI extraits pour améliorer la lisibilité

const LoadingView = () => (
  <div className="flex flex-col justify-center items-center min-h-[70vh]">
    <DelayedLoader isLoading={true} message="Chargement des projets..." />
  </div>
)

const EmptyView = () => (
  <div className="flex flex-col justify-center items-center min-h-[70vh]">
    <p className="mb-4">Aucun projet trouvé dans cette catégorie.</p>
    <Link href="/projects" className="text-blue-500 hover:underline">
      Retour aux projets
    </Link>
  </div>
)
