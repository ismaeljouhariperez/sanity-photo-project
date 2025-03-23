'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProjectsStore } from '@/store'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsList({ category }: ProjectsListProps) {
  // Utiliser notre store au lieu de l'adapter Sanity directement
  const {
    projectsList,
    isLoading,
    loadProjects,
    setActiveCategory,
    hasFetched,
  } = useProjectsStore()

  // Effet pour charger les projets et mettre à jour la catégorie active
  useEffect(() => {
    // Mettre à jour la catégorie active
    setActiveCategory(category)

    // Charger les projets si non déjà chargés
    if (!hasFetched[category]) {
      loadProjects(category)
    }
  }, [category, loadProjects, setActiveCategory, hasFetched])

  // Obtenir les projets filtrés pour la catégorie actuelle
  const filteredProjects = projectsList.filter((p) => p.category === category)

  // Afficher un écran de chargement pendant le chargement initial
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <DelayedLoader isLoading={true} message="Chargement des projets..." />
      </div>
    )
  }

  // Attendre que le chargement soit terminé avant d'afficher "Aucun projet trouvé"
  if (!filteredProjects?.length) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Aucun projet trouvé dans cette catégorie.
      </motion.div>
    )
  }

  // Utiliser le composant ProjectsView pour le rendu
  return <ProjectsView projects={filteredProjects} category={category} />
}
