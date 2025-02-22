'use client'
import React from 'react'
import Link from 'next/link'
import AnimatedTitle from '../AnimatedTitle'

interface ProjectsTemplateProps {
  projects: string[]
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsTemplate({
  projects,
  category,
}: ProjectsTemplateProps) {
  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <nav className="flex flex-wrap gap-8 justify-end">
        {projects.map((project, index) => (
          <AnimatedTitle key={project} delay={index * 0.1}>
            <Link
              href={`/projects/${category}/${project
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
              className="text-6xl hover:text-gray-500 transition-colors duration-300 font-wide"
            >
              {project}
            </Link>
          </AnimatedTitle>
        ))}
      </nav>
    </div>
  )
}
