'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/projectStore'
import { isValidCategory } from '@/lib/constants'
import CloudinaryImage from '@/components/ui/CloudinaryImage'
import ProjectPhotosGrid from '@/components/ui/ProjectPhotosGrid'

/**
 * Category layout with animated project titles
 */
export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { setSelectedSlug, setSelectedCategory } = useProjectStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [hasEntered, setHasEntered] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const category = pathname?.split('/')[1]
  const activeSlug = pathname?.split('/')[2]
  const isCategoryPage = !activeSlug

  useEffect(() => {
    if (category && isValidCategory(category)) {
      setSelectedCategory(category)
      setSelectedSlug(activeSlug || null)
    }
  }, [category, activeSlug, setSelectedCategory, setSelectedSlug])

  useEffect(() => {
    if (!category) return
    
    const loadProjects = async () => {
      try {
        const categoryProjects = await getProjects(category)
        setProjects(categoryProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        // Trigger entrance animation after data loads
        setTimeout(() => setHasEntered(true), 100)
      }
    }

    loadProjects()
  }, [category])

  if (!category || !isValidCategory(category)) {
    return <div>Invalid category</div>
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center">
  //       <div>Loading...</div>
  //     </div>
  //   )
  // }

  // Show active project (on detail page), then hovered project, then null
  const activeProject =
    !isCategoryPage && activeSlug
      ? projects.find((p) => (p.slug?.current || p.slug) === activeSlug)
      : null

  const displayedProjectData =
    activeProject ||
    (hoveredProject ? projects.find((p) => p._id === hoveredProject) : null)

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
                className="h-full w-full overflow-hidden"
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
            const isActive = !isCategoryPage && activeSlug === projectSlug

            return (
              <div
                key={project._id}
                className="cursor-pointer overflow-hidden text-6xl leading-[1.3] hover:text-gray-500"
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => {
                  const targetUrl = isActive
                    ? `/${category}`
                    : `/${category}/${projectSlug}`
                  router.push(targetUrl)
                }}
              >
                <motion.h2
                  className="overflow-hidden"
                  initial={{ y: '-100%' }}
                  animate={{
                    y:
                      hasEntered && (isCategoryPage || isActive)
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

        {!isCategoryPage && <div className="flex-1">{children}</div>}
      </main>

      {!isCategoryPage && activeSlug && (
        <ProjectPhotosGrid
          projectSlug={activeSlug}
          category={category}
          animationDelay={projects.length * 0.15 + 0.8} // Wait for all text animations + base duration
        />
      )}
    </>
  )
}
