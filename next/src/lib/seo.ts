import { Metadata } from 'next'
import { urlFor } from './sanity'
import type { SanityImage } from './sanity.types'

// Site defaults - these can be fetched from Sanity siteSettings
const SITE_DEFAULTS = {
  title: 'Ismael Perez León | Portfolio Photographique',
  description:
    "Portfolio de photographie analogique d'Ismael Perez León présentant des collections en noir et blanc et en couleur. Découvrez l'art de la photographie argentique.",
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
  ],
  ogImage: '/images/og-default.jpg',
}

// Remove the local interface since we're importing it

export interface SEOData {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: SanityImage
  siteUrl?: string
  author?: string
}

export interface ProjectSEOData extends SEOData {
  category?: 'black-and-white' | 'early-color'
  slug?: string
  coverImage?: SanityImage
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
    keywords?: string[]
  }
}

/**
 * Generate metadata for project pages
 */
export function generateProjectMetadata(
  project: ProjectSEOData,
  siteSettings?: SEOData
): Metadata {
  const siteUrl = siteSettings?.siteUrl || SITE_DEFAULTS.siteUrl
  const author = siteSettings?.author || SITE_DEFAULTS.author

  // Use project SEO fields first, then fallback to project data, then site defaults
  const title =
    project.seo?.metaTitle ||
    `${project.title} | ${getCategoryLabel(project.category)}` ||
    siteSettings?.title ||
    SITE_DEFAULTS.title

  const description =
    project.seo?.metaDescription ||
    project.description ||
    `Découvrez le projet photographique "${project.title}" dans la collection ${getCategoryLabel(project.category)}` ||
    siteSettings?.description ||
    SITE_DEFAULTS.description

  // Combine keywords: project SEO > project tags > site keywords > defaults
  const keywords = [
    ...(project.seo?.keywords || []),
    ...(siteSettings?.keywords || []),
    ...SITE_DEFAULTS.keywords,
    getCategoryLabel(project.category).toLowerCase(),
  ].filter(Boolean)

  // Choose best image: project SEO OG > project cover > site OG > default
  const ogImage =
    project.seo?.ogImage || project.coverImage || siteSettings?.ogImage
  const ogImageUrl = ogImage
    ? urlFor(ogImage).width(1200).height(630).quality(90).url()
    : `${siteUrl}${SITE_DEFAULTS.ogImage}`

  const url = `${siteUrl}/${project.category}/${project.slug}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,

    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: siteSettings?.title || SITE_DEFAULTS.title,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title || title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: `@${author.replace(/\s+/g, '').toLowerCase()}`, // Simple conversion
    },

    alternates: {
      canonical: url,
    },

    other: {
      'article:author': author,
      'article:section': getCategoryLabel(project.category),
    },
  }
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  category: 'black-and-white' | 'early-color',
  siteSettings?: SEOData
): Metadata {
  const siteUrl = siteSettings?.siteUrl || SITE_DEFAULTS.siteUrl
  const author = siteSettings?.author || SITE_DEFAULTS.author
  const categoryLabel = getCategoryLabel(category)

  const title = `${categoryLabel} | ${siteSettings?.title || SITE_DEFAULTS.title}`
  const description = `Découvrez la collection ${categoryLabel.toLowerCase()} de notre portfolio de photographie analogique. ${getCategoryDescription(category)}`

  const keywords = [
    ...(siteSettings?.keywords || []),
    ...SITE_DEFAULTS.keywords,
    categoryLabel.toLowerCase(),
    category === 'black-and-white'
      ? 'photographie noir et blanc'
      : 'photographie couleur vintage',
  ]

  const url = `${siteUrl}/${category}`
  const ogImageUrl = `${siteUrl}/images/og-${category}.jpg` // Category-specific OG images

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],

    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: siteSettings?.title || SITE_DEFAULTS.title,
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
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },

    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate metadata for home page
 */
export function generateHomeMetadata(siteSettings?: SEOData): Metadata {
  const siteUrl = siteSettings?.siteUrl || SITE_DEFAULTS.siteUrl
  const author = siteSettings?.author || SITE_DEFAULTS.author

  const title = siteSettings?.title || SITE_DEFAULTS.title
  const description = siteSettings?.description || SITE_DEFAULTS.description
  const keywords = [
    ...(siteSettings?.keywords || []),
    ...SITE_DEFAULTS.keywords,
  ]

  const ogImageUrl = siteSettings?.ogImage
    ? urlFor(siteSettings.ogImage).width(1200).height(630).quality(90).url()
    : `${siteUrl}${SITE_DEFAULTS.ogImage}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,

    openGraph: {
      type: 'website',
      title,
      description,
      url: siteUrl,
      siteName: title,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },

    alternates: {
      canonical: siteUrl,
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

    verification: {
      // Add your verification IDs here
      // google: 'your-google-verification-id',
    },
  }
}

// Helper functions
function getCategoryLabel(category?: string): string {
  switch (category) {
    case 'black-and-white':
      return 'Noir et Blanc'
    case 'early-color':
      return 'Early Color'
    default:
      return 'Photographie'
  }
}

function getCategoryDescription(
  category: 'black-and-white' | 'early-color'
): string {
  switch (category) {
    case 'black-and-white':
      return "Une exploration intemporelle de la lumière, du contraste et de l'émotion à travers la photographie argentique noir et blanc."
    case 'early-color':
      return 'Découvrez la beauté nostalgique des premières techniques de photographie couleur et leur esthétique vintage unique.'
    default:
      return 'Collection de photographies analogiques.'
  }
}
