'use client'
import React from 'react'
import Link from 'next/link'

interface ProjectsTemplateProps {
  projects: string[]
  category: 'noir-et-blanc' | 'couleur'
}

export default function ProjectsTemplate({
  projects,
  category,
}: ProjectsTemplateProps) {
  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex flex-col justify-center items-end px-16">
      <nav className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="text-right">
            <Link
              href={`/projects/${category}/${project
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
              className="text-3xl hover:text-gray-500 transition-colors duration-300"
            >
              {project}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  )
}
