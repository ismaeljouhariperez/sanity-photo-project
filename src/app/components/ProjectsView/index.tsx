'use client'

import React, { memo } from 'react'
import { motion, Variants } from 'framer-motion'
import { Project } from '@/lib/sanity.types'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

interface ProjectsViewProps {
  projects: Project[]
  category: 'black-and-white' | 'early-color'
  activeSlugs?: string[] // Pour pouvoir mettre en évidence un projet actif
}

// Utilisation de React.memo pour éviter les re-rendus inutiles
const ProjectsView = memo(function ProjectsView({
  projects,
  category,
  activeSlugs = [],
}: ProjectsViewProps) {
  const { navigateTo } = useTransitionNavigation()

  // Gestionnaire d'événements pour la navigation
  const handleProjectClick = (e: React.MouseEvent, projectSlug: string) => {
    // Ne pas déclencher la navigation si on est déjà sur ce projet
    if (activeSlugs.includes(projectSlug)) return

    e.preventDefault()
    navigateTo(`/projects/${category}/${projectSlug}`, { delay: 0 }) // Transition immédiate
  }

  // Animation uniquement pour la page de détail
  const isDetailPage = activeSlugs.length > 0

  // Variants pour l'animation du conteneur
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  // Animation pour les conteneurs de titre
  const getTitleContainerVariants = (isActive: boolean): Variants => {
    // Sur la page de liste, le conteneur n'a pas d'animation
    if (!isDetailPage) {
      return {
        initial: {},
        animate: {},
      }
    }

    // Sur la page de détail
    return {
      initial: { y: 0 },
      animate: {
        y: isActive ? 0 : -100,
        transition: {
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }
  }

  // Animation du texte
  const getTextVariants = (isActive: boolean): Variants | undefined => {
    // Sur la page de liste
    if (!isDetailPage) {
      return {
        initial: { y: '100%' },
        animate: {
          y: 0,
          transition: {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }
    }

    // Sur la page de détail
    return {
      initial: { y: 0 },
      animate: {
        y: isActive ? 0 : -100,
        transition: {
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <motion.nav
        className="flex flex-wrap gap-8 justify-end"
        variants={containerVariants}
        initial="initial"
        animate="animate"
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
              variants={getTitleContainerVariants(isActive)}
              onClick={(e) => handleProjectClick(e, projectSlug)}
              className={`text-6xl overflow-hidden leading-[1.3] hover:text-gray-500 font-wide cursor-pointer transition-colors duration-50 ${
                isActive ? 'text-gray-500' : ''
              }`}
            >
              <motion.div variants={getTextVariants(isActive)}>
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
