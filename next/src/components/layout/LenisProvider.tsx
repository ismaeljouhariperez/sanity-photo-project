'use client'

import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'

interface LenisProviderProps {
  children: React.ReactNode
}

/**
 * Lenis smooth scroll provider using official React wrapper
 * Following Next.js 15 best practices and official Lenis documentation
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Small delay to ensure DOM is ready and navigation is complete
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return <div>{children}</div>
  }

  return (
    <ReactLenis 
      root 
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}