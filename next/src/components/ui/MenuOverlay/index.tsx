'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { getMenuData, type MenuData } from './MenuData'
import MenuContent from './MenuContent'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

function MenuWithData({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [data, setData] = useState<MenuData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (!data && isOpen) {
      setIsLoading(true)
      const fetchData = async () => {
        try {
          const menuData = await getMenuData()
          setData(menuData)
        } catch (error) {
          console.error('Failed to fetch menu data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [isOpen, data])

  // Show content immediately if we have data, even while loading fresh data
  if (data) {
    return <MenuContent data={data} onClose={onClose} />
  }

  // Only show loading if we truly have no data
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 opacity-0 pointer-events-none">
        {/* Invisible loading state to prevent flash */}
      </div>
    )
  }

  return null
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && <MenuWithData key="menu-overlay" isOpen={isOpen} onClose={onClose} />}
    </AnimatePresence>
  )
}