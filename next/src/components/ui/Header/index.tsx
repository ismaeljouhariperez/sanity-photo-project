'use client'
import React, { useState, useEffect, memo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import InfoOverlay from '../InfoOverlay'
import MenuOverlay from '../MenuOverlay'
import GalleryOverlay from '../GalleryOverlay'
import { useAnimationStore } from '@/store/animationStore'
import { useCurrentProjectStore } from '@/store/currentProjectStore'
import { useRouter } from 'next/navigation'
import s from './styles.module.css'

const Header = memo(function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const pathname = usePathname()
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()
  const currentProject = useCurrentProjectStore((state) => state.project)
  const router = useRouter()

  // Define page type variables
  const isProjectPage =
    pathname.includes('/black-and-white') || pathname.includes('/early-color')
  
  // Check if we're on a project detail page (with slug)
  const isProjectDetailPage = isProjectPage && pathname.split('/').length === 3

  const handleAboutClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }, [])

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()

    // If gallery is open, close it
    if (isGalleryOpen) {
      setIsGalleryOpen(false)
      return
    }

    // If on project detail page, toggle gallery overlay
    if (isProjectDetailPage) {
      setIsGalleryOpen(!isGalleryOpen)
    } 
    // If on project category page, navigate to category list or home
    else if (isProjectPage) {
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
    } else {
      // Toggle menu overlay
      setIsMenuOpen(!isMenuOpen)
    }
  }, [isMenuOpen, isGalleryOpen, pathname, router, isProjectPage, isProjectDetailPage])

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

  // Dynamic header text - easily extensible for future content
  const getHeaderText = () => {
    if (isGalleryOpen) return 'Close'
    if (isProjectDetailPage) return 'Gallery'
    if (isProjectPage) return 'Index'
    if (isMenuOpen) return 'Close'
    // Add more conditions here for future dynamic content
    return 'Menu'
  }

  // Header elements animation variants
  const headerElementVariants = {
    initial: { y: 50, opacity: 0 },
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: 0.2,
      },
    },
    exit: {
      y: -50,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  const containerVariants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <GalleryOverlay 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)}
        project={currentProject}
      />
      <header className="container fixed left-0 right-0 top-0 z-50 mx-auto flex justify-center py-5">
        <AnimatePresence mode="wait">
          <motion.nav
            key={pathname}
            className={s.nav}
            variants={containerVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <motion.button
              variants={headerElementVariants}
              onClick={handleAboutClick}
            >
              About
            </motion.button>
            <motion.button
              variants={headerElementVariants}
              onClick={handleMenuClick}
              className={s.title}
            >
              {getHeaderText()}
            </motion.button>
            <motion.div variants={headerElementVariants}>
              <Link
                href="/"
                className="text-xl transition-opacity hover:opacity-80"
              >
                Ismael Perez Léon
              </Link>
            </motion.div>
          </motion.nav>
        </AnimatePresence>
      </header>
    </>
  )
})

export default Header
