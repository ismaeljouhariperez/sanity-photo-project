'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function BWProjects() {
  return (
    <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center">
      <motion.div
        layoutId="bw-image"
        className="relative w-80 aspect-[3/4]">
        <Image
          src="https://picsum.photos/id/1011/800/1000"
          alt="Noir et Blanc"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-8">
        <h1 className="text-3xl font-bold mb-4">Noir et Blanc</h1>
        <p className="text-lg">Description du projet...</p>
      </motion.div>
    </div>
  )
}