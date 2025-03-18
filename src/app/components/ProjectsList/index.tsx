'use client'

import React, { useEffect, useState } from 'react'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsList({ category }: ProjectsListProps) {
  const { sanity } = useServices()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const data = await sanity.fetchProjects(category)
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [category, sanity])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        Chargement...
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        Aucun projet trouvé dans cette catégorie.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {projects.map((project) => (
        <Link
          key={project._id}
          href={`/projects/${category}/${project.slug.current}`}
          className="group"
        >
          <div className="overflow-hidden rounded-md">
            {project.coverImage && (
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={sanity.urlFor(project.coverImage).width(800).url()}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
          </div>
          <h3 className="mt-3 text-2xl font-medium">{project.title}</h3>
          {project.description && (
            <p className="mt-1 text-gray-700 line-clamp-2">
              {project.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
