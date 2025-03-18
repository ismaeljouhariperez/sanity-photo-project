'use client'

import React, { useEffect, useState } from 'react'
import { useServices } from '@/hooks/useServices'
import { Photo, Project } from '@/lib/sanity.types'
import Image from 'next/image'
import Link from 'next/link'

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

    let newIndex =
      direction === 'next'
        ? (currentIndex + 1) % project.photos.length
        : (currentIndex - 1 + project.photos.length) % project.photos.length

    setSelectedPhoto(project.photos[newIndex])
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        Chargement...
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={`/projects/${category}`}
          className="text-gray-600 hover:text-gray-900 transition-colors mb-4 inline-block"
        >
          &larr; Retour aux projets{' '}
          {category === 'black-and-white' ? 'noir et blanc' : 'couleur'}
        </Link>
        <h1 className="text-4xl font-bold mt-2">{project.title}</h1>
        {project.description && (
          <p className="mt-4 text-lg text-gray-700 max-w-3xl">
            {project.description}
          </p>
        )}
      </div>

      {project.photos && project.photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.photos.map((photo) => (
            <div
              key={photo._id}
              className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => openLightbox(photo)}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.url || sanity.urlFor(photo.image).width(800).url()}
                  alt={photo.alt || photo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune photo n'est disponible pour ce projet.</p>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl"
            onClick={closeLightbox}
          >
            &times;
          </button>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation()
              navigatePhoto('prev')
            }}
          >
            &lsaquo;
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
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
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="mt-1">{selectedPhoto.description}</p>
                )}
              </div>
            )}
          </div>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation()
              navigatePhoto('next')
            }}
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  )
}
