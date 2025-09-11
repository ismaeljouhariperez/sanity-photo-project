'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTransitionStore } from '@/store/transitionStore'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setTransition } = useTransitionStore()

  useEffect(() => {
    // Only coordinate header transitions, no page content animations
    setTransition(true, 'entering', null, pathname)
    
    const timer = setTimeout(() => {
      setTransition(false)
    }, 800) // Match header animation duration

    return () => clearTimeout(timer)
  }, [pathname, setTransition])

  // Page content renders immediately with no animations
  return <>{children}</>
}