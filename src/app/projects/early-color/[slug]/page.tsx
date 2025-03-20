'use client'
import React, { useEffect, useState, useRef } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import { motion } from 'framer-motion'
import PageTransition from '@/components/transitions/PageTransition'
import DelayedLoader from '@/components/ui/DelayedLoader'

type PageParams = {
  params: Promise<{ slug: string }>
}

export default function EarlyColorProjectPage({ params }: PageParams) {
  const resolvedParams = React.use(params)
  const { sanity } = useServices()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  // S'assurer que nous nettoyons correctement au démontage
  useEffect(() => {
    mounted.current = true
    console.log('🔍 Page projet initialisée:', resolvedParams.slug)

    return () => {
      console.log('🧹 Page projet démontée:', resolvedParams.slug)
      mounted.current = false
    }
  }, [resolvedParams.slug])

  useEffect(() => {
    console.log('🚀 Début fetch:', resolvedParams.slug)

    const fetchData = async () => {
      try {
        const data = await sanity.fetchProjectBySlug(
          resolvedParams.slug,
          'early-color'
        )

        if (mounted.current) {
          console.log('✅ Projet récupéré:', data?.title || 'Non trouvé')
          setProject(data)

          // N'effectuer ce changement que si le composant est toujours monté
          setLoading(false)
          console.log('🏁 Fin fetch, loading = false')
        } else {
          console.log('⚠️ Composant démonté, résultat de fetch ignoré')
        }
      } catch (err) {
        if (mounted.current) {
          console.error('❌ Erreur fetch:', err)
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      console.log('♻️ Nettoyage du fetch', resolvedParams.slug)
    }
  }, [resolvedParams.slug, sanity])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5.5rem)] p-8 flex justify-center items-center">
        <DelayedLoader isLoading={loading} message="Chargement du projet..." />
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  // Animation variants pour Framer Motion
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-5.5rem)] p-8">
        <motion.h1
          className="text-4xl mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {project.title}
        </motion.h1>

        {project.description && (
          <motion.p
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {project.description}
          </motion.p>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {project.photos?.map((photo) => (
            <motion.div
              key={photo._id}
              className="aspect-w-16 aspect-h-9 relative"
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Image
                src={photo.url || ''}
                alt={photo.alt || photo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  )
}
