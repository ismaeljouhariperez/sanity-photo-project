'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { motion, useAnimationControls } from 'framer-motion'
import s from './styles.module.scss'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const controls = useAnimationControls()

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const moveMagnet = (event: MouseEvent) => {
      const bounding = button.getBoundingClientRect()
      const strength = 30 // Ajustez cette valeur pour l'intensité de l'effet

      const x =
        ((event.clientX - bounding.left - bounding.width / 2) /
          bounding.width) *
        strength
      const y =
        ((event.clientY - bounding.top - bounding.height / 2) /
          bounding.height) *
        strength

      controls.start({
        x,
        y,
        transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] }, // Power4 equivalent
      })
    }

    const resetMagnet = () => {
      controls.start({
        x: 0,
        y: 0,
        transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => moveMagnet(e))
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', resetMagnet)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', resetMagnet)
    }
  }, [controls])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleTheme}
      className={s.magnetic}
      animate={controls}
    >
      <div className={s.circle}>
        <div className={s.fullMoon} />
        <motion.div
          className={s.moonOverlay}
          initial={{ x: 0 }}
          animate={{
            x: theme === 'dark' ? 10 : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </motion.button>
  )
}
