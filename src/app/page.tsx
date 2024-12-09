import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen items-center">
        <Link href="/projects/noir-et-blanc" className="relative group">
          <div className="overflow-hidden aspect-square relative">
            <Image
              src="/images/bw-cover.jpg" // À remplacer par votre image
              alt="Projets Noir et Blanc"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold">Noir & Blanc</h2>
            </div>
          </div>
        </Link>

        <Link href="/projects/couleur" className="relative group">
          <div className="overflow-hidden aspect-square relative">
            <Image
              src="/images/color-cover.jpg" // À remplacer par votre image
              alt="Projets Couleur"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold">Couleur</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
