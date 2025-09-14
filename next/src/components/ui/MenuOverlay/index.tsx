'use client'

import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMenuStore } from '@/store/menuStore'
import MenuContent from './MenuContent'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const MenuWithData = memo(function MenuWithData({ onClose }: { onClose: () => void }) {
  // Get menu data from store (no fetching needed)
  const data = useMenuStore((state) => state.data)
  const isLoading = false // No loading state needed since data is pre-fetched

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
})

const MenuOverlay = memo(function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && <MenuWithData key="menu-overlay" onClose={onClose} />}
    </AnimatePresence>
  )
})

export default MenuOverlay