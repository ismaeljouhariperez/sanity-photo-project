'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getProjectBySlug, urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'

interface ProjectPhotosGridProps {
  projectSlug: string
  category: string
  animationDelay?: number
}

export default function ProjectPhotosGrid({
  projectSlug,
  category,
  animationDelay = 0,
}: ProjectPhotosGridProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      try {
        const projectData = await getProjectBySlug(projectSlug, category)
        console.log(projectData)
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setIsLoading(false)
        setTimeout(() => setShouldAnimate(true), 10)
      }
    }

    fetchProject()
  }, [projectSlug, category])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!project || !project.images || project.images.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Aucune photo à afficher</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto grid grid-cols-2 gap-16 pb-16">
      {!isLoading &&
        project.images.map((projectImage, index) => (
          <motion.div
            key={projectImage._key || index}
            className="group relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: shouldAnimate ? 1 : 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              delay: shouldAnimate ? animationDelay + index * 0.15 : 0,
            }}
          >
            <Image
              src={urlFor(projectImage.image)
                .width(800)
                .height(600)
                .quality(85)
                .url()}
              alt={projectImage.title || `Image ${index + 1}`}
              width={800}
              height={600}
              className="h-auto w-full object-cover"
              loading="lazy"
            />
            {projectImage.description && (
              <div className="mt-2 text-sm text-gray-600">
                {projectImage.description}
              </div>
            )}
          </motion.div>
        ))}
    </div>
  )
}
