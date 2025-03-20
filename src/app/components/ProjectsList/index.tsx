'use client'

import React, { useEffect, useState } from 'react'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import AnimatedElement, { AnimationType } from '../AnimatedElement'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsList({ category }: ProjectsListProps) {
  const { sanity, navigation, animation } = useServices()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)
        const data = await sanity.fetchProjects(category)
        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(
          'Erreur lors de la récupération des projets. Veuillez réessayer.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [category, sanity])

  const handleProjectClick = async (
    e: React.MouseEvent,
    projectSlug: string
  ) => {
    e.preventDefault()

    // Utilisation des adapters pour l'animation et la navigation
    animation.setPageTransition(true)

    setTimeout(async () => {
      animation.setPageTransition(false)
      await navigation.navigateTo(`/projects/${category}/${projectSlug}`)
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
          <AnimatedElement
            key={project._id}
            delay={index * 0.1}
            type={AnimationType.SLIDE_UP}
            playExitAnimation={true}
            entrancePatterns={['/projects']}
            exitPatterns={['/projects']}
            playOnceOnly={false}
            customParams={{
              fromY: -50,
              toY: 0,
              duration: 0.8,
              ease: 'power3.out',
            }}
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
          </AnimatedElement>
        ))}
      </nav>
    </div>
  )
}
