'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { gsap, Power4 } from 'gsap'
import { motion } from 'framer-motion'
import s from './styles.module.scss'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const moveMagnet = (event: MouseEvent) => {
      const bounding = button.getBoundingClientRect()
      const strength = 30 // Ajustez cette valeur pour l'intensité de l'effet

      gsap.to(button, {
        duration: 1,
        x:
          ((event.clientX - bounding.left - bounding.width / 2) /
            bounding.width) *
          strength,
        y:
          ((event.clientY - bounding.top - bounding.height / 2) /
            bounding.height) *
          strength,
        ease: Power4.easeOut,
      })
    }

    const resetMagnet = () => {
      gsap.to(button, {
        duration: 1,
        x: 0,
        y: 0,
        ease: Power4.easeOut,
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
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={s.magnetic}>
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
    </button>
  )
}
