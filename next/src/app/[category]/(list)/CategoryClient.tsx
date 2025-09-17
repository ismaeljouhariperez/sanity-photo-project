'use client'

import {
  useState,
  useEffect,
  startTransition,
  useRef,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import CloudinaryImage from '@/components/ui/media/CloudinaryImage'
import ProjectLink from '@/components/ui/ProjectLink'

interface CategoryClientProps {
  category: string
  projects: Project[]
  defaultImages: {
    src: string
    alt: string
    fallbackSrc: string
  }
}

export default function CategoryClient({
  category,
  projects,
  defaultImages,
}: CategoryClientProps) {
  const router = useRouter()

  const [hasEntered, setHasEntered] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [clickedProjectId, setClickedProjectId] = useState<string | null>(null)
  const [isSecondStage, setIsSecondStage] = useState(false)
  const [displayedProjectId, setDisplayedProjectId] = useState<string | null>(
    null
  )

  // Refs and animation setup
  const { shouldDisableParallax } = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const veilY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    shouldDisableParallax
      ? ['-100%', '-100%', '-100%', '-100%']
      : ['-100%', '-100%', '0%', '100%']
  )

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Update displayed project when hovering
  useEffect(() => {
    if (hoveredProject) {
      setDisplayedProjectId(hoveredProject)
    } else {
      setDisplayedProjectId(null)
    }
  }, [hoveredProject])

  // Get displayed project data
  const displayedProjectData = displayedProjectId
    ? projects.find((p) => p._id === displayedProjectId)
    : null

  const displayedImage =
    displayedProjectData?.featuredImage || displayedProjectData?.coverImage

  // Two-stage animation with navigation
  const handleProjectClick = useCallback(
    (project: Project) => {
      if (isExiting) return

      const projectSlug = project.slug?.current || project.slug
      setIsExiting(true)
      setClickedProjectId(project._id)

      // Stage 1: Other titles fade out (600ms)
      setTimeout(() => {
        setIsSecondStage(true)

        // Stage 2: Navigate after second stage (800ms)
        setTimeout(() => {
          if ('startViewTransition' in document) {
            ;(
              document as Document & {
                startViewTransition?: (callback: () => void) => void
              }
            ).startViewTransition!(() => {
              startTransition(() => {
                router.push(`/${category}/${projectSlug}`)
              })
            })
          } else {
            router.push(`/${category}/${projectSlug}`)
          }
        }, 800)
      }, 600)
    },
    [isExiting, category, router]
  )

  return (
    <>
      <main
        ref={containerRef}
        className="container relative mx-auto flex h-[90vh] flex-1 items-center px-4 md:h-[85vh] md:px-0"
      >
        <motion.div
          ref={imageContainerRef}
          className="relative hidden overflow-hidden md:block md:w-1/3"
          animate={{
            opacity: isSecondStage ? 0 : 1,
            scale: isSecondStage ? 0.95 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {displayedImage ? (
              <motion.img
                key={displayedProjectData?._id || 'project-image'}
                src={urlFor(displayedImage).width(1000).height(1000).url()}
                alt={`${displayedProjectData?.title || 'Project'} - Image`}
                width={1000}
                height={1200}
                className="layout-image h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            ) : (
              <motion.div
                key="default"
                className="h-full w-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CloudinaryImage
                  {...defaultImages}
                  width={1000}
                  height={1200}
                  className="layout-image h-full w-full object-cover"
                  folder="projects"
                  priority={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            style={{ y: veilY }}
            className="bg-cream absolute inset-0 z-10"
          />
        </motion.div>

        <nav
          ref={textContainerRef}
          className="flex w-full flex-wrap justify-center gap-6 md:w-2/3 md:justify-end md:gap-8 md:px-16"
        >
          {projects.map((project, index) => {
            const isClickedProject = clickedProjectId === project._id
            const shouldFadeOut = isExiting && !isClickedProject

            return (
              <motion.div
                key={project._id}
                className="max-w-[280px] overflow-hidden text-center text-3xl md:max-w-none md:text-left lg:text-5xl"
                animate={{
                  opacity:
                    shouldFadeOut || (isSecondStage && isClickedProject)
                      ? 0
                      : 1,
                  y: shouldFadeOut ? -10 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectLink
                  href={`/${category}/${project.slug?.current || project.slug}`}
                  className="cursor-pointer touch-manipulation transition-colors hover:text-gray-500 active:text-gray-400"
                  onMouseEnter={() => setHoveredProject(project._id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => handleProjectClick(project)}
                >
                  <motion.h2
                    className="overflow-hidden leading-[1.4]"
                    initial={{ y: '-100%' }}
                    animate={{
                      y: hasEntered ? '0%' : '-100%',
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1] as const,
                      delay: 0.15 * index,
                    }}
                  >
                    {project.title}
                  </motion.h2>
                </ProjectLink>
              </motion.div>
            )
          })}
        </nav>
      </main>
    </>
  )
}
