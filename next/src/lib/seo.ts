import { Metadata } from 'next'
import { CATEGORIES, CategoryType, getCategoryFrenchLabel } from './constants'

/**
 * SEO Configuration for Photography Portfolio
 * Hardcoded for optimal performance - no API calls needed
 */
export const siteMetadata = {
  title: 'Ismael Perez León - Photographie Analogique',
  description: "Portfolio de photographie analogique d'Ismael Perez León présentant des collections en noir et blanc et en couleur. Découvrez l'art de la photographie argentique à travers des projets personnels et artistiques.",
  author: 'Ismael Perez León',
  siteUrl: 'https://ismaelperezleon.com',
  keywords: [
    'photographie analogique',
    'photographie argentique', 
    'noir et blanc',
    'early color',
    'portfolio photographique',
    'photographie artistique',
    'film photography',
    'analog photography',
    'Ismael Perez León'
  ],
  openGraph: {
    type: 'website' as const,
    locale: 'fr_FR',
    siteName: 'Ismael Perez León Photography',
    image: '/images/og-default.jpg'
  },
  twitter: {
    card: 'summary_large_image' as const,
    creator: '@ismaelperezleon', // Update with actual handle if exists
  }
} as const

export interface ProjectData {
  title: string
  description?: string
  category?: CategoryType
  slug?: string
  coverImage?: string // Sanity image URL
}

/**
 * Generate metadata for project pages
 */
export function generateProjectMetadata(project: ProjectData): Metadata {
  const categoryLabel = project.category ? getCategoryFrenchLabel(project.category) : 'Photographie'
  const title = `${project.title} - ${categoryLabel} | ${siteMetadata.title}`
  
  const description = project.description 
    ? `${project.description} - Collection ${categoryLabel} de photographie argentique.`
    : `Projet ${categoryLabel} de photographie argentique par ${siteMetadata.author}.`

  const keywords = [
    ...siteMetadata.keywords,
    categoryLabel.toLowerCase(),
    project.category === CATEGORIES.MONOCHROME ? 'photographie noir et blanc' : 'photographie couleur vintage'
  ]

  const url = `${siteMetadata.siteUrl}/${project.category}/${project.slug}`
  const ogImageUrl = project.coverImage || `${siteMetadata.siteUrl}${siteMetadata.openGraph.image}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,

    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: siteMetadata.openGraph.siteName,
      locale: siteMetadata.openGraph.locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },

    twitter: {
      card: siteMetadata.twitter.card,
      title,
      description,
      images: [ogImageUrl],
      creator: siteMetadata.twitter.creator,
    },

    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  category: CategoryType
): Metadata {
  const categoryLabel = getCategoryFrenchLabel(category)
  const title = `Photographie ${categoryLabel} | ${siteMetadata.title}`
  const description = `Découvrez la collection ${categoryLabel.toLowerCase()} de photographie analogique. ${getCategoryDescription(category)}`

  const keywords = [
    ...siteMetadata.keywords,
    categoryLabel.toLowerCase(),
    category === CATEGORIES.MONOCHROME 
      ? 'photographie noir et blanc'
      : 'photographie couleur vintage'
  ]

  const url = `${siteMetadata.siteUrl}/${category}`
  const ogImageUrl = `${siteMetadata.siteUrl}/images/og-${category}.jpg`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: siteMetadata.author }],

    openGraph: {
      type: siteMetadata.openGraph.type,
      title,
      description,
      url,
      siteName: siteMetadata.openGraph.siteName,
      locale: siteMetadata.openGraph.locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Collection ${categoryLabel}`,
        },
      ],
    },

    twitter: {
      card: siteMetadata.twitter.card,
      title,
      description,
      images: [ogImageUrl],
      creator: siteMetadata.twitter.creator,
    },

    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate metadata for home page
 */
export function generateHomeMetadata(): Metadata {
  const ogImageUrl = `${siteMetadata.siteUrl}${siteMetadata.openGraph.image}`

  return {
    title: siteMetadata.title,
    description: siteMetadata.description,
    keywords: siteMetadata.keywords.join(', '),
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,

    openGraph: {
      type: siteMetadata.openGraph.type,
      title: siteMetadata.title,
      description: siteMetadata.description,
      url: siteMetadata.siteUrl,
      siteName: siteMetadata.openGraph.siteName,
      locale: siteMetadata.openGraph.locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteMetadata.title,
        },
      ],
    },

    twitter: {
      card: siteMetadata.twitter.card,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [ogImageUrl],
      creator: siteMetadata.twitter.creator,
    },

    alternates: {
      canonical: siteMetadata.siteUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    metadataBase: new URL(siteMetadata.siteUrl),
  }
}

// Helper functions

function getCategoryDescription(
  category: CategoryType
): string {
  switch (category) {
    case CATEGORIES.MONOCHROME:
      return "Une exploration intemporelle de la lumière, du contraste et de l'émotion à travers la photographie argentique noir et blanc."
    case 'early-color':
      return 'Découvrez la beauté nostalgique des premières techniques de photographie couleur et leur esthétique vintage unique.'
    default:
      return 'Collection de photographies analogiques.'
  }
}
