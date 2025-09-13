'use client'

import { useEffect, useState } from 'react'
import { getProjectBySlug } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import ParallaxGallery from './ParallaxGallery'

interface ProjectPhotosGridProps {
  projectSlug: string
  category: 'black-and-white' | 'early-color'
}

export default function ProjectPhotosGrid({
  projectSlug,
  category,
}: ProjectPhotosGridProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      try {
        const projectData = await getProjectBySlug(projectSlug, category)
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectSlug, category])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!project || !project.images || project.images.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Aucune photo à afficher</div>
      </div>
    )
  }

  return (
    <section className="overflow-x-hidden">
      {/* Section 1: Parallax Hero */}
      {/* <ParallaxProjectHero project={project} /> */}

      {/* Section 2: Parallax Gallery */}
      <ParallaxGallery project={project} />
    </section>
  )
}
