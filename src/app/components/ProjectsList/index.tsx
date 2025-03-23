'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsList({ category }: ProjectsListProps) {
  const { sanity } = useServices()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchRef = useRef(false)

  // Fetch des données une seule fois
  useEffect(() => {
    // Éviter les fetch multiples
    if (fetchRef.current) return
    fetchRef.current = true

    // Simple fonction pour récupérer les projets
    async function getProjects() {
      try {
        setLoading(true)
        setError(null)

        const data = await sanity.fetchProjects(category)

        // Traitement des données
        const processedData =
          data?.map((project) => ({
            ...project,
            normalizedSlug: project.slug.current || String(project.slug),
          })) || []

        setProjects(processedData)
      } catch (err) {
        console.error(`Erreur fetch:`, err)
        setError('Une erreur est survenue lors du chargement des projets.')
      } finally {
        setLoading(false)
      }
    }

    // Lancer la récupération une seule fois
    getProjects()
  }, [category, sanity])

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-red-500">
        {error}
      </div>
    )
  }

  // Afficher un écran de chargement pendant le chargement initial
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <DelayedLoader
          isLoading={loading}
          message="Chargement des projets..."
        />
      </div>
    )
  }

  // Attendre que le chargement soit terminé avant d'afficher "Aucun projet trouvé"
  if (!projects?.length) {
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
  return <ProjectsView projects={projects} category={category} />
}
