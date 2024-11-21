import Link from 'next/link'

export default function Header() {
  return (
    <header className="py-6">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Votre Nom
        </Link>
        <div className="space-x-6">
          <Link href="/projects">Projets</Link>
          <Link href="/info">Info</Link>
        </div>
      </nav>
    </header>
  )
}
