'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import { AnimatePresence } from 'framer-motion'
import { MenuProvider } from './context/MenuContext'
import Header from './components/Header'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <MenuProvider>
          <Header />
          <main>
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </main>
        </MenuProvider>
      </body>
    </html>
  )
}