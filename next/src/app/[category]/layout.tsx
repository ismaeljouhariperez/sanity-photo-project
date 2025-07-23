'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { getProjects } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/projectStore'
import { isValidCategory } from '@/lib/constants'

/**
 * Shared layout for category pages
 * Provides persistent project list across navigation
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
  const [isLoading, setIsLoading] = useState(true)

  // Extract category from pathname
  const category = pathname?.split('/')[1]

  // Validate category
  if (!category || !isValidCategory(category)) {
    return <div>Invalid category</div>
  }

  const activeSlug = pathname?.split('/')[2]
  const isDetailView = !!activeSlug

  // Update store when route changes
  useEffect(() => {
    setSelectedCategory(category)
    setSelectedSlug(isDetailView ? activeSlug : null)
  }, [category, activeSlug, isDetailView, setSelectedCategory, setSelectedSlug])

  // Load projects for current category
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      try {
        const categoryProjects = await getProjects(category)
        setProjects(categoryProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [category])

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center">
  //       <div>Loading...</div>
  //     </div>
  //   )
  // }

  return (
    <main className="flex min-h-[calc(100vh-5.5rem)] flex-1 items-center justify-center px-16">
      <nav className="flex flex-wrap justify-end gap-8">
        {projects.map((project, index) => {
          const projectSlug = project.slug?.current || project.slug
          const isActive = isDetailView && activeSlug === projectSlug

          return (
            <div
              key={project._id}
              className="cursor-pointer overflow-hidden text-6xl leading-[1.3] hover:text-gray-500"
              onClick={() => {
                if (isActive) {
                  // Navigate back to category list
                  router.push(`/${category}`)
                } else {
                  // Navigate to project detail
                  router.push(`/${category}/${projectSlug}`)
                }
              }}
            >
              <motion.h2
                className="overflow-hidden"
                initial={{ y: '-100%' }}
                animate={{
                  y: isDetailView && !isActive ? '-100%' : '0%',
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

      {/* Detail Content Area */}
      {isDetailView && <div className="flex-1">{children}</div>}
    </main>
  )
}
