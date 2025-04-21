import { Metadata } from 'next'
import CategoryClient from '@/app/components/CategoryClient'

/**
 * Métadonnées pour la page Noir et Blanc
 */
export const metadata: Metadata = {
  title: 'Projets Noir et Blanc | Photography Portfolio',
  description:
    'Découvrez ma collection de projets photographiques en noir et blanc.',
}

/**
 * Page principale Noir et Blanc qui affiche tous les projets de cette catégorie
 */
export default function BlackAndWhitePage() {
  return <CategoryClient category="black-and-white" />
}
