'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { useProjectStore } from '@/store/projectStore'
import { useProjectViewStore } from '@/store/projectViewStore'
import { isValidCategory } from '@/lib/constants'
import CloudinaryImage from '@/components/ui/CloudinaryImage'
import ProjectPhotosGrid from '@/components/ui/ProjectPhotosGrid'

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
  const { setSelectedSlug, setSelectedCategory } = useProjectStore()
  const { 
    mode, 
    activeSlug, 
    hasEntered, 
    hoveredProject,
    setHasEntered, 
    setHoveredProject,
    syncWithURL 
  } = useProjectViewStore()

  const [projects, setProjects] = useState<Project[]>([])

  // Extract category and slug from pathname
  const segments = pathname.split('/').filter(Boolean)
  const category = segments[0]
  
  useEffect(() => {
    return () => {
      console.log('💀 [CategoryLayout] Component unmounting')
    }
  }, [])

  // Sync URL changes with Zustand state
  useEffect(() => {
    console.log('🔄 [URL] Pathname:', pathname, '| Mode:', mode)
    syncWithURL(pathname)
  }, [pathname, syncWithURL])

  // Update project store when URL changes  
  useEffect(() => {
    if (category && isValidCategory(category)) {
      setSelectedCategory(category)
      setSelectedSlug(activeSlug)
    }
  }, [category, activeSlug, setSelectedCategory, setSelectedSlug])

  // Load projects for current category
  useEffect(() => {
    if (!category || !isValidCategory(category)) return
    
    const loadProjects = async () => {
      try {
        const categoryProjects = await getProjects(category)
        setProjects(categoryProjects)
        console.log('✅ [Projects] Loaded:', categoryProjects.length, 'for', category)
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

  // Show active project (on detail page), then hovered project, then null
  const activeProject =
    mode === 'detail' && activeSlug
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

  // Pure client-side navigation without changing actual URL
  const handleProjectClick = (project: Project) => {
    const projectSlug = project.slug?.current || project.slug
    const isActive = mode === 'detail' && activeSlug === projectSlug
    
    console.log('🎯 [Click]', project.title, isActive ? '→ List' : '→ Detail')
    
    // Pure client-side state change - NO URL manipulation
    if (isActive) {
      // Switch to list mode
      syncWithURL(`/${category}`)
    } else {
      // Switch to detail mode
      syncWithURL(`/${category}/${projectSlug}`)
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
            const isActive = mode === 'detail' && activeSlug === projectSlug
            const isCategoryPage = mode === 'list'

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

        {mode === 'detail' && <div className="flex-1">{children}</div>}
      </main>

      {mode === 'detail' && activeSlug && (
        <ProjectPhotosGrid
          projectSlug={activeSlug}
          category={category}
          animationDelay={projects.length * 0.15 + 0.8} // Wait for all text animations + base duration
        />
      )}
    </>
  )
}