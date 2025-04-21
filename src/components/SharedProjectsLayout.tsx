'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useProjectsStore } from '@/store'
import ProjectsView from '@/app/components/ProjectsView'
import { AnimatePresence, motion } from 'framer-motion'

interface SharedProjectsLayoutProps {
  children: React.ReactNode
}

/**
 * Layout partagé pour toutes les pages de projets
 * Maintient les titres des projets visibles et stables pendant la navigation
 * Évite le scintillement lors du chargement asynchrone des photos
 */
export default function SharedProjectsLayout({
  children,
}: SharedProjectsLayoutProps) {
  const pathname = usePathname()
  const isPhotoLoading = useProjectsStore((state) => state.isPhotoLoading)
  const projectViewMounted = useProjectsStore(
    (state) => state.projectViewMounted
  )
  const setProjectViewMounted = useProjectsStore(
    (state) => state.setProjectViewMounted
  )
  const setPreviousPathname = useProjectsStore(
    (state) => state.setPreviousPathname
  )
  const [category, setCategory] = useState<
    'black-and-white' | 'early-color' | null
  >(null)
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)

  // Extraire la catégorie et le slug de l'URL
  useEffect(() => {
    if (!pathname) return

    // Stocker le chemin actuel pour la prochaine navigation
    setPreviousPathname(pathname)

    // Extraire la catégorie et le slug de l'URL
    const match = pathname.match(/\/projects\/([^\/]+)(?:\/([^\/]+))?/)
    if (match) {
      const [, extractedCategory, extractedSlug] = match
      if (
        extractedCategory === 'black-and-white' ||
        extractedCategory === 'early-color'
      ) {
        setCategory(extractedCategory)
        setCurrentSlug(extractedSlug || null)
      }
    }
  }, [pathname, setPreviousPathname])

  // Chargement initial des projets si nécessaire
  useEffect(() => {
    if (!category) return

    const loadInitialProjects = async () => {
      await useProjectsStore.getState().loadProjects(category)
      setProjectViewMounted(true)
    }

    if (!projectViewMounted) {
      loadInitialProjects()
    }
  }, [category, projectViewMounted, setProjectViewMounted])

  // Rendre le layout uniquement si nous avons une catégorie
  if (!category) return null

  // Récupérer les projets pour la catégorie actuelle
  const projects = useProjectsStore.getState().getProjectsByCategory(category)

  return (
    <div className="relative min-h-screen">
      {/* Titres des projets - rendu de manière PERMANENTE avec une clé STABLE */}
      <div
        className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900"
        key="projects-view-permanent"
      >
        {projectViewMounted && projects.length > 0 && (
          <ProjectsView
            projects={projects}
            category={category}
            activeSlugs={currentSlug ? [currentSlug] : []}
          />
        )}
      </div>

      {/* Contenu dynamique (photos et détails) qui change entre les pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Indicateur de chargement pour les photos uniquement */}
      {isPhotoLoading && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm z-50">
          Chargement des photos...
        </div>
      )}
    </div>
  )
}
