'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type AnimationContextType = {
  isPageTransitioning: boolean
  setIsPageTransitioning: (isTransitioning: boolean) => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
)

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error(
      "useAnimation doit être utilisé à l'intérieur d'un AnimationProvider"
    )
  }
  return context
}

interface AnimationProviderProps {
  children: ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  return (
    <AnimationContext.Provider
      value={{
        isPageTransitioning,
        setIsPageTransitioning,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}
