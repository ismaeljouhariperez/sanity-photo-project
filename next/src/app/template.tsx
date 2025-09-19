'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTransitionStore } from '@/store/animationStore'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setTransition } = useTransitionStore()
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    // Only trigger transitions when pathname actually changes
    if (prevPathnameRef.current !== pathname) {
      setTransition(true, 'entering', prevPathnameRef.current, pathname)
      
      const timer = setTimeout(() => {
        setTransition(false)
      }, 800) // Match header animation duration

      prevPathnameRef.current = pathname
      return () => clearTimeout(timer)
    }
  }, [pathname, setTransition])

  // Page content renders immediately with no animations
  return <>{children}</>
}