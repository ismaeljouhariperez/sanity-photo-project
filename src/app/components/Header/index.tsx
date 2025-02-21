'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import InfoOverlay from '../InfoOverlay'

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
    if (link) {
      router.push(link)
    }
  }

  // Détermine si nous sommes dans une page de projet
  const isProjectPage = pathname.includes('/projects/')

  // Détermine le lien du menu en fonction du type de projet
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
        <nav className="flex justify-between items-center w-11/12">
          <button onClick={handleAboutClick} className="text-right">
            About
          </button>
          {isProjectPage && <button onClick={handleIndexClick}>Index</button>}
          <button onClick={() => router.push('/')} className="text-xl">
            Ismael Ahab
          </button>
        </nav>
      </header>
    </>
  )
}
