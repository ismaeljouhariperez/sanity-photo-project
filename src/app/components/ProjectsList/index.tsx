'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import { SlideUp } from '@/lib/animations'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsList({ category }: ProjectsListProps) {
  const { sanity, navigation, animation } = useServices()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchInProgress = useRef(false)
  const mounted = useRef(true)

  useEffect(() => {
    console.log(`📡 ProjectsList monté - category: ${category}`)

    // Réinitialiser le ref à true au montage
    mounted.current = true

    // Créer un controller pour pouvoir annuler la requête
    const controller = new AbortController()

    async function fetchProjects() {
      // Éviter de déclencher plusieurs requêtes simultanées
      if (fetchInProgress.current) {
        console.log(`⏸️ Fetch déjà en cours pour ${category} - ignoré`)
        return
      }

      fetchInProgress.current = true
      console.log(`🔄 Début du fetch des projets - category: ${category}`)

      try {
        setLoading(true)
        setError(null)

        const data = await sanity.fetchProjects(category)

        if (mounted.current) {
          console.log(
            `✅ Projets récupérés - category: ${category} - count:`,
            data?.length || 0
          )
          setProjects(data)
        } else {
          console.log(
            `⚠️ Composant démonté avant fin du fetch - category: ${category}`
          )
        }
      } catch (err) {
        if (mounted.current) {
          console.error(`❌ Erreur fetch - category: ${category}:`, err)
          setError(
            'Erreur lors de la récupération des projets. Veuillez réessayer.'
          )
        }
      } finally {
        if (mounted.current) {
          console.log(`🏁 Fin du fetch - category: ${category}`)
          setLoading(false)
        }
        fetchInProgress.current = false
      }
    }

    // Démarrer le fetch seulement si le composant est monté
    if (mounted.current) {
      fetchProjects()
    }

    // Nettoyage lors du démontage
    return () => {
      console.log(`🗑️ ProjectsList démonté - category: ${category}`)
      mounted.current = false
      controller.abort()

      // Force reset de l'état du fetch
      fetchInProgress.current = false
    }
  }, [category, sanity])

  const handleProjectClick = (e: React.MouseEvent, projectSlug: string) => {
    e.preventDefault()

    // Utilisation des adapters pour l'animation et la navigation
    animation.setPageTransition(true)

    setTimeout(() => {
      animation.setPageTransition(false)
      navigation.navigateTo(`/projects/${category}/${projectSlug}`)
    }, 600)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        Chargement...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-red-500">
        {error}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        Aucun projet trouvé dans cette catégorie.
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <nav className="flex flex-wrap gap-8 justify-end">
        {projects.map((project, index) => (
          <SlideUp
            key={project._id}
            delay={index * 0.1}
            playExitAnimation={true}
            entrancePatterns={['/projects']}
            exitPatterns={['/projects']}
            playOnceOnly={false}
            distance={50}
          >
            <div
              onClick={(e) =>
                handleProjectClick(
                  e,
                  project.slug.current || String(project.slug)
                )
              }
              className="text-6xl hover:text-gray-500 transition-colors duration-300 font-wide cursor-pointer"
            >
              {project.title}
            </div>
          </SlideUp>
        ))}
      </nav>
    </div>
  )
}
