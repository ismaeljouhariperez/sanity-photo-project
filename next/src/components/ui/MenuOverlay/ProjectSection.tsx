'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

interface Project {
  _id: string
  title: string
  slug: { current: string } | string
  imageCount: number
}

interface ProjectSectionProps {
  title: string
  projects: Project[]
  category: string
  itemVariants: Variants
  listVariants: Variants
  countVariants: Variants
  onClose: () => void
}

export default function ProjectSection({
  title,
  projects,
  category,
  itemVariants,
  listVariants,
  countVariants,
  onClose,
}: ProjectSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const { navigateToProject, navigateToCategory } = useTransitionNavigation({ 
    onClose 
  })

  const handleProjectClick = (slug: string) => {
    navigateToProject(category, slug)
  }

  const handleCategoryClick = () => {
    navigateToCategory(category)
  }

  return (
    <div className="p-8">
      <motion.h3
        variants={itemVariants}
        className="mb-8 cursor-pointer place-self-start text-gray-900"
        onClick={handleCategoryClick}
      >
        {title}
      </motion.h3>
      <motion.div variants={listVariants} className="space-y-4">
        {projects.map((project: Project) => {
          const slug =
            typeof project.slug === 'string'
              ? project.slug
              : project.slug?.current
          return (
            <motion.div
              key={project._id}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setHoveredProject(project._id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <button
                onClick={() => handleProjectClick(slug)}
                className="text-left text-xl transition-colors duration-200 hover:text-gray-600 active:text-gray-500 touch-manipulation min-h-touch"
              >
                {project.title}
              </button>

              <AnimatePresence>
                {hoveredProject === project._id && (
                  <motion.span
                    variants={countVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute left-full top-0 ml-4 text-sm text-gray-500"
                  >
                    {project.imageCount || 0}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
