'use client'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useServices } from '@/hooks/useServices'
import { Project } from '@/lib/sanity.types'
import { BarbaContext } from '@/app/layout'

type PageParams = {
  params: Promise<{ slug: string }>
}

export default function BlackAndWhiteProjectPage({ params }: PageParams) {
  const resolvedParams = React.use(params)
  const { sanity } = useServices()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasBarba, setHasBarba] = useState(false)
  const mounted = useRef(true)

  // Utiliser le contexte pour désactiver barba pendant le chargement
  const { disableBarba, enableBarba } = useContext(BarbaContext)

  // S'assurer que nous nettoyons correctement au démontage
  useEffect(() => {
    mounted.current = true
    console.log('🔍 Page projet initialisée:', resolvedParams.slug)

    return () => {
      console.log('🧹 Page projet démontée:', resolvedParams.slug)
      mounted.current = false
    }
  }, [resolvedParams.slug])

  // Désactiver barba.js dès le chargement de la page
  useEffect(() => {
    disableBarba()
    console.log('⚠️ Barba.js désactivé pour le chargement du projet')

    // Vérifier si barba est déjà chargé
    const checkBarba = async () => {
      try {
        await import('@barba/core')
        if (mounted.current) {
          setHasBarba(true)
        }
      } catch {
        // Ignoré intentionnellement
      }
    }
    checkBarba()

    // Réactiver barba à la sortie du composant
    return () => {
      console.log('♻️ Réactivation de Barba.js')
      enableBarba()
    }
  }, [disableBarba, enableBarba])

  useEffect(() => {
    console.log('🚀 Début fetch:', resolvedParams.slug)

    const fetchData = async () => {
      try {
        const data = await sanity.fetchProjectBySlug(
          resolvedParams.slug,
          'black-and-white'
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
    return <div className="min-h-[calc(100vh-5.5rem)] p-8">Chargement...</div>
  }

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] p-8">
      <h1 className="text-4xl mb-8">{project.title}</h1>
      {hasBarba && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          Barba.js déactivé pendant le chargement du projet pour éviter les
          conflits
        </div>
      )}
      {project.description && <p className="mb-8">{project.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.photos?.map((photo) => (
          <div key={photo._id} className="aspect-w-16 aspect-h-9 relative">
            <Image
              src={photo.url || ''}
              alt={photo.alt || photo.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
