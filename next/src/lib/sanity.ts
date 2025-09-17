import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from './sanity.types'
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

// GROQ queries
export const queries = {
  projects: `*[_type == "project" && (!defined($category) || category == $category)] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    description,
    category,
    order,
    coverImage,
    featuredImage,
    _createdAt,
    "imageCount": count(images)
  }`,
  
  projectBySlug: `*[_type == "project" && slug.current == $slug && category == $category][0] {
    _id,
    title,
    slug,
    description,
    category,
    order,
    coverImage,
    seo,
    images[] {
      _key,
      image,
      title,
      description,
      order
    },
    _createdAt,
    _updatedAt
  }`,
  
  siteSettings: `*[_type == "siteSettings"][0] {
    title,
    description,
    keywords,
    author,
    siteUrl,
    seo,
    logo
  }`,
  
  collections: `*[_type == "collection"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    order
  }`
}

// High-performance fetch functions with Next.js 15.5+ optimized caching and React cache() deduplication
const cachedClientFetch = cache(client.fetch.bind(client))

export async function getProjects(category?: string) {
  return cachedClientFetch(
    queries.projects, 
    { category },
    { 
      next: { 
        revalidate: 600, // 10 minutes cache for better performance
        tags: ['projects', `category:${category || 'all'}`, 'portfolio-content'] 
      }
    }
  )
}

export async function getProjectBySlug(slug: string, category: string) {
  return cachedClientFetch(
    queries.projectBySlug, 
    { slug, category },
    { 
      next: { 
        revalidate: 1800, // 30 minutes cache for project details
        tags: [`project:${slug}`, `category:${category}`, 'portfolio-content'] 
      }
    }
  )
}

export async function getSiteSettings() {
  return cachedClientFetch(
    queries.siteSettings,
    {},
    { 
      next: { 
        revalidate: 3600, // 1 hour cache
        tags: ['site-settings'] 
      }
    }
  )
}

export async function getCollections() {
  return client.fetch(
    queries.collections,
    {},
    { 
      next: { 
        revalidate: 1800, // 30 minutes cache
        tags: ['collections'] 
      }
    }
  )
}

