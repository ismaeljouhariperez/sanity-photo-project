'use client'
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import InfoOverlay from '../InfoOverlay'
import AnimatedTitle from '../AnimatedTitle'
import { useAnimationStore } from '@/store/animationStore'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { resetHeaderAnimation } = useAnimationStore()

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }

  const handleIndexClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // const link = getIndexLink()
    // console.log('link', link)
    // if (link) {
    //   router.push(link)
    // }
  }

  // Réinitialise l'animation quand on quitte la page projects
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    resetHeaderAnimation()
    router.push('/')
  }

  // Surveille les changements de pathname pour réinitialiser l'animation
  useEffect(() => {
    const isLeavingProjects = !pathname.includes('/projects/')
    if (isLeavingProjects) {
      resetHeaderAnimation()
    }
  }, [pathname, resetHeaderAnimation])

  const isProjectPage = pathname.includes('/projects/')

  // const getIndexLink = () => {
  //   if (pathname.includes('/projects/black-and-white')) {
  //     return '/projects/black-and-white'
  //   }
  //   if (pathname.includes('/projects/early-color')) {
  //     return '/projects/early-color'
  //   }
  //   return ''
  // }

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <header className="py-5 flex justify-center">
        <nav className={s.nav}>
          <button onClick={handleAboutClick}>About</button>
          {isProjectPage && (
            <AnimatedTitle isHeader>
              <button onClick={handleIndexClick} className={s.title}>
                Index
              </button>
            </AnimatedTitle>
          )}
          <button onClick={handleHomeClick} className="text-xl">
            Ismael Ahab
          </button>
        </nav>
      </header>
    </>
  )
}
