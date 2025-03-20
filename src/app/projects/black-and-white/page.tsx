// metadata.ts - export statique des métadonnées
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets N&B | Photography Portfolio',
  description:
    'Découvrez ma collection de projets photographiques en noir et blanc.',
}

// Composant client séparé dans un autre fichier
import ClientPage from './client-page'

export default function BWProjectsPage() {
  return <ClientPage />
}
