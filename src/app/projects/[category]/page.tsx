import { Metadata } from 'next'
import ClientCategoryPage from './client-page'

type Category = 'black-and-white' | 'early-color'

type Props = {
  params: { category: Category }
}

/**
 * Génère les métadonnées dynamiques pour les pages de catégorie de projets
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = params

  const categoryTitle =
    category === 'black-and-white' ? 'Noir et Blanc' : 'Couleur'

  return {
    title: `Projets ${categoryTitle} | Photography Portfolio`,
    description: `Découvrez ma collection de projets photographiques en ${categoryTitle.toLowerCase()}.`,
  }
}

export default function CategoryPage({ params }: Props) {
  const { category } = params

  return <ClientCategoryPage category={category} />
}
