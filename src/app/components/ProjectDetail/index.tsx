'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useServices } from '@/hooks/useServices'
import { Photo, Project } from '@/lib/sanity.types'
import Image from 'next/image'
import Link from 'next/link'
import PageTransition from '@/components/transitions/PageTransition'
import DelayedLoader from '@/components/ui/DelayedLoader'

interface ProjectDetailProps {
  slug: string
  category: 'black-and-white' | 'early-color'
}

export default function ProjectDetail({ slug, category }: ProjectDetailProps) {
  const { sanity } = useServices()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Déterminer le titre de la catégorie pour l'affichage
  const categoryTitle =
    category === 'black-and-white' ? 'noir et blanc' : 'couleur'

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true)
        const data = await sanity.fetchProjectBySlug(slug, category)
        setProject(data)
        if (data.photos && data.photos.length > 0) {
          setSelectedPhoto(data.photos[0])
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug, category, sanity])

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }

  const navigatePhoto = (direction: 'next' | 'prev') => {
    if (!project?.photos || !selectedPhoto) return

    const currentIndex = project.photos.findIndex(
      (photo) => photo._id === selectedPhoto._id
    )

    if (currentIndex === -1) return

    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % project.photos.length
        : (currentIndex - 1 + project.photos.length) % project.photos.length

    setSelectedPhoto(project.photos[newIndex])
  }

  // Définition des animations
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0 },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, y: -10 },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <DelayedLoader isLoading={loading} message="Chargement du projet..." />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <p className="mb-4">Projet non trouvé.</p>
        <Link
          href={`/projects/${category}`}
          className="text-blue-500 hover:underline"
        >
          Retour aux projets
        </Link>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/projects/${category}`}
            className="text-gray-600 hover:text-gray-900 transition-colors mb-4 inline-block"
          >
            &larr; Retour aux projets {categoryTitle}
          </Link>
          <h1 className="text-4xl font-bold mt-2">{project.title}</h1>
          {project.description && (
            <p className="mt-4 text-lg text-gray-700 max-w-3xl">
              {project.description}
            </p>
          )}
        </motion.div>

        {project.photos && project.photos.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {project.photos.map((photo) => (
              <motion.div
                key={photo._id}
                variants={itemVariants}
                className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                onClick={() => openLightbox(photo)}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={
                      photo.url || sanity.urlFor(photo.image).width(800).url()
                    }
                    alt={photo.alt || photo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{photo.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p>Aucune photo n&apos;est disponible pour ce projet.</p>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
              onClick={closeLightbox}
            >
              <motion.button
                className="absolute top-4 right-4 text-white text-4xl"
                onClick={closeLightbox}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>

              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation()
                  navigatePhoto('prev')
                }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                &lsaquo;
              </motion.button>

              <motion.div
                className="relative max-h-[90vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={
                    selectedPhoto.url ||
                    sanity.urlFor(selectedPhoto.image).width(1200).url()
                  }
                  alt={selectedPhoto.alt || selectedPhoto.title}
                  width={selectedPhoto.dimensions?.width || 1200}
                  height={selectedPhoto.dimensions?.height || 800}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
                {selectedPhoto.title && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl">{selectedPhoto.title}</h3>
                    {selectedPhoto.description && (
                      <p className="mt-1">{selectedPhoto.description}</p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation()
                  navigatePhoto('next')
                }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                &rsaquo;
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
