import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {
  Collection,
  Photo,
  Project,
  SanityImage,
  SiteSettings,
} from '@/lib/sanity.types'

// Définir la constante localement pour éviter les dépendances circulaires
export const SANITY_CACHE_CLEAR_EVENT = 'clear-sanity-cache'

export interface ISanityService {
  fetchProjects(category?: string): Promise<Project[]>
  fetchProjectBySlug(slug: string, category: string): Promise<Project>
  fetchPhotos(projectId: string): Promise<Photo[]>
  fetchSiteSettings(): Promise<SiteSettings>
  fetchCollections(active?: boolean): Promise<Collection[]>
  urlFor(
    source: SanityImage
  ): ReturnType<typeof imageUrlBuilder.prototype.image>
}

// Cache des requêtes pour éviter des appels répétés à l'API
const cache = new Map()
// Tracker les requêtes en cours
const pendingRequests = new Map()
// Tracker si l'écouteur d'événement a déjà été ajouté
let eventListenerAdded = false

// Si on est dans un environnement client (navigateur)
if (typeof window !== 'undefined' && !eventListenerAdded) {
  // Écouter l'événement de nettoyage de cache au changement de route
  window.addEventListener(SANITY_CACHE_CLEAR_EVENT, () => {
    console.log(
      '🧹 Nettoyage du cache Sanity - Requêtes pendantes:',
      pendingRequests.size,
      'Entrées en cache:',
      cache.size
    )

    // Ne vider que les requêtes liées aux projets pour garder les settings et autres
    const keysToRemove: string[] = []

    cache.forEach((_, key) => {
      if (
        key.includes('project') ||
        key.includes('black-and-white') ||
        key.includes('early-color')
      ) {
        keysToRemove.push(key)
      }
    })

    // Supprimer les entrées de cache liées aux projets
    keysToRemove.forEach((key) => cache.delete(key))

    console.log('✅ Cache nettoyé - Entrées restantes:', cache.size)
  })

  // Marquer que l'écouteur a été ajouté
  eventListenerAdded = true
}

export class SanityAdapter implements ISanityService {
  private client
  private builder

  constructor() {
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5ynkrt2t',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: process.env.NODE_ENV === 'production',
      // Utiliser un token si disponible
      token: process.env.SANITY_API_TOKEN || undefined,
    })

    this.builder = imageUrlBuilder(this.client)
  }

  urlFor(source: SanityImage) {
    return this.builder.image(source as SanityImageSource)
  }

  async fetchWithCache<T>(query: string, params?: any): Promise<T> {
    const cacheKey = JSON.stringify({ query, params })

    // Si la requête est déjà dans le cache, retourner le résultat mis en cache
    if (cache.has(cacheKey)) {
      console.log('🔵 Résultat récupéré du cache')
      return cache.get(cacheKey)
    }

    // Si la même requête est déjà en cours, attendre son résultat au lieu d'en créer une nouvelle
    if (pendingRequests.has(cacheKey)) {
      console.log('🟡 Requête déjà en cours, attente du résultat...')
      return pendingRequests.get(cacheKey)
    }

    // Créer une nouvelle promesse pour cette requête
    const requestPromise = (async () => {
      try {
        console.log('🟢 Nouvelle requête Sanity')
        const result = await this.client.fetch<T>(query, params)

        // Stocker le résultat dans le cache
        cache.set(cacheKey, result)

        // La requête est terminée, la supprimer des requêtes en cours
        pendingRequests.delete(cacheKey)

        return result
      } catch (error) {
        // En cas d'erreur, supprimer également la requête des requêtes en cours
        pendingRequests.delete(cacheKey)
        console.error('Sanity fetch error:', error)
        throw error
      }
    })()

    // Enregistrer cette promesse comme requête en cours
    pendingRequests.set(cacheKey, requestPromise)

    return requestPromise
  }

  async fetchProjects(category?: string): Promise<Project[]> {
    const fetchId = Math.floor(Math.random() * 10000)
    console.log(`Fetching projects for category: ${category} [ID:${fetchId}]`)

    const query = `*[_type == "project"${
      category ? ` && category == "${category}"` : ''
    }] | order(order asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      category,
      coverImage,
      order
    }`

    try {
      const result = await this.fetchWithCache<Project[]>(query)
      console.log(
        `Fetch complete for category: ${category} [ID:${fetchId}] - Results: ${
          result?.length || 0
        }`
      )
      return result
    } catch (error) {
      console.error(
        `Fetch failed for category: ${category} [ID:${fetchId}]`,
        error
      )
      throw error
    }
  }

  async fetchProjectBySlug(slug: string, category: string): Promise<Project> {
    const query = `*[_type == "project" && slug.current == $slug && category == $category][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      category,
      coverImage,
      order,
      "photos": photos[]->{ 
        _id, 
        _type,
        _createdAt,
        _updatedAt,
        title, 
        image,
        alt,
        description,
        order,
        tags,
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    }`

    return this.fetchWithCache(query, { slug, category })
  }

  async fetchPhotos(projectId: string): Promise<Photo[]> {
    const query = `*[_type == "project" && _id == $projectId][0] {
      "photos": photos[]->{ 
        _id, 
        _type,
        _createdAt,
        _updatedAt,
        title, 
        image,
        alt,
        description,
        order,
        tags,
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    }`

    const result = await this.fetchWithCache<{ photos?: Photo[] }>(query, {
      projectId,
    })
    return result?.photos || []
  }

  async fetchSiteSettings(): Promise<SiteSettings> {
    const query = `*[_type == "siteSettings"][0]`
    return this.fetchWithCache(query)
  }

  async fetchCollections(active?: boolean): Promise<Collection[]> {
    const query = `*[_type == "collection"${
      active ? ' && active == true' : ''
    }] | order(order asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      coverImage,
      order,
      active,
      "projects": projects[]->{ 
        _id, 
        _type,
        title,
        slug,
        category,
        coverImage,
        order
      }
    }`

    return this.fetchWithCache(query)
  }
}
