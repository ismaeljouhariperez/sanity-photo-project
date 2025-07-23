'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface DelayedLoaderProps {
  /**
   * Délai en ms avant d'afficher le spinner
   * @default 1000
   */
  delay?: number
  /**
   * Message à afficher sous le spinner
   * @default "Chargement..."
   */
  message?: string
  /**
   * Taille du spinner en pixels
   * @default 32
   */
  size?: number
  /**
   * Afficher le loader si true
   */
  isLoading: boolean
}

export default function DelayedLoader({
  delay = 1000,
  message = 'Chargement...',
  size = 32,
  isLoading,
}: DelayedLoaderProps) {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    // Si isLoading est true, on démarre le timer
    if (isLoading) {
      setShowSpinner(false)
      timer = setTimeout(() => {
        setShowSpinner(true)
      }, delay)
    }

    // Nettoyage
    return () => {
      clearTimeout(timer)
    }
  }, [isLoading, delay])

  // Si pas de chargement ou pas encore de spinner, on retourne null
  if (!isLoading || !showSpinner) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center space-y-4"
    >
      <div
        className="border-t-2 border-b-2 border-black rounded-full animate-spin"
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
      {message && <div className="text-sm opacity-70">{message}</div>}
    </motion.div>
  )
}
