import { createClient } from 'next-sanity'

export interface ISanityService {
  fetchProjects(category?: string): Promise<any[]>
  fetchProjectBySlug(slug: string, category: string): Promise<any>
  fetchPhotos(projectId: string): Promise<any[]>
}

export class SanityAdapter implements ISanityService {
  private client

  constructor() {
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5ynkrt2t',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: process.env.NODE_ENV === 'production',
    })
  }

  async fetchProjects(category?: string): Promise<any[]> {
    const query = `*[_type == "project"${
      category ? ` && category == "${category}"` : ''
    }] | order(order asc) {
      _id,
      title,
      slug,
      description,
      category,
      "coverImage": coverImage.asset->url
    }`

    return this.client.fetch(query)
  }

  async fetchProjectBySlug(slug: string, category: string): Promise<any> {
    const query = `*[_type == "project" && slug.current == $slug && category == $category][0] {
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
        "dimensions": image.asset->metadata.dimensions
      }
    }`

    return this.client.fetch(query, { slug, category })
  }

  async fetchPhotos(projectId: string): Promise<any[]> {
    const query = `*[_type == "project" && _id == $projectId][0] {
      "photos": photos[]->{ 
        _id, 
        title, 
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    }`

    return this.client
      .fetch(query, { projectId })
      .then((result) => result?.photos || [])
  }
}
