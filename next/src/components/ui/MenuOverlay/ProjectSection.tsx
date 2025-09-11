'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTransitionStore } from '@/store/transitionStore'

interface Project {
  _id: string
  title: string
  slug: { current: string } | string
  images?: Array<{ _key: string; asset: { _ref: string } }>
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
  const router = useRouter()
  const { setTransition } = useTransitionStore()

  const handleProjectClick = (slug: string) => {
    // Set exiting transition state
    setTransition(true, 'exiting')
    
    // Start menu close animation first
    onClose()
    
    // Small delay to let menu and header animations start before navigation
    setTimeout(() => {
      router.push(`/${category}/${slug}`)
    }, 300)
  }

  return (
    <div className="p-8">
      <motion.h3 variants={itemVariants} className="mb-8 text-gray-900">
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
                className="text-left text-lg transition-colors duration-200 hover:text-gray-600"
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
                    {project.images?.length || 0}
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
