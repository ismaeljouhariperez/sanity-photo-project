'use client'
import React from 'react'
import AnimatedElement, { AnimationType } from '../AnimatedElement'
import { useAnimationStore } from '@/store/animationStore'
import { useRouter } from 'next/navigation'

interface ProjectsTemplateProps {
  projects: string[]
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsTemplate({
  projects,
  category,
}: ProjectsTemplateProps) {
  const router = useRouter()
  const { setLeavingPage } = useAnimationStore()

  const handleProjectClick = (e: React.MouseEvent, projectSlug: string) => {
    e.preventDefault()

    // Activer l'animation de sortie
    setLeavingPage(true)

    // Attendre que l'animation se termine avant de naviguer
    setTimeout(() => {
      setLeavingPage(false)
      router.push(`/projects/${category}/${projectSlug}`)
    }, 600)
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <nav className="flex flex-wrap gap-8 justify-end">
        {projects.map((project, index) => (
          <AnimatedElement
            key={project}
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
                  project.toLowerCase().replace(/\s+/g, '-')
                )
              }
              className="text-6xl hover:text-gray-500 transition-colors duration-300 font-wide cursor-pointer"
              data-barba-trigger
            >
              {project}
            </div>
          </AnimatedElement>
        ))}
      </nav>
    </div>
  )
}
