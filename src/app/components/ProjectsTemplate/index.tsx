'use client'
import React from 'react'
import AnimatedTitle from '../AnimatedTitle'
import barba from '@barba/core'

interface ProjectsTemplateProps {
  projects: string[]
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsTemplate({
  projects,
  category,
}: ProjectsTemplateProps) {
  const handleProjectClick = (e: React.MouseEvent, projectSlug: string) => {
    e.preventDefault()
    barba.go(`/projects/${category}/${projectSlug}`)
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <nav className="flex flex-wrap gap-8 justify-end">
        {projects.map((project, index) => (
          <AnimatedTitle key={project} delay={index * 0.1}>
            <div
              onClick={(e) =>
                handleProjectClick(
                  e,
                  project.toLowerCase().replace(/\s+/g, '-')
                )
              }
              className="text-6xl hover:text-gray-500 transition-colors duration-300 font-wide cursor-pointer"
              data-barba-trigger
            >
              {project}
            </div>
          </AnimatedTitle>
        ))}
      </nav>
    </div>
  )
}
