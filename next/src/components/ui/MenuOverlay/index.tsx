'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getProjects } from '@/lib/sanity'

interface Project {
  _id: string
  title: string
  slug: { current: string } | string
  images?: Array<any>
}

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

function MenuContentWithData({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<{
    blackAndWhite: Project[]
    earlyColor: Project[]
  }>({ blackAndWhite: [], earlyColor: [] })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isOpen) return

    const fetchProjects = async () => {
      try {
        const [blackAndWhiteProjects, earlyColorProjects] = await Promise.all([
          getProjects('black-and-white'),
          getProjects('early-color'),
        ])
        setProjects({
          blackAndWhite: blackAndWhiteProjects,
          earlyColor: earlyColorProjects,
        })
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [isOpen])

  const handleProjectClick = (category: string, slug: string) => {
    router.push(`/${category}/${slug}`)
    onClose()
  }

  // Animation variants
  const overlayVariants = {
    hidden: {
      y: '-100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300,
        duration: 0.6,
      },
    },
    exit: {
      y: '-100%',
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const,
      },
    },
  }

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    },
  }

  const countVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  }

  if (isLoading) {
    return (
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-cream fixed inset-0 z-40 flex items-center justify-center"
      >
        <div className="text-gray-500">Loading...</div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-cream fixed inset-0 z-40"
      style={{ paddingTop: 'var(--header-height)' }}
    >
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="container mx-auto h-full px-8 py-12"
      >
        <div className="grid h-full grid-cols-2 gap-16">
          {/* Black and White Projects */}
          <div>
            <motion.h3
              variants={itemVariants}
              className="mb-8 text-2xl font-light text-gray-900"
            >
              Black and White Projects
            </motion.h3>
            <motion.div variants={listVariants} className="space-y-4">
              {projects.blackAndWhite.map((project: Project) => {
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
                      onClick={() =>
                        handleProjectClick('black-and-white', slug)
                      }
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

          {/* Early Color Projects */}
          <div>
            <motion.h3
              variants={itemVariants}
              className="mb-8 text-2xl font-light text-gray-900"
            >
              Early Color Projects
            </motion.h3>
            <motion.div variants={listVariants} className="space-y-4">
              {projects.earlyColor.map((project: Project) => {
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
                      onClick={() => handleProjectClick('early-color', slug)}
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
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && <MenuContentWithData isOpen={isOpen} onClose={onClose} />}
    </AnimatePresence>
  )
}
