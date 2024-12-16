'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useMenu } from './context/MenuContext'

export default function Home() {
  const { setMenuText } = useMenu()

  return (
    <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center justify-items-center">
      <motion.div
        layoutId="bw-image"
        className="relative w-80 aspect-[3/4]"
        onMouseEnter={() => setMenuText('Noir et Blanc')}
        onMouseLeave={() => setMenuText('Index')}>
        <Link href="/projects/noir-et-blanc">
          <Image
            src="https://picsum.photos/id/1011/800/1000"
            alt="Noir et Blanc"
            fill
            className="object-cover"
            priority
          />
        </Link>
      </motion.div>

      <motion.div
        layoutId="color-image"
        className="relative w-80 aspect-[3/4]"
        onMouseEnter={() => setMenuText('Couleur')}
        onMouseLeave={() => setMenuText('Index')}>
        <Link href="/projects/couleur">
          <Image
            src="https://picsum.photos/id/1015/800/1000"
            alt="Couleur"
            fill
            className="object-cover"
            priority
          />
        </Link>
      </motion.div>
    </div>
  )
}