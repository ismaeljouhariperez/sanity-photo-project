'use client'

import React, { memo } from 'react'
import { motion, Variants } from 'framer-motion'
import { Project } from '@/lib/sanity.types'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

interface ProjectsViewProps {
  projects: Project[]
  category: 'black-and-white' | 'early-color'
  activeSlugs?: string[] // Pour pouvoir mettre en évidence un projet actif
  disableAnimations?: boolean // Option pour désactiver les animations
}

// Utilisation de React.memo pour éviter les re-rendus inutiles
const ProjectsView = memo(function ProjectsView({
  projects,
  category,
  activeSlugs = [],
  disableAnimations = false,
}: ProjectsViewProps) {
  const { navigateTo } = useTransitionNavigation()

  // Gestionnaire d'événements pour la navigation
  const handleProjectClick = (e: React.MouseEvent, projectSlug: string) => {
    // Ne pas déclencher la navigation si on est déjà sur ce projet
    if (activeSlugs.includes(projectSlug)) return

    e.preventDefault()
    navigateTo(`/projects/${category}/${projectSlug}`, { delay: 0 }) // Transition immédiate
  }

  // Variants pour l'animation
  const containerVariants: Variants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 }, // Éviter le fade-out pour une transition plus fluide
  }

  // Simplifier les variants pour éviter les animations qui peuvent causer des scintillements
  const itemVariants: Variants = disableAnimations
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.5 },
        },
      }

  const textVariants: Variants = disableAnimations
    ? { initial: {}, animate: {} }
    : {
        initial: { y: '100%' },
        animate: {
          y: 0,
          transition: {
            duration: 1.5,
            staggerChildren: 0.3,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <motion.nav
        className="flex flex-wrap gap-8 justify-end"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        layoutId="projects-container"
        layout
        // Supprimer exit pour éviter de créer un effet visuel lors des transitions
      >
        {projects.map((project) => {
          const projectSlug =
            project.normalizedSlug ||
            project.slug.current ||
            String(project.slug)
          const isActive = activeSlugs.includes(projectSlug)

          return (
            <motion.div
              key={project._id}
              variants={itemVariants}
              onClick={(e) => handleProjectClick(e, projectSlug)}
              className={`text-6xl overflow-hidden leading-[1.3] hover:text-gray-500 font-wide cursor-pointer transition-colors duration-50 ${
                isActive ? 'text-gray-500' : ''
              }`}
              layoutId={`project-title-${projectSlug}`}
              layout="position"
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                  duration: 0.1,
                },
              }}
            >
              <motion.div
                variants={textVariants}
                layoutId={`project-text-${projectSlug}`}
              >
                {project.title}
              </motion.div>
            </motion.div>
          )
        })}
      </motion.nav>
    </div>
  )
})

export default ProjectsView
