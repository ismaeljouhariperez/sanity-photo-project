'use client'
import React, { useState, useEffect, memo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import InfoOverlay from '../InfoOverlay'
import MenuOverlay from '../MenuOverlay'

// Lazy load GalleryOverlay - heavy component with animations
const GalleryOverlay = dynamic(() => import('../GalleryOverlay'), {
  loading: () => (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="animate-pulse text-white">Loading gallery...</div>
    </div>
  ),
  ssr: false // Gallery interactions don't need SSR
})
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
  const { isMobile } = useMobileOptimizations()

  // Define page type variables
  const isProjectPage =
    pathname.includes('/black-and-white') || pathname.includes('/early-color')

  // Check if we're on a project detail page (with slug)
  const isProjectDetailPage = isProjectPage && pathname.split('/').length === 3

  const handleAboutClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()

    // About button always opens InfoOverlay on all pages
    setIsInfoOpen(true)
  }, [])

  const handleMenuClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      // If gallery is open, close it
      if (isGalleryOpen) {
        setIsGalleryOpen(false)
        return
      }
      // If on project detail page, toggle gallery overlay
      if (isProjectDetailPage) {
        setIsGalleryOpen(!isGalleryOpen)
      } else {
        // On all other pages (root, category), toggle menu overlay
        setIsMenuOpen(!isMenuOpen)
      }
    },
    [isMenuOpen, isGalleryOpen, isProjectDetailPage]
  )

  const handleIndexClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      // Close any open overlays before navigation
      if (isGalleryOpen) {
        setIsGalleryOpen(false)
      }
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
      if (isInfoOpen) {
        setIsInfoOpen(false)
      }

      // Navigate back to parent category
      const pathSegments = pathname.split('/').filter(Boolean)
      if (pathSegments.length >= 2) {
        const category = pathSegments[0]
        setTimeout(() => {
          router.push(`/${category}`)
        }, 300) // Allow time for overlay close animations
      }
    },
    [pathname, router, isGalleryOpen, isMenuOpen, isInfoOpen]
  )

  // Surveille les changements de pathname pour mettre à jour l'état
  useEffect(() => {
    const isInProjects =
      pathname.includes('/black-and-white') || pathname.includes('/early-color')
    setInProjectsSection(isInProjects)

    // Reset all overlay states on navigation
    setIsGalleryOpen(false)
    setIsMenuOpen(false)
    setIsInfoOpen(false)

    // Réinitialiser l'animation si on quitte complètement la section projects
    if (!isInProjects) {
      resetHeaderAnimation()
    }
  }, [pathname, resetHeaderAnimation, setInProjectsSection])

  // Dynamic header text - easily extensible for future content
  const getHeaderText = () => {
    if (isGalleryOpen) return 'Close'
    if (isMenuOpen) return 'Close'
    // All pages show Menu (opens MenuOverlay)
    return 'Menu'
  }

  // Responsive animation variants - disabled on mobile/tablet to prevent flash
  const headerElementVariants = {
    initial: isMobile ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 },
    enter: {
      y: 0,
      opacity: 1,
      transition: isMobile
        ? {}
        : {
            duration: 1,
            ease: [0.16, 1, 0.3, 1] as const,
            delay: 0.2,
          },
    },
    exit: isMobile
      ? { y: 0, opacity: 1 }
      : {
          y: -50,
          opacity: 0,
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        },
  }

  const containerVariants = {
    initial: isMobile ? { opacity: 1 } : { opacity: 0 },
    enter: {
      opacity: 1,
      transition: isMobile
        ? {}
        : {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
    },
    exit: {
      opacity: 1,
      transition: isMobile
        ? {}
        : {
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
    },
  }

  // Determine category title for index link
  let categoryTitle = ''
  if (pathname.includes('/black-and-white')) {
    categoryTitle = 'Black & White'
  } else if (pathname.includes('/early-color')) {
    categoryTitle = 'Early Color'
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
      <header className="px-safe-left pr-safe-right pt-safe-top container fixed left-0 right-0 top-0 z-50 mx-auto flex justify-center py-2 md:py-5">
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
              className="min-h-touch min-w-touch flex touch-manipulation items-center justify-center place-self-start transition-opacity hover:opacity-80 active:opacity-60"
            >
              About
            </motion.button>
            {isProjectDetailPage ? (
              <motion.div
                variants={headerElementVariants}
                className={`${s.title} flex items-center gap-2`}
              >
                <button
                  onClick={handleMenuClick}
                  className="min-h-touch min-w-touch relative flex touch-manipulation items-center justify-center overflow-hidden transition-opacity hover:opacity-80 active:opacity-60"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isGalleryOpen ? 'close' : 'gallery'}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      className="block min-w-[50px] text-center"
                    >
                      {isGalleryOpen ? 'Close' : 'Gallery'}
                    </motion.span>
                  </AnimatePresence>
                </button>
                <span>/</span>
                <button
                  onClick={handleIndexClick}
                  className="min-h-touch min-w-touch flex touch-manipulation items-center justify-center transition-opacity hover:opacity-80 active:opacity-60"
                >
                  {categoryTitle}
                </button>
              </motion.div>
            ) : (
              <motion.button
                variants={headerElementVariants}
                onClick={handleMenuClick}
                className={`${s.title} min-h-touch min-w-touch relative flex items-center justify-center overflow-hidden`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={getHeaderText()}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                    className="block"
                  >
                    {getHeaderText()}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            )}
            <motion.div
              variants={headerElementVariants}
              className={s.titleWrapper}
            >
              <Link
                href="/"
                className="min-h-touch min-w-touch flex touch-manipulation items-center justify-center transition-opacity hover:opacity-80 active:opacity-60 md:text-xl"
              >
                <span className="md:hidden">Home</span>
                <span className="hidden md:inline">Ismael Perez Léon</span>
              </Link>
            </motion.div>
          </motion.nav>
        </AnimatePresence>
      </header>
    </>
  )
})

export default Header
