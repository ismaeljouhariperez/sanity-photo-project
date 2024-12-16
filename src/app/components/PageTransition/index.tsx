'use client'
import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 0 100%)' }}
      transition={{ 
        duration: 1,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}