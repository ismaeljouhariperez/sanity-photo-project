'use client'

import React from 'react'
import { useProjectsStore } from '@/store'

interface DebugProps {
  slug: string
  category: 'black-and-white' | 'early-color'
}

/**
 * Composant de débogage pour afficher les données brutes du projet
 */
export default function Debug({ slug, category }: DebugProps) {
  const currentProject = useProjectsStore((state) =>
    state.getProjectBySlug(category, slug)
  )

  return (
    <div className="p-8 bg-gray-100 mt-10 mx-16 rounded-md">
      <h2 className="text-xl font-bold mb-4">Informations de débogage</h2>

      <div className="mb-4">
        <strong>Slug:</strong> {slug}
      </div>

      <div className="mb-4">
        <strong>Catégorie:</strong> {category}
      </div>

      <div className="mb-4">
        <strong>Projet trouvé:</strong> {currentProject ? 'Oui' : 'Non'}
      </div>

      {currentProject && (
        <>
          <div className="mb-4">
            <strong>Titre:</strong> {currentProject.title}
          </div>

          <div className="mb-4">
            <strong>Photos disponibles:</strong>{' '}
            {currentProject.photos?.length || 0}
          </div>

          {currentProject.photos && currentProject.photos.length > 0 ? (
            <div>
              <strong>Première photo:</strong>
              <pre className="bg-gray-200 p-2 mt-2 rounded overflow-x-auto">
                {JSON.stringify(currentProject.photos[0], null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-red-500">Aucune photo disponible</div>
          )}
        </>
      )}
    </div>
  )
}
