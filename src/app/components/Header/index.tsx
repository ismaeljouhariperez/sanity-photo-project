'use client'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import InfoOverlay from '../InfoOverlay'
import AnimatedTitle from '../AnimatedTitle'
import s from './styles.module.scss'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }

  const handleIndexClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const link = getIndexLink()
    console.log('link', link)
    if (link) {
      router.push(link)
    }
  }

  const isProjectPage = pathname.includes('/projects/')

  const getIndexLink = () => {
    if (pathname.includes('/projects/black-and-white')) {
      return '/projects/black-and-white'
    }
    if (pathname.includes('/projects/early-color')) {
      return '/projects/early-color'
    }
    return ''
  }

  return (
    <>
      <InfoOverlay isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <header className="py-5 flex justify-center">
        <nav className={s.nav}>
          <button onClick={handleAboutClick}>About</button>
          {isProjectPage && (
            <AnimatedTitle>
              <button onClick={handleIndexClick} className={s.title}>
                Index
              </button>
            </AnimatedTitle>
          )}
          <button onClick={() => router.push('/')} className="text-xl">
            Ismael Ahab
          </button>
        </nav>
      </header>
    </>
  )
}
