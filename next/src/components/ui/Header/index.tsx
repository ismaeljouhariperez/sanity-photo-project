'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import InfoOverlay from '../InfoOverlay'
import MenuOverlay from '../MenuOverlay'
import { useAnimationStore } from '@/store/animationStore'
import { useRouter } from 'next/navigation'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()
  const router = useRouter()

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // If on project page, navigate to category list or home
    if (isProjectPage) {
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

  // Dynamic header text - easily extensible for future content
  const getHeaderText = () => {
    if (isProjectPage) return 'Index'
    if (isMenuOpen) return 'Close'
    // Add more conditions here for future dynamic content
    return 'Menu'
  }

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <header className="fixed left-0 right-0 top-0 z-50 bg-cream flex justify-center py-5">
        <nav className={s.nav}>
          <button onClick={handleAboutClick}>About</button>
          <button onClick={handleMenuClick} className={s.title}>
            {getHeaderText()}
          </button>
          <Link
            href="/"
            className="text-xl transition-opacity hover:opacity-80"
          >
            Ismael Perez Léon
          </Link>
        </nav>
      </header>
    </>
  )
}
