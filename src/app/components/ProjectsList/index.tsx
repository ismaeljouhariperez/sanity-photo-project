'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import PageTransition from '@/components/transitions/PageTransition'

interface ProjectsListProps {
  category: 'black-and-white' | 'early-color'
}

export default function ProjectsList({ category }: ProjectsListProps) {
  const { sanity } = useServices()
  const { navigateTo } = useTransitionNavigation()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)
  const initialFetchDone = useRef(false)

  // Gestionnaire d'événements pour la navigation
  const handleProjectClick = (e: React.MouseEvent, projectSlug: string) => {
    e.preventDefault()
    navigateTo(`/projects/${category}/${projectSlug}`)
  }

  // Fetch des données - utilise une approche simplifiée
  useEffect(() => {
    console.log(`🔄 Initialisation de l'effet pour la catégorie: ${category}`)

    // Initialiser les refs
    mounted.current = true
    const controller = new AbortController()

    // Simple fonction pour récupérer les projets
    async function getProjects() {
      if (!mounted.current || initialFetchDone.current) return

      try {
        console.log(`🚀 Début du fetch - category: ${category}`)
        setLoading(true)
        setError(null)

        const data = await sanity.fetchProjects(category)

        // Uniquement mettre à jour l'état si le composant est toujours monté
        if (mounted.current) {
          console.log(`✅ Projets récupérés - count: ${data?.length || 0}`)
          setProjects(data || [])
          setLoading(false)
          initialFetchDone.current = true
        }
      } catch (err) {
        if (mounted.current) {
          console.error(`❌ Erreur fetch:`, err)
          setError('Une erreur est survenue lors du chargement des projets.')
          setLoading(false)
        }
      }
    }

    // Lancer la récupération des données
    getProjects()

    // Nettoyage lors du démontage
    return () => {
      console.log(`🧹 Nettoyage pour la catégorie: ${category}`)
      mounted.current = false
      controller.abort()
    }
  }, [category, sanity]) // Uniquement ces deux dépendances

  // Variants pour l'animation
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const textVariants = {
    initial: { y: '100%' },
    animate: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      y: '-100%',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  // Rendu conditionnel
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Chargement...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-red-500">
        {error}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        Aucun projet trouvé dans cette catégorie.
      </div>
    )
  }

  // Rendu principal avec animations
  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
        <motion.nav
          className="flex flex-wrap gap-8 justify-end"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {projects.map((project) => (
            <motion.div
              key={project._id}
              variants={itemVariants}
              onClick={(e) =>
                handleProjectClick(
                  e,
                  project.slug.current || String(project.slug)
                )
              }
              className="text-6xl overflow-hidden leading-[1.3] hover:text-gray-500 font-wide cursor-pointer"
            >
              <motion.div
                className="transition-all duration-300"
                variants={textVariants}
              >
                {project.title}
              </motion.div>
            </motion.div>
          ))}
        </motion.nav>
      </div>
    </PageTransition>
  )
}
