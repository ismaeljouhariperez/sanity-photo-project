'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import InfoOverlay from '../InfoOverlay'
import { SlideUp } from '@/lib/animations'
import { useAnimationStore } from '@/store/animationStore'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()
  const { navigateSafely } = useSafeNavigation()

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }

  const handleIndexClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Logique pour naviguer vers l'index du projet
    if (pathname.includes('/projects/')) {
      const projectType = pathname.split('/projects/')[1]?.split('/')[0]
      if (projectType) {
        // Contourner Barba.js pour les navigations depuis des pages de projet spécifique
        const navigatingFromProjectDetail = pathname.split('/').length > 3
        navigateSafely(`/projects/${projectType}`, navigatingFromProjectDetail)
      } else {
        navigateSafely('/projects')
      }
    }
  }

  // Réinitialise l'animation quand on quitte la page projects
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Pour la page d'accueil, on contourne Barba.js si on vient de projects
    navigateSafely('/', pathname.includes('/projects'))
  }

  // Surveille les changements de pathname pour mettre à jour l'état
  useEffect(() => {
    const isInProjects = pathname.includes('/projects')
    setInProjectsSection(isInProjects)

    // Réinitialiser l'animation si on quitte complètement la section projects
    if (!isInProjects) {
      resetHeaderAnimation()
    }
  }, [pathname, resetHeaderAnimation, setInProjectsSection])

  const isProjectPage = pathname.includes('/projects')

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <header className="py-5 flex justify-center">
        <nav className={s.nav}>
          <button onClick={handleAboutClick}>About</button>
          {isProjectPage && (
            <SlideUp
              isHeader
              playExitAnimation={true}
              entrancePatterns={['/projects']}
              exitPatterns={['/projects']}
              playOnceOnly={true}
              distance={50}
            >
              <button onClick={handleIndexClick} className={s.title}>
                Index
              </button>
            </SlideUp>
          )}
          <button onClick={handleHomeClick} className="text-xl">
            Ismael Ahab
          </button>
        </nav>
      </header>
    </>
  )
}
