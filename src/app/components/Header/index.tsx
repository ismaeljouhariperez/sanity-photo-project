'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import InfoOverlay from '../InfoOverlay'
import { useAnimationStore } from '@/store/animationStore'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()
  const { navigateTo } = useTransitionNavigation()

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
        navigateTo(`/projects/${projectType}`)
      } else {
        navigateTo('/projects')
      }
    }
  }

  // Réinitialise l'animation quand on quitte la page projects
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigateTo('/')
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

  // Variants pour l'animation de l'Index
  const indexVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  }

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <header className="py-5 flex justify-center">
        <nav className={s.nav}>
          <button onClick={handleAboutClick}>About</button>
          {isProjectPage && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={indexVariants}
            >
              <button onClick={handleIndexClick} className={s.title}>
                Index
              </button>
            </motion.div>
          )}
          <button onClick={handleHomeClick} className="text-xl">
            Ismael Ahab
          </button>
        </nav>
      </header>
    </>
  )
}
