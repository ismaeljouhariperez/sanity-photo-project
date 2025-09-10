'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/ui/Header'
import SmoothScrollProvider from './SmoothScrollProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Simple route change effect - Next.js handles caching natively
  useEffect(() => {
    console.log(`🔄 Route changed to ${pathname}`)
  }, [pathname])

  return (
    <SmoothScrollProvider>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </SmoothScrollProvider>
  )
}