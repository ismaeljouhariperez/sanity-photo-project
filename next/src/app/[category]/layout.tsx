'use client'

import { useEffect, useState, startTransition, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { getProjects, urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { isValidCategory } from '@/lib/constants'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import CloudinaryImage from '@/components/ui/media/CloudinaryImage'

/**
 * Single layout component that handles both list and detail views
 * This ensures true component persistence by never unmounting
 */
export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🏗️ [CategoryLayout] Component mounting')

  const pathname = usePathname()
  const router = useRouter()

  // Extract category from pathname
  const segments = pathname.split('/').filter(Boolean)
  const category = segments[0]

  const [hasEntered, setHasEntered] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [isExiting, setIsExiting] = useState(false) // For fade out animation
  const [clickedProjectId, setClickedProjectId] = useState<string | null>(null) // Track which project was clicked
  const [isSecondStage, setIsSecondStage] = useState(false) // For second stage animation

  const [displayedProjectId, setDisplayedProjectId] = useState<string | null>(
    null
  )

  const [projects, setProjects] = useState<Project[]>([])

  // Veiling effect setup
  const { shouldDisableParallax } = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Veil mask that slides down to cover the image when scrolling
  const veilY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1], // Start veiling at 20% scroll, complete by 60%
    shouldDisableParallax
      ? ['-100%', '-100%', '-100%', '-100%']
      : ['-100%', '-100%', '0%', '100%'] // Slide from above to below
  )

  useEffect(() => {
    return () => {
      console.log('💀 [CategoryLayout] Component unmounting')
    }
  }, [])

  // Load projects for current category
  useEffect(() => {
    if (!category || !isValidCategory(category)) return

    const loadProjects = async () => {
      try {
        const categoryProjects = await getProjects(category)
        setProjects(categoryProjects)
        console.log(
          '✅ [Projects] Loaded:',
          categoryProjects.length,
          'for',
          category
        )
      } catch (error) {
        console.error('❌ [Projects] Error:', error)
      } finally {
        // Trigger entrance animation after data loads
        setTimeout(() => setHasEntered(true), 100)
      }
    }

    loadProjects()
  }, [category, setHasEntered])

  // Update displayed project when hovering, clear when not hovering
  useEffect(() => {
    if (hoveredProject) {
      setDisplayedProjectId(hoveredProject)
    } else {
      setDisplayedProjectId(null)
    }
  }, [hoveredProject])

  if (!category || !isValidCategory(category)) {
    return <div>Invalid category</div>
  }

  // Show hovered project
  const displayedProjectData = displayedProjectId
    ? projects.find((p) => p._id === displayedProjectId)
    : null

  // Get the image to display - use featuredImage or coverImage
  const getDisplayedImage = () => {
    return displayedProjectData?.featuredImage || displayedProjectData?.coverImage
  }

  const displayedImage = getDisplayedImage()

  // Category-specific default images
  const getDefaultImageProps = () => {
    if (category === 'black-and-white') {
      return {
        src: 'projects-bw.jpg',
        alt: 'Projets Noir et Blanc',
        fallbackSrc: '/images/bw-cover.jpg',
      }
    } else {
      return {
        src: 'projects-color.jpg',
        alt: 'Projets Couleur',
        fallbackSrc: '/images/color-cover.jpg',
      }
    }
  }

  // Two-stage animation with fade out
  const handleProjectClick = (project: Project) => {
    if (isExiting) return // Prevent multiple clicks during animation

    const projectSlug = project.slug?.current || project.slug
    setIsExiting(true)
    setClickedProjectId(project._id) // Track which project was clicked

    // Stage 1: Other titles fade out (600ms)
    setTimeout(() => {
      // Stage 2: Start second stage - remaining title and image fade out
      setIsSecondStage(true)
      
      // Stage 3: Navigate after second stage completes (800ms)
      setTimeout(() => {
        // Check if View Transitions API is supported
        if ('startViewTransition' in document) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(document as any).startViewTransition(() => {
            startTransition(() => {
              router.push(`/project/${category}/${projectSlug}`)
            })
          })
        } else {
          // Fallback for browsers without View Transitions
          router.push(`/project/${category}/${projectSlug}`)
        }
      }, 800) // Second stage duration
    }, 600) // First stage duration
  }

  return (
    <>
      {/* Show layout for both list and detail views */}
      <main
        ref={containerRef}
        className="container mx-auto flex h-[85vh] flex-1 items-center relative"
      >
        <motion.div 
          ref={imageContainerRef} 
          className="relative w-1/3 overflow-hidden"
          animate={{ 
            opacity: isSecondStage ? 0 : 1,
            scale: isSecondStage ? 0.95 : 1 
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {displayedImage ? (
              <motion.img
                key={displayedProjectData?._id || 'project-image'}
                src={urlFor(displayedImage)
                  .width(1000)
                  .height(1000)
                  .url()}
                alt={`${displayedProjectData?.title || 'Project'} - Image`}
                width={1000}
                height={1200}
                className="h-full w-full object-cover layout-image"
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
                  {...getDefaultImageProps()}
                  width={1000}
                  height={1200}
                  className="h-full w-full object-cover layout-image"
                  folder="projects"
                  priority={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Veil that slides down to cover image when scrolling */}
          <motion.div
            style={{ y: veilY }}
            className="bg-cream absolute inset-0 z-10"
          />
        </motion.div>

        <nav 
          ref={textContainerRef} 
          className="flex w-2/3 flex-wrap justify-end gap-8 px-8"
        >
          {projects.map((project, index) => {
            const isClickedProject = clickedProjectId === project._id
            const shouldFadeOut = isExiting && !isClickedProject

            return (
              <motion.div
                key={project._id}
                className="cursor-pointer overflow-hidden text-6xl leading-[1.3] hover:text-gray-500"
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => handleProjectClick(project)}
                animate={{
                  opacity: shouldFadeOut || (isSecondStage && isClickedProject) ? 0 : 1,
                  y: shouldFadeOut ? -10 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.h2
                  className="overflow-hidden"
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
              </motion.div>
            )
          })}
        </nav>
      </main>

      {/* Category content rendered by page component */}
      <div>{children}</div>
    </>
  )
}
