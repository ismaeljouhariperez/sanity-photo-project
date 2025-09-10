'use client'

import { ReactLenis } from 'lenis/react'

interface LenisProviderProps {
  children: React.ReactNode
}

/**
 * Lenis smooth scroll provider using official React wrapper
 * Following Next.js 15 best practices and official Lenis documentation
 */
export default function LenisProvider({ children }: LenisProviderProps) {
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