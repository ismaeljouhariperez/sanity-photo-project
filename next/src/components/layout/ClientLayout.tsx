'use client'

import React, { useEffect } from 'react'
import Header from '@/components/ui/Header'
import { useMenuStore } from '@/store/menuStore'
import type { MenuData } from '@/components/ui/MenuOverlay/MenuData'

interface ClientLayoutProps {
  children: React.ReactNode
  menuData: MenuData | null
}

export default function ClientLayout({
  children,
  menuData,
}: ClientLayoutProps) {
  const setMenuData = useMenuStore((state) => state.setMenuData)

  // Initialize menu data in store (not fetching, just setting pre-fetched data)
  useEffect(() => {
    if (menuData) {
      setMenuData(menuData)
    }
  }, [menuData, setMenuData])

  return (
    <>
      <Header />
      {children}
    </>
  )
}
