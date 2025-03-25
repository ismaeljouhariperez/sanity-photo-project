'use client'

import React, { useEffect, useMemo } from 'react'
import { useProjectsStore } from '@/store'
import Link from 'next/link'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'

interface ProjectDetailProps {
  slug: string
  category: 'black-and-white' | 'early-color'
}

export default function ProjectDetail({ slug, category }: ProjectDetailProps) {
  // Utiliser le store pour accéder aux projets et gérer l'état
  const {
    projectsList,
    isLoading,
    loadProjects,
    setActiveProject,
    hasFetched,
  } = useProjectsStore()

  // Mémoriser le slug actif pour éviter des re-rendus inutiles
  const activeSlugs = useMemo(() => [slug], [slug])

  // Un seul effet pour initialiser l'état
  useEffect(() => {
    // Mettre à jour le projet actif
    setActiveProject(category, slug)

    // Charger les projets si nécessaire
    if (!hasFetched[category]) {
      loadProjects(category)
    }
  }, [category, slug, loadProjects, setActiveProject, hasFetched])

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <DelayedLoader isLoading={true} message="Chargement du projet..." />
      </div>
    )
  }

  // Filtrer les projets pour la catégorie actuelle
  const filteredProjects = projectsList.filter((p) => p.category === category)

  // Si pas de projets trouvés
  if (!filteredProjects.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <p className="mb-4">Aucun projet trouvé.</p>
        <Link href="/projects" className="text-blue-500 hover:underline">
          Retour aux projets
        </Link>
      </div>
    )
  }

  // Afficher la même vue que dans ProjectsList, avec le projet actuel en surbrillance
  return (
    <ProjectsView
      projects={filteredProjects}
      category={category}
      activeSlugs={activeSlugs}
      disableAnimations={true}
    />
  )
}
