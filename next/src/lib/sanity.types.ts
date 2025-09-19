import { CategoryType } from './constants'

// Base type for Sanity documents
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Base type for Sanity images
export interface SanityImage {
  _type: 'image'
  _key?: string
  asset: {
    _ref: string
    _type: 'reference'
  }
  crop?: {
    _type: 'sanity.imageCrop'
    bottom: number
    left: number
    right: number
    top: number
  }
  hotspot?: {
    _type: 'sanity.imageHotspot'
    height: number
    width: number
    x: number
    y: number
  }
  alt?: string
  title?: string
  description?: string
  tags?: string[]
  metadata?: {
    dimensions?: {
      width: number
      height: number
      aspectRatio: number
    }
    palette?: {
      dominant?: {
        background?: string
        foreground?: string
      }
      [key: string]: unknown
    }
    lqip?: string
  }
}

// Base type for Sanity slug
export interface SanitySlug {
  _type: 'slug'
  current: string
}

// Photo type
export interface Photo extends SanityDocument {
  _type: 'photo'
  title: string
  image: SanityImage
  alt?: string
  slug?: SanitySlug
  description?: string
  tags?: string[]
  order?: number
  featured?: boolean
  shotDate?: string
  url?: string // Processed URL for the frontend
  dimensions?: {
    width: number
    height: number
    aspectRatio: number
  }
}

// Project images are now simple SanityImage arrays (simplified schema)

// Project type
export interface Project extends SanityDocument {
  _type: 'project'
  title: string
  slug: SanitySlug
  description?: string
  coverImage: SanityImage
  category: CategoryType
  images?: SanityImage[]
  featuredImage?: SanityImage
  order?: number
  normalizedSlug?: string // Version normalisée du slug pour les animations
  imageCount?: number // Computed field from GROQ query
}

// Collection type
export interface Collection extends SanityDocument {
  _type: 'collection'
  title: string
  slug: SanitySlug
  description?: string
  coverImage?: SanityImage
  projects?: Project[]
  order?: number
  active?: boolean
}

// Site Settings type
export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  description: string
  keywords?: string[]
  author?: string
  logo?: SanityImage
  socialLinks?: {
    platform:
      | 'instagram'
      | 'twitter'
      | 'facebook'
      | 'linkedin'
      | 'behance'
      | 'other'
    url: string
    label?: string
  }[]
  mainNavigation?: {
    text: string
    url: string
  }[]
}
