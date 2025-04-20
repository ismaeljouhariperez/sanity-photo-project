'use client'

import { memo, useEffect, MouseEvent } from 'react'
import { motion, Variants, usePresence } from 'framer-motion'
import { Project } from '@/lib/sanity.types'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import { createStaggerContainer, EASE, DURATIONS } from '@/animations'
import { usePathname } from 'next/navigation'
import { useProjectsStore } from '@/store'

interface ProjectsViewProps {
  projects: Project[]
  category: 'black-and-white' | 'early-color'
  activeSlugs?: string[] // Pour pouvoir mettre en évidence un projet actif
}

/**
 * Interactive list of photography projects with transition animations
 * Handles smooth transitions between list and detail views
 */
const ProjectsView = memo(function ProjectsView({
  projects,
  category,
  activeSlugs = [],
}: ProjectsViewProps) {
  const { navigateWithTransition } = useTransitionNavigation()
  const isDetailPage = activeSlugs.length > 0
  const pathname = usePathname()
  const [isPresent, safeToRemove] = usePresence()
  const comingFromDetailPage =
    isPresent && !isDetailPage && pathname.includes(`/projects/${category}`)
  const previousSlug = useProjectsStore((state) => state.previousSlug)

  // Nettoyage après l'animation
  useEffect(() => {
    if (!isPresent) {
      setTimeout(safeToRemove, 1000)
    }
  }, [isPresent, safeToRemove])

  // Gestionnaire d'événements pour la navigation
  const handleProjectClick = (e: MouseEvent, projectSlug: string) => {
    // Ne pas déclencher la navigation si on est déjà sur ce projet
    if (activeSlugs.includes(projectSlug)) return

    e.preventDefault()
    navigateWithTransition(`/projects/${category}/${projectSlug}`, 0) // Transition immédiate
  }

  /**
   * Configuration des animations selon le contexte de navigation
   */
  const animations = useProjectAnimations({
    isDetailPage,
    comingFromDetailPage,
  })

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <motion.nav
        className="flex flex-wrap gap-8 justify-end"
        variants={animations.container}
        initial="initial"
        animate="animate"
        exit={comingFromDetailPage ? 'initial' : 'exit'}
      >
        {projects.map((project) => {
          const projectSlug = getNormalizedSlug(project)
          const isActive = activeSlugs.includes(projectSlug)
          const wasPreviouslyActive = projectSlug === previousSlug

          return (
            <motion.div
              key={project._id}
              variants={animations.getTitleVariants(
                isActive,
                wasPreviouslyActive && comingFromDetailPage
              )}
              onClick={(e) => handleProjectClick(e, projectSlug)}
              className={`text-6xl overflow-hidden leading-[1.3] hover:text-gray-500 font-wide cursor-pointer transition-colors duration-50 ${
                isActive ? 'text-gray-500' : ''
              }`}
            >
              <motion.div
                variants={animations.getTextVariants(
                  isActive,
                  wasPreviouslyActive && comingFromDetailPage
                )}
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

/**
 * Extrait le slug normalisé d'un projet
 */
function getNormalizedSlug(project: Project): string {
  return project.normalizedSlug || project.slug.current || String(project.slug)
}

/**
 * Manages project animations based on navigation context
 * Controls transitions, timing, and visual effects for project titles
 */
function useProjectAnimations({
  isDetailPage,
  comingFromDetailPage,
}: {
  isDetailPage: boolean
  comingFromDetailPage: boolean
}) {
  const container = createStaggerContainer({
    staggerChildren: comingFromDetailPage ? 0.4 : 0.3,
    delayChildren: comingFromDetailPage ? 0 : 0.3,
  })

  const getTitleVariants = (
    isActive: boolean,
    skipAnimation: boolean
  ): Variants => {
    if (skipAnimation) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
      }
    }

    if (!isDetailPage) {
      return {
        initial: { opacity: 0, y: -30 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: DURATIONS.normal,
            ease: EASE.default,
          },
        },
        exit: { opacity: 0, y: -30 },
      }
    }

    return {
      initial: { y: 0 },
      animate: {
        y: isActive ? 0 : -100,
        transition: {
          duration: DURATIONS.slow,
          ease: EASE.default,
        },
      },
    }
  }

  const getTextVariants = (
    isActive: boolean,
    skipAnimation: boolean
  ): Variants => {
    if (skipAnimation) {
      return {
        initial: { y: 0 },
        animate: { y: 0 },
        exit: { y: 0 },
      }
    }

    if (!isDetailPage) {
      return {
        initial: { y: '-100%' },
        animate: {
          y: 0,
          transition: {
            duration: DURATIONS.slow,
            ease: EASE.default,
          },
        },
        exit: { y: '-100%' },
      }
    }

    return {
      initial: { y: 0 },
      animate: {
        y: isActive ? 0 : -100,
        transition: {
          duration: DURATIONS.slow,
          ease: EASE.default,
        },
      },
    }
  }

  return {
    container,
    getTitleVariants,
    getTextVariants,
  }
}

export default ProjectsView
