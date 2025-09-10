'use client'

import { useEffect, useState, startTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { isValidCategory } from '@/lib/constants'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

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

  // Extract category and slug from pathname
  const segments = pathname.split('/').filter(Boolean)
  const category = segments[0]
  const currentSlug = segments[1] // Will be undefined on category page, defined on project page
  const isDetailPage = Boolean(currentSlug)

  // Initialize hasEntered as true if we're already on a detail page
  const [hasEntered, setHasEntered] = useState(isDetailPage)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const [displayedProjectId, setDisplayedProjectId] = useState<string | null>(
    null
  )

  const [projects, setProjects] = useState<Project[]>([])

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

  if (!category || !isValidCategory(category)) {
    return <div>Invalid category</div>
  }

  // Show current project (on detail page), then hovered project, then null
  const currentProject =
    isDetailPage && currentSlug
      ? projects.find((p) => (p.slug?.current || p.slug) === currentSlug)
      : null

  // Update displayed project when hovering, clear when not hovering
  useEffect(() => {
    if (hoveredProject) {
      setDisplayedProjectId(hoveredProject)
    } else {
      setDisplayedProjectId(null)
    }
  }, [hoveredProject])

  // Show current project on detail pages, otherwise show hovered project
  const displayedProjectData =
    currentProject ||
    (displayedProjectId
      ? projects.find((p) => p._id === displayedProjectId)
      : null)

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

  // Real URL navigation with View Transitions
  const handleProjectClick = (project: Project) => {
    const projectSlug = project.slug?.current || project.slug

    // Check if View Transitions API is supported
    if ('startViewTransition' in document) {
      ;(document as any).startViewTransition(() => {
        startTransition(() => {
          router.push(`/${category}/${projectSlug}`)
        })
      })
    } else {
      // Fallback for browsers without View Transitions
      router.push(`/${category}/${projectSlug}`)
    }
  }

  return (
    <>
      <main className="container mx-auto flex h-[85vh] flex-1 items-center">
        <div className="w-1/3 overflow-hidden">
          <AnimatePresence mode="wait">
            {displayedProjectData ? (
              <motion.img
                key={displayedProjectData._id}
                src={urlFor(
                  displayedProjectData.featuredImage ||
                    displayedProjectData.coverImage
                )
                  .width(1000)
                  .height(1000)
                  .url()}
                alt={`${displayedProjectData.title} - Featured Image`}
                width={1000}
                height={1200}
                className="h-full w-full object-cover"
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
                  className="h-full w-full object-cover"
                  folder="projects"
                  priority={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex w-2/3 flex-wrap justify-end gap-8 px-8">
          {projects.map((project, index) => {
            const projectSlug = project.slug?.current || project.slug
            const isActiveProject = isDetailPage && currentSlug === projectSlug

            return (
              <div
                key={project._id}
                className="cursor-pointer overflow-hidden text-6xl leading-[1.3] hover:text-gray-500"
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => handleProjectClick(project)}
              >
                <motion.h2
                  className="overflow-hidden"
                  initial={{ y: '-100%' }}
                  animate={{
                    y:
                      hasEntered && (!isDetailPage || isActiveProject)
                        ? '0%'
                        : '-100%',
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1] as const,
                    delay: 0.15 * index,
                  }}
                >
                  {project.title}
                </motion.h2>
              </div>
            )
          })}
        </nav>
      </main>

      {/* Project photos render below the main section */}
      {isDetailPage && <div>{children}</div>}
    </>
  )
}
