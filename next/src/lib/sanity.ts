import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage, Project, Collection, SiteSettings } from './sanity.types'
import { cache } from 'react'

// Sanity configuration
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

if (!projectId || !dataset) {
  throw new Error('Missing Sanity configuration. Please check your environment variables.')
}

// Modern Sanity client with optimal performance configuration
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for SSG and ISR (recommended for Next.js)
  perspective: 'published', // Only published content
  // Disable stega for maximum performance
  stega: { enabled: false },
})

// Create client for preview mode (if needed)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
})

// Image URL builder with caching
const builder = imageUrlBuilder({ projectId, dataset })

// Cached URL generation to prevent duplicate requests
const cachedUrlFor = cache((source: SanityImage) => {
  return builder.image(source)
})

export function urlFor(source: SanityImage) {
  return cachedUrlFor(source)
}

/**
 * Optimized GROQ queries following 2025 best practices
 * - Fetch only what you need
 * - Shallow projections for performance
 * - Consistent field selection
 */
export const queries = {
  // Optimized projects list - minimal fields for listings
  projects: `*[_type == "project" && (!defined($category) || category == $category)] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    category,
    order,
    coverImage {
      _type,
      asset,
      crop,
      hotspot
    },
    "imageCount": count(images)
  }`,
  
  // Full project details with optimized image metadata
  projectBySlug: `*[_type == "project" && slug.current == $slug && category == $category][0] {
    _id,
    title,
    slug,
    description,
    category,
    order,
    coverImage {
      _type,
      asset,
      crop,
      hotspot,
      "alt": asset->altText,
      "metadata": asset->metadata
    },
    images[] {
      _type,
      _key,
      asset,
      crop,
      hotspot,
      "alt": asset->altText,
      "title": asset->opt.media.title,
      "description": asset->opt.media.description,
      "tags": asset->opt.media.tags[]->name.current,
      "metadata": asset->metadata
    }
  }`,
  
  // Minimal site settings - only essential fields
  siteSettings: `*[_type == "siteSettings"][0] {
    title,
    description,
    keywords,
    author,
    logo {
      _type,
      asset
    }
  }`,
  
  // Lightweight collections query
  collections: `*[_type == "collection"] | order(order asc) {
    _id,
    title,
    slug {
      current
    },
    order
  }`
}

/**
 * Modern Sanity integration following 2025 best practices
 * Using sanityFetch for centralized fetch with automatic caching
 */
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  revalidate = 600, // 10 minutes default for photography portfolio
  tags = [],
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number | false
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: 'force-cache',
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })
}

/**
 * Modern fetch functions using sanityFetch with optimized caching
 * Following 2025 best practices for photography portfolios
 */
export async function getProjects(category?: string): Promise<Project[]> {
  return sanityFetch<Project[]>({
    query: queries.projects,
    params: { category },
    revalidate: 600, // 10 minutes - good for project listings
    tags: ['projects', `category:${category || 'all'}`, 'portfolio-content']
  })
}

export async function getProjectBySlug(slug: string, category: string): Promise<Project | null> {
  return sanityFetch<Project | null>({
    query: queries.projectBySlug,
    params: { slug, category },
    revalidate: 1800, // 30 minutes - project details change less frequently
    tags: [`project:${slug}`, `category:${category}`, 'portfolio-content']
  })
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>({
    query: queries.siteSettings,
    params: {},
    revalidate: 3600, // 1 hour - site settings rarely change
    tags: ['site-settings']
  })
}

export async function getCollections(): Promise<Collection[]> {
  return sanityFetch<Collection[]>({
    query: queries.collections,
    params: {},
    revalidate: 1800, // 30 minutes
    tags: ['collections']
  })
}

