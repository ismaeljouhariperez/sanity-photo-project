'use client'
import React, { useState, useEffect } from 'react'
import ProjectsList from '@/app/components/ProjectsList'
import { useAnimationStore } from '@/store/animationStore'
import PageTransition from '@/components/transitions/PageTransition'

type ClientCategoryPageProps = {
  category: 'black-and-white' | 'early-color'
}

export default function ClientCategoryPage({
  category,
}: ClientCategoryPageProps) {
  // État local pour éviter le re-rendu infini
  const [loaded, setLoaded] = useState(false)
  const { setInProjectsSection } = useAnimationStore()

  // S'assurer que la section est correctement marquée au chargement
  useEffect(() => {
    setInProjectsSection(true)

    // Marquer comme chargé pour éviter les re-rendus inutiles
    if (!loaded) {
      setLoaded(true)
    }

    return () => {
      // Cleanup si nécessaire
    }
  }, [setInProjectsSection, loaded])

  // Si nous avons déjà chargé le composant et qu'il n'y a pas de projets,
  // éviter de rendre ProjectsList pour éviter les cycles de montage/démontage
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center justify-between">
        {loaded && <ProjectsList category={category} />}
      </main>
    </PageTransition>
  )
}
