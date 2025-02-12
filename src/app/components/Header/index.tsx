'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import InfoOverlay from '../InfoOverlay'

export default function Header() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  
  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsInfoOpen(true)
  }
  
  return (
    <>
      <InfoOverlay 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
      />
      <header className="py-5 flex justify-center">
        <nav className="flex justify-between items-center w-11/12">
          <Link href="/info" onClick={handleAboutClick} className="text-right">About</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/" className="text-xl">Ismael Ahab</Link>
        </nav>
      </header>
    </>
  )
}