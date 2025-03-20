'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import './globals.css'
import { aujournuit } from './fonts'
import PageTransition from './components/PageTransition'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <body
        className="transition-colors duration-200 bg-white dark:bg-gray-900 text-black dark:text-white"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <ThemeToggle />
          <PageTransition />
          <div data-barba="wrapper">
            <div data-barba="container">
              <main>
                <AnimatePresence mode="wait">{children}</AnimatePresence>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
