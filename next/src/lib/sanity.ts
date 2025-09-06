import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

if (!projectId || !dataset) {
  throw new Error('Missing Sanity configuration. Please check your environment variables.')
}

// Create client for data fetching
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for server-side rendering
})

// Create client for preview mode (if needed)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(source: any) {
  return builder.image(source)
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
    "featuredImage": photos[featured == true][0].asset,
    _createdAt
  }`,
  
  projectBySlug: `*[_type == "project" && slug.current == $slug && category == $category][0] {
    _id,
    title,
    slug,
    description,
    category,
    order,
    coverImage,
    photos[] {
      _key,
      asset->,
      caption,
      order
    },
    _createdAt,
    _updatedAt
  }`,
  
  siteSettings: `*[_type == "siteSettings"][0] {
    title,
    description,
    ogImage
  }`,
  
  collections: `*[_type == "collection"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    order
  }`
}

// Type-safe fetch functions
export async function getProjects(category?: string) {
  return client.fetch(queries.projects, { category })
}

export async function getProjectBySlug(slug: string, category: string) {
  return client.fetch(queries.projectBySlug, { slug, category })
}

export async function getSiteSettings() {
  return client.fetch(queries.siteSettings)
}

export async function getCollections() {
  return client.fetch(queries.collections)
}