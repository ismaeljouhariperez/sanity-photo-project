'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/ui/Header'
import SmoothScrollProvider from './SmoothScrollProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SmoothScrollProvider>
      <Header />
      {children}
    </SmoothScrollProvider>
  )
}
