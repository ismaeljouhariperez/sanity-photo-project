import { Metadata } from 'next'
import ClientCategoryPage from './client-page'

type Category = 'black-and-white' | 'early-color'

type Props = {
  params: Promise<{ category: Category }> | { category: Category }
}

/**
 * Génère les métadonnées dynamiques pour les pages de catégorie de projets
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Attendre la résolution des paramètres s'ils sont une Promise
  const resolvedParams = await Promise.resolve(params)
  const { category } = resolvedParams

  const categoryTitle =
    category === 'black-and-white' ? 'Noir et Blanc' : 'Couleur'

  return {
    title: `Projets ${categoryTitle} | Photography Portfolio`,
    description: `Découvrez ma collection de projets photographiques en ${categoryTitle.toLowerCase()}.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  // Attendre la résolution des paramètres s'ils sont une Promise
  const resolvedParams = await Promise.resolve(params)
  const { category } = resolvedParams

  return <ClientCategoryPage category={category} />
}
