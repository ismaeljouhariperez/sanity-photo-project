'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { MenuProvider } from './context/MenuContext'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-200 bg-white dark:bg-gray-900 text-black dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MenuProvider>
            <Header />
            <ThemeToggle />
            <main>
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
            </main>
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}