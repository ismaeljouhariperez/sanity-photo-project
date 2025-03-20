import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets Couleur | Photography Portfolio',
  description: 'Découvrez ma collection de projets photographiques en couleur.',
}

// Composant client séparé dans un autre fichier
import ClientPage from './client-page'

export default function ColorProjectsPage() {
  return <ClientPage />
}
