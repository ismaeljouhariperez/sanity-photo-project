'use client'

import React from 'react'
import Header from '@/components/ui/Header'
import LenisProvider from './LenisProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LenisProvider>
      <Header />
      {children}
    </LenisProvider>
  )
}
