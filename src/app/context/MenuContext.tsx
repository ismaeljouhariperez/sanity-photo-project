'use client'
import React, { createContext, useContext, useState } from 'react'

type MenuContextType = {
  menuText: string
  setMenuText: (text: string) => void
}

const MenuContext = createContext<MenuContextType>({ menuText: 'Index', setMenuText: () => {} })

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuText, setMenuText] = useState('Index')
  return (
    <MenuContext.Provider value={{ menuText, setMenuText }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)