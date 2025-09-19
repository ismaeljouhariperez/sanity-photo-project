'use client'

import { motion, Variants } from 'framer-motion'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import type { Project } from '@/lib/sanity.types'

interface ProjectSectionProps {
  title: string
  projects: Project[]
  category: string
  itemVariants: Variants
  listVariants: Variants
  onClose: () => void
}

export default function ProjectSection({
  title,
  projects,
  category,
  itemVariants,
  listVariants,
  onClose,
}: ProjectSectionProps) {
  const { navigateToProject, navigateToCategory } = useTransitionNavigation({
    onClose,
  })

  const handleProjectClick = (slug: string) => {
    navigateToProject(category, slug)
  }

  const handleCategoryClick = () => {
    navigateToCategory(category)
  }

  return (
    <div className="pt-8 md:py-8">
      <motion.h3
        variants={itemVariants}
        className="min-h-touch min-w-touch flex cursor-pointer touch-manipulation items-center place-self-start text-lg text-gray-900 md:mb-8 md:text-xl"
        onClick={handleCategoryClick}
      >
        {title}
      </motion.h3>
      <motion.div variants={listVariants} className="md:space-y-4">
        {projects.map((project: Project) => {
          const slug =
            typeof project.slug === 'string'
              ? project.slug
              : project.slug?.current
          return (
            <motion.div
              key={project._id}
              variants={itemVariants}
              className="group relative"
            >
              <button
                onClick={() => handleProjectClick(slug)}
                className="min-h-touch min-w-touch flex w-full touch-manipulation items-center justify-between text-left text-lg transition-colors duration-200 hover:text-gray-600 active:text-gray-500 md:text-xl"
              >
                <span>{project.title}</span>
                {/* Show count on mobile always, on desktop only on hover */}
                <span className="text-sm text-gray-500 transition-opacity duration-500 group-hover:opacity-100 md:opacity-0">
                  {project.imageCount || 0}
                </span>
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
