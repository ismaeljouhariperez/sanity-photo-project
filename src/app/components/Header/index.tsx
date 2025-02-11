'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useMenu } from '@/app/context/MenuContext'
import InfoOverlay from '../InfoOverlay'

export default function Header() {
  const { menuText } = useMenu()
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
          <Link href="/menu">{menuText}</Link>
          <Link href="/" className="text-xl">Ismael Ahab</Link>
        </nav>
      </header>
    </>
  )
}