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
  const [isLoading, setIsLoading] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)

  const category = pathname?.split('/')[1]
  const activeSlug = pathname?.split('/')[2]
  const isCategoryPage = !activeSlug

  if (!category || !isValidCategory(category)) {
    return <div>Invalid category</div>
  }

  useEffect(() => {
    setSelectedCategory(category)
    setSelectedSlug(activeSlug || null)
  }, [category, activeSlug, setSelectedCategory, setSelectedSlug])

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
        // Trigger entrance animation after data loads
        setTimeout(() => setHasEntered(true), 100)
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
    <main className="flex min-h-[calc(100vh-5.5rem)] flex-1 items-center justify-center">
      <div className="h-full w-1/3">
        <div className="flex h-full w-full items-center justify-center p-16">
          <img
            src="https://images.squarespace-cdn.com/content/v1/634723977fd6041c2f4c7c59/7af3cdd9-943d-446c-92d6-8dd8db10e183/DSCF0286.jpg?format=1000w"
            alt="Photographie Noir et Blanc"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <nav className="flex w-2/3 flex-wrap justify-end gap-8 px-16">
        {projects.map((project, index) => {
          const projectSlug = project.slug?.current || project.slug
          const isActive = !isCategoryPage && activeSlug === projectSlug

          return (
            <div
              key={project._id}
              className="cursor-pointer overflow-hidden text-6xl leading-[1.3] hover:text-gray-500"
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
                    hasEntered && (isCategoryPage || isActive) ? '0%' : '-100%',
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
  )
}
