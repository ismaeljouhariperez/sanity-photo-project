'use client'
import React from 'react'
import { motion } from 'framer-motion'
import ImageKitImage from '@/app/components/ImageKitImage'

export default function ColorProjects() {
  return (
    <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-8">
        <h1 className="text-3xl font-bold mb-4">Couleur</h1>
        <p className="text-lg">Description du projet...</p>
      </motion.div>

      <motion.div
        layoutId="color-image"
        className="relative w-80 flex items-center aspect-[3/4]">
        <ImageKitImage 
            src="default-image.jpg"
            alt="Description de l'image"
            width={800}
            height={600}
            className="object-cover"
          />
      </motion.div>
    </div>
  )
} 