'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import './globals.css'
import { aujournuit } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <body className="transition-colors duration-200 bg-white dark:bg-gray-900 text-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <ThemeToggle />
          <main>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
