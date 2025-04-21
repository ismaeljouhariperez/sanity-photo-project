'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Photo } from '@/lib/sanity.types'
import { motion, useAnimation } from 'framer-motion'

interface PhotoGridProps {
  photos: Photo[]
}

const PhotoGrid = ({ photos }: PhotoGridProps) => {
  const controls = useAnimation()

  // Log pour déboguer les photos reçues
  useEffect(() => {
    console.log('PhotoGrid a reçu photos:', {
      count: photos?.length || 0,
      firstPhoto: photos?.length > 0 ? photos[0] : null,
      hasUrls: photos?.every((photo) => Boolean(photo.url)),
    })
  }, [photos])

  // Démarrer l'animation une fois que les items du ProjectsView ont terminé leur animation
  useEffect(() => {
    // Attendre que les animations de ProjectsView soient complètes
    const timer = setTimeout(() => {
      controls.start('visible')
    }, 800) // Délai pour laisser le temps aux animations ProjectsView

    return () => clearTimeout(timer)
  }, [controls])

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  // Photo item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Si pas de photos, retourner un message
  if (!photos || photos.length === 0) {
    return (
      <div className="px-16 py-20 text-center">
        <h3 className="text-xl font-semibold mb-4">Aucune photo disponible</h3>
        <p className="text-gray-500">
          Ce projet ne contient pas encore de photos.
        </p>
      </div>
    )
  }

  // Vérification supplémentaire pour les URLs manquantes
  const validPhotos = photos.filter((photo) => Boolean(photo.url))

  if (validPhotos.length === 0) {
    console.error('Photos reçues mais aucune URL valide trouvée:', photos)
    return (
      <div className="px-16 py-20 text-center">
        <h3 className="text-xl font-semibold mb-4">
          Problème d&apos;affichage des photos
        </h3>
        <p className="text-gray-500">
          Les photos existent mais ne peuvent pas être affichées (URLs
          manquantes).
        </p>
      </div>
    )
  }

  return (
    <div className="px-16 py-20">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {validPhotos.map((photo, index) => (
          <motion.div
            key={photo._id || `photo-${index}`}
            className={`relative ${index % 2 === 1 ? 'md:mt-16' : ''}`}
            variants={itemVariants}
          >
            <div className="overflow-hidden rounded-md group">
              {photo.url && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.url}
                    alt={photo.alt || photo.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default PhotoGrid
