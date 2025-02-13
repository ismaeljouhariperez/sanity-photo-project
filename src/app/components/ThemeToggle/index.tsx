'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import s from './styles.module.css'

// const themes = ['light', 'dark']

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const switchMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button className={s.nightToggle} onClick={switchMode}>
      <div id="moon" className={theme === 'dark' ? s.sun : s.moon}></div>
    </button>
  )
}
