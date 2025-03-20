'use client'
import React from 'react'
import { SlideUp } from '@/lib/animations'
import { useServices } from '@/hooks'

interface ProjectsTemplateProps {
  projects: string[]
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsTemplate({
  projects,
  category,
}: ProjectsTemplateProps) {
  const { animation, navigation } = useServices()

  const handleProjectClick = async (
    e: React.MouseEvent,
    projectSlug: string
  ) => {
    e.preventDefault()

    // Utilisation des services au lieu des adaptateurs directs
    animation.setPageTransition(true)

    setTimeout(async () => {
      animation.setPageTransition(false)
      await navigation.navigateTo(`/projects/${category}/${projectSlug}`)
    }, 600)
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <nav className="flex flex-wrap gap-8 justify-end">
        {projects.map((project, index) => (
          <SlideUp
            key={project}
            delay={index * 0.1}
            playExitAnimation={true}
            entrancePatterns={['/projects']}
            exitPatterns={['/projects']}
            playOnceOnly={false}
            distance={100}
          >
            <div
              onClick={(e) =>
                handleProjectClick(
                  e,
                  project.toLowerCase().replace(/\s+/g, '-')
                )
              }
              className="text-6xl leading-[1.3] hover:text-gray-500 transition-colors duration-300 font-wide cursor-pointer"
              data-barba-trigger
            >
              {project}
            </div>
          </SlideUp>
        ))}
      </nav>
    </div>
  )
}
