'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

interface ProjectsTemplateProps {
  projects: string[]
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsTemplate({
  projects,
  category,
}: ProjectsTemplateProps) {
  const { navigateTo } = useTransitionNavigation()

  const handleProjectClick = async (
    e: React.MouseEvent,
    projectSlug: string
  ) => {
    e.preventDefault()
    navigateTo(`/projects/${category}/${projectSlug}`)
  }

  // Animation variants pour Framer Motion
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 100 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, y: -50 },
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <motion.nav
        className="flex flex-wrap gap-8 justify-end"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {projects.map((project) => (
          <motion.div
            key={project}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              onClick={(e) =>
                handleProjectClick(
                  e,
                  project.toLowerCase().replace(/\s+/g, '-')
                )
              }
              className="text-6xl overflow-hidden leading-[1.3] hover:text-gray-500 transition-colors duration-300 font-wide cursor-pointer"
            >
              {project}
            </div>
          </motion.div>
        ))}
      </motion.nav>
    </div>
  )
}
