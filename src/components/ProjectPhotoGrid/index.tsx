'use client'

import React, { useState, useEffect, useCallback } from 'react'
import PhotoGrid from '@/app/components/ProjectDetail/PhotoGrid'
import { useProjectsStore } from '@/store'
import { Photo } from '@/lib/sanity.types'

// Composant côté client pour charger les photos
const PhotoGridLoader = ({
  slug,
  category,
}: {
  slug: string
  category: 'black-and-white' | 'early-color'
}) => {
  // On utilise un sélecteur stable mémorisé
  const loadProjectDetails = useProjectsStore(
    useCallback((state) => state.loadProjectDetails, [])
  )

  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      setLoading(true)
      try {
        const project = await loadProjectDetails(category, slug)
        if (isMounted && project?.photos) {
          setPhotos(project.photos)
        }
      } catch (error) {
        console.error('Error loading project details:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [slug, category, loadProjectDetails])

  if (loading) {
    return (
      <div className="px-16 py-20 text-center">Chargement des photos...</div>
    )
  }

  return <PhotoGrid photos={photos} />
}

// Wrapper pour le détail du projet
export default function ProjectPhotoGrid({
  slug,
  category,
}: {
  slug: string
  category: 'black-and-white' | 'early-color'
}) {
  return (
    <div className="detail-container">
      <PhotoGridLoader slug={slug} category={category} />
    </div>
  )
}
