import { Metadata } from 'next'
import ClientCategoryPage from './client-page'

type Props = {
  params: Promise<{ category: 'black-and-white' | 'early-color' }>
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Attendre l'objet params entier
  const resolvedParams = await params
  const category = resolvedParams.category

  const categoryTitle =
    category === 'black-and-white' ? 'Noir et Blanc' : 'Couleur'

  return {
    title: `Projets ${categoryTitle} | Photography Portfolio`,
    description: `Découvrez ma collection de projets photographiques en ${categoryTitle.toLowerCase()}.`,
  }
}

// Page des projets par catégorie
export default async function CategoryPage({ params }: Props) {
  // Attendre l'objet params entier
  const resolvedParams = await params
  const category = resolvedParams.category

  return <ClientCategoryPage category={category} />
}
