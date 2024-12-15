'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useMenu } from './context/MenuContext'

export default function Home() {
  const { setMenuText } = useMenu()

  return (
    <div className="h-[calc(100vh-6rem)] flex-1 grid grid-cols-2 gap-4 p-4 place-content-center justify-items-center items-center">
      <div className="relative w-80 aspect-[3/4] row-span-full		"
            onMouseEnter={() => setMenuText('Noir et Blanc')}
            onMouseLeave={() => setMenuText('Index')}>
        <Link href="/projects/noir-et-blanc">
          <Image
            src="/images/bw-cover.jpg"
            alt="Image 1"
            fill
            className="object-cover"
            priority
          />
        </Link>
      </div>
      <div className="relative w-80 aspect-[3/4] row-span-1 row-start-1"
            onMouseEnter={() => setMenuText('Couleur')}
            onMouseLeave={() => setMenuText('Index')}>
        <Link href="/projects/couleur">
          <Image
            src="/images/color-cover.jpg"
            alt="Image 2"
            fill
            className="object-cover"
            priority
          />
        </Link>
      </div>
    </div>
  )
}