'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import InfoOverlay from '../InfoOverlay'
import { useAnimationStore } from '@/store/animationStore'
import { useRouter } from 'next/navigation'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()
  const router = useRouter()

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }

  const handleIndexClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Navigate to category list or home
    if (
      pathname.includes('/black-and-white') ||
      pathname.includes('/early-color')
    ) {
      const category = pathname.split('/')[1]
      if (
        category &&
        (category === 'black-and-white' || category === 'early-color')
      ) {
        // Navigate to category list
        router.push(`/${category}`)
      } else {
        router.push('/')
      }
    }
  }

  // Surveille les changements de pathname pour mettre à jour l'état
  useEffect(() => {
    const isInProjects =
      pathname.includes('/black-and-white') || pathname.includes('/early-color')
    setInProjectsSection(isInProjects)

    // Réinitialiser l'animation si on quitte complètement la section projects
    if (!isInProjects) {
      resetHeaderAnimation()
    }
  }, [pathname, resetHeaderAnimation, setInProjectsSection])

  const isProjectPage =
    pathname.includes('/black-and-white') || pathname.includes('/early-color')

  // Variants pour l'animation de l'Index
  const indexVariants = {
    hidden: { y: -20 },
    visible: { y: 0, transition: { duration: 0.5 } },
    exit: { y: -20, transition: { duration: 0.3 } },
  }

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <header className="flex justify-center py-5">
        <nav className={s.nav}>
          <button onClick={handleAboutClick}>About</button>
          {isProjectPage && (
            <motion.div
              className="flex h-[24px] items-center overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={indexVariants}>
                <button onClick={handleIndexClick} className={s.title}>
                  Index
                </button>
              </motion.div>
            </motion.div>
          )}
          <Link
            href="/"
            className="text-xl transition-opacity hover:opacity-80"
          >
            Ismael Leon
          </Link>
        </nav>
      </header>
    </>
  )
}
