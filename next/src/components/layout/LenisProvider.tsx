'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ReactLenis } from 'lenis/react'

interface LenisProviderProps {
  children: React.ReactNode
}

/**
 * Lenis smooth scroll provider optimized for Next.js 15+ navigation
 * Following official Lenis documentation and React 19 best practices
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Reset and reinitialize on every route change
    setIsReady(false)
    
    // Small delay to ensure DOM is ready after navigation
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname]) // Reinitialize on pathname change

  // Always render children to prevent layout shift
  return (
    <>
      {children}
      {isReady && (
        <ReactLenis
          root
          options={{
            duration: 1.0,
            easing: (t) => 1 - Math.pow(1 - t, 4), // Smooth ease-out-quart
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8, // Reduced for smoother feel
            touchMultiplier: 1.5,  // Reduced for better control
            infinite: false,
            syncTouch: true,
            lerp: 0.1,            // Smooth interpolation (0.05-0.15)
          }}
        />
      )}
    </>
  )
}
