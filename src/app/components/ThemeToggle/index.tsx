'use client'

import React from 'react'
import { useTheme } from 'next-themes'

const themes = ['light', 'dark']

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  )
} 