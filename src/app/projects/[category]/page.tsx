import { Metadata } from 'next'
import { createClient } from 'next-sanity'
import ClientCategoryPage from './client-page'

type Props = {
  params: { category: 'black-and-white' | 'early-color' }
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryTitle =
    params.category === 'black-and-white' ? 'Noir et Blanc' : 'Couleur'

  return {
    title: `Projets ${categoryTitle} | Photography Portfolio`,
    description: `Découvrez ma collection de projets photographiques en ${categoryTitle.toLowerCase()}.`,
  }
}

// Page des projets par catégorie
export default function CategoryPage({ params }: Props) {
  return <ClientCategoryPage category={params.category} />
}
