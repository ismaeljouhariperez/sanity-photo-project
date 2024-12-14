import Link from 'next/link'

export default function Header() {
  return (
    <header className="py-4">
      <nav className="mx-6 px-2 flex justify-between items-center">
        <Link href="/" className="text-l">Ismael Ahab</Link>
        <Link href="/menu">Index</Link>
        <Link href="/info" className="text-right">Info</Link>
      </nav>
    </header>
  )
}
