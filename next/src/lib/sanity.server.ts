import { createClient } from 'next-sanity'
import type { SanityClient } from 'next-sanity'
import { Project } from './sanity.types'

// Créer un client Sanity pour une utilisation côté serveur
export function getServerClient(): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5ynkrt2t',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    useCdn: process.env.NODE_ENV === 'production',
  })
}

// Récupérer tous les chemins de projets pour la génération statique
export async function getAllProjectPaths() {
  const client = getServerClient()
  const projects = await client.fetch<Project[]>(
    `*[_type == "project"] {
      "slug": slug.current,
      "category": category
    }`
  )

  return projects.map((project) => ({
    params: {
      category: project.category,
      slug: project.slug,
    },
  }))
}

// Récupérer tous les slugs de projets pour une catégorie spécifique
export async function getProjectsByCategoryForStaticProps(category: string) {
  const client = getServerClient()
  const projects = await client.fetch<Project[]>(
    `*[_type == "project" && category == $category] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      category,
      "coverImage": coverImage.asset->url
    }`,
    { category }
  )

  return projects
}

// Récupérer un projet spécifique par slug et catégorie
export async function getProjectBySlugForStaticProps(
  slug: string,
  category: string
) {
  const client = getServerClient()
  const project = await client.fetch<Project>(
    `*[_type == "project" && slug.current == $slug && category == $category][0] {
      _id,
      title,
      slug,
      description,
      category,
      "coverImage": coverImage.asset->url,
      "photos": photos[]->{ 
        _id, 
        title, 
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions,
        alt,
        description,
        tags
      }
    }`,
    { slug, category }
  )

  return project
}
