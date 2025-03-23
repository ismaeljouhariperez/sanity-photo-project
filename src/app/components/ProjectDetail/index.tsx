'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import Link from 'next/link'
import DelayedLoader from '@/components/ui/DelayedLoader'
import ProjectsView from '../ProjectsView'

interface ProjectDetailProps {
  slug: string
  category: 'black-and-white' | 'early-color'
}

export default function ProjectDetail({ slug, category }: ProjectDetailProps) {
  const { sanity } = useServices()
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)
  const controllerRef = useRef<AbortController | null>(null)

  // Mémoriser le slug actif pour éviter des re-rendus inutiles
  const activeSlugs = useMemo(() => [slug], [slug])

  // Un seul effet pour récupérer tous les projets
  useEffect(() => {
    // Éviter les appels multiples avec une référence
    if (hasFetched.current) return

    // Pour les annulations propres
    controllerRef.current = new AbortController()

    // Fonction pour récupérer les projets
    async function fetchAllProjects() {
      try {
        setLoading(true)

        // Si on a un signal d'annulation, l'utiliser
        if (controllerRef.current?.signal?.aborted) {
          return
        }

        const data = await sanity.fetchProjects(category)

        // Vérifier si le composant est toujours monté
        if (controllerRef.current?.signal?.aborted) {
          return
        }

        // Traitement des données
        const processedData =
          data?.map((project) => ({
            ...project,
            normalizedSlug: project.slug.current || String(project.slug),
          })) || []

        setAllProjects(processedData)
      } catch (error) {
        // Ne loguer l'erreur que si le composant est toujours monté
        if (!controllerRef.current?.signal?.aborted) {
          console.error('Error fetching projects:', error)
        }
      } finally {
        // Ne mettre à jour le state que si le composant est toujours monté
        if (!controllerRef.current?.signal?.aborted) {
          setLoading(false)
        }
      }
    }

    // Lancer la récupération une seule fois
    hasFetched.current = true
    fetchAllProjects()

    // Nettoyage propre
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort()
        controllerRef.current = null
      }
    }
  }, [category, sanity])

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <DelayedLoader isLoading={true} message="Chargement du projet..." />
      </div>
    )
  }

  // Si pas de projets trouvés
  if (!allProjects.length) {
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
      projects={allProjects}
      category={category}
      activeSlugs={activeSlugs}
      disableAnimations={true}
    />
  )
}
