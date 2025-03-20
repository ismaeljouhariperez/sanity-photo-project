'use client'
import React, { useState, useEffect, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import InfoOverlay from '../InfoOverlay'
import { SlideUp } from '@/lib/animations'
import { useAnimationStore } from '@/store/animationStore'
import { BarbaContext } from '@/app/layout'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { resetHeaderAnimation, setInProjectsSection, setLeavingPage } =
    useAnimationStore()
  // Utiliser le contexte Barba pour désactiver les transitions pendant la navigation
  const { disableBarba } = useContext(BarbaContext)

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
        router.push(`/projects/${projectType}`)
      } else {
        router.push('/projects')
      }
    }
  }

  // Réinitialise l'animation quand on quitte la page projects
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Si nous sommes dans la section projects, jouer l'animation de sortie avant de naviguer
    if (pathname.includes('/projects')) {
      // Désactiver barba pendant la navigation pour éviter les requêtes inutiles
      disableBarba()
      console.log('⚠️ Barba.js désactivé pour navigation vers accueil')

      // Activer l'état de sortie de page
      setLeavingPage(true)

      // Attendre que l'animation se termine avant de naviguer
      setTimeout(() => {
        resetHeaderAnimation()
        setLeavingPage(false)

        // Forcer une navigation "dure" en changeant directement la location
        // Cette approche contourne Barba.js complètement
        window.location.href = '/'
      }, 600) // Délai légèrement supérieur à la durée de l'animation (0.5s)
    } else {
      // Navigation directe si nous ne sommes pas dans projects
      router.push('/')
    }
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
