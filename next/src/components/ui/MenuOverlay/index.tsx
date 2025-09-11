'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMenuData, type MenuData } from './MenuData'
import MenuContent from './MenuContent'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

function MenuWithData({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [data, setData] = useState<MenuData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen])

  if (isLoading) {
    return (
      <motion.div
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        className="bg-cream fixed inset-0 z-40 flex items-center justify-center"
      >
        <div className="text-gray-500">Loading...</div>
      </motion.div>
    )
  }

  if (!data) return null

  return <MenuContent data={data} onClose={onClose} />
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && <MenuWithData isOpen={isOpen} onClose={onClose} />}
    </AnimatePresence>
  )
}