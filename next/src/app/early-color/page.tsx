import { Metadata } from 'next'
import CategoryClient from '@/app/components/CategoryClient'

/**
 * Métadonnées pour la page Couleur
 */
export const metadata: Metadata = {
  title: 'Projets Couleur | Photography Portfolio',
  description: 'Découvrez ma collection de projets photographiques en couleur.',
}

/**
 * Page principale Couleur qui affiche tous les projets de cette catégorie
 */
export default function EarlyColorPage() {
  return <CategoryClient category="early-color" />
}
