'use client'

import React, { useEffect, useState, useMemo } from 'react'
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

  // Récupérer les projets de manière sécurisée
  const projects = useMemo(() => {
    if (!category) return []
    return useProjectsStore.getState().getProjectsByCategory(category)
  }, [category])

  // Mémoriser l'instance de ProjectsView pour éviter les remontages inutiles
  const memoizedProjectsView = useMemo(() => {
    if (!category) return null
    if (!projectViewMounted || projects.length === 0) return null

    return (
      <ProjectsView
        projects={projects}
        category={category}
        activeSlugs={currentSlug ? [currentSlug] : []}
      />
    )
  }, [category, projectViewMounted, projects, currentSlug])

  // Si pas de catégorie, ne rien afficher
  if (!category) return null

  return (
    <div className="relative min-h-screen">
      {/* Titres des projets - rendu de manière PERMANENTE avec une clé STABLE */}
      <div
        className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900"
        key="projects-view-permanent"
      >
        {memoizedProjectsView}
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
    </div>
  )
}
