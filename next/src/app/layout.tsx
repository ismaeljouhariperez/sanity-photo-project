'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/ui/Header'
import './globals.css'
import { aujournuit } from './fonts'

export default function RootLayout({
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
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <body className="bg-gray-50 text-black" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <Header />
          <AnimatePresence mode="wait" initial={false}>
            {children}
          </AnimatePresence>
        </div>
      </body>
    </html>
  )
}
