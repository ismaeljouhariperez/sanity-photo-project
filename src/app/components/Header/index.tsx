'use client'
import Link from 'next/link'
import { useMenu } from '@/app/context/MenuContext'

export default function Header() {
  const { menuText } = useMenu()
  
  return (
    <header className="py-5 flex justify-center">
      <nav className="flex justify-between items-center w-11/12">
        <Link href="/" className="text-xl">Ismael Ahab</Link>
        <Link href="/menu">{menuText}</Link>
        <Link href="/info" className="text-right">Info</Link>
      </nav>
    </header>
  )
}