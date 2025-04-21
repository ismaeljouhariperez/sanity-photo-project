import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {
  Project,
  Photo,
  SiteSettings,
  Collection,
} from '@/lib/sanity.types'

// Déclaration de ProjectFull qui étend Project avec des photos
interface ProjectFull extends Project {
  photos?: Photo[]
}

export interface ISanityService {
  fetchProjects(category?: string): Promise<Project[]>
  fetchProjectBySlug(slug: string, category: string): Promise<ProjectFull>
  fetchPhotos(): Promise<Photo[]>
  fetchSiteSettings(): Promise<SiteSettings>
  fetchCollections(): Promise<Collection[]>
}

// Constante pour l'événement de nettoyage du cache
export const SANITY_CACHE_CLEAR_EVENT = 'SANITY_CACHE_CLEAR_EVENT'

// Clés de cache
const CACHE_KEYS = {
  PROJECTS: 'projects',
  PROJECT_DETAIL: 'project_detail',
  PHOTOS: 'photos',
  SITE_SETTINGS: 'site_settings',
  COLLECTIONS: 'collections',
}

// Configuration de Sanity
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2022-03-25'

// Cache côté client, avec TTL et préservation pour les projets
type CacheEntry<T> = {
  data: T
  timestamp: number
  category?: string // Pour les entrées de projets
  ttl: number // Temps de vie en ms
}

type PendingRequest = {
  promise: Promise<unknown>
  controllers: AbortController[]
}

// Interface pour l'événement personnalisé
interface SanityCacheClearEvent extends Event {
  detail?: {
    path?: string
    key?: string // pour invalider une clé spécifique
  }
}

// Classe de cache client
class ClientCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private pendingRequests = new Map<string, PendingRequest>()
  private readonly DEFAULT_TTL = 2 * 60 * 1000 // 2 minutes par défaut (réduit)
  private readonly PROJECT_TTL = 5 * 60 * 1000 // 5 minutes pour les projets (réduit)

  constructor() {
    // Écouteur d'événement pour le nettoyage du cache
    if (typeof window !== 'undefined') {
      window.addEventListener(SANITY_CACHE_CLEAR_EVENT, ((
        e: SanityCacheClearEvent
      ) => {
        if (e.detail?.key) {
          // Invalider une clé spécifique
          this.invalidateKey(e.detail.key)
        } else {
          // Sinon, comportement habituel
          this.handleCacheClearing(e.detail?.path || '')
        }
      }) as EventListener)
    }
  }

  // Invalider une clé spécifique ou un pattern de clés
  invalidateKey(keyPattern: string) {
    console.log(`🔑 Invalidation du cache pour: ${keyPattern}`)

    // Si la clé contient un wildcard, on invalide toutes les clés qui correspondent
    if (keyPattern.includes('*')) {
      const regex = new RegExp(`^${keyPattern.replace('*', '.*')}$`)

      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          console.log(`  ↪ Suppression de: ${key}`)
          this.cache.delete(key)
        }
      }
    } else if (this.cache.has(keyPattern)) {
      // Sinon on invalide juste la clé spécifique
      this.cache.delete(keyPattern)
      console.log(`  ↪ Clé supprimée`)
    }
  }

  // Méthode intelligente pour décider quel cache nettoyer
  private handleCacheClearing(path: string) {
    // Ne pas vider tout le cache si on passe d'un projet à un autre
    const isProjectsPath = path.includes('/projects/')

    // Si c'est un changement entre projets, conserver le cache des projets
    if (isProjectsPath) {
      console.log('🔄 Préservation du cache des projets pendant la transition')
      // Ne supprimer que les entrées non-projets si nécessaire
      // this.clearNonProjectCache()
    } else {
      console.log('🧹 Nettoyage complet du cache Sanity')
      this.clear() // Vider tout le cache pour les autres navigations
    }
  }

  // Nettoyer le cache non-projets
  private clearNonProjectCache() {
    for (const [key] of this.cache.entries()) {
      if (
        !key.startsWith(CACHE_KEYS.PROJECTS) &&
        !key.startsWith(CACHE_KEYS.PROJECT_DETAIL)
      ) {
        this.cache.delete(key)
      }
    }
  }

  // Vider le cache complet
  clear() {
    this.cache.clear()

    // Annuler toutes les requêtes en cours
    for (const { controllers } of this.pendingRequests.values()) {
      controllers.forEach((controller) => {
        try {
          if (controller && !controller.signal.aborted) {
            controller.abort()
          }
        } catch (error) {
          console.error("Erreur lors de l'annulation d'une requête:", error)
        }
      })
    }
    this.pendingRequests.clear()
  }

  // Obtenir une entrée du cache avec gestion de l'expiration
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    // Si pas dans le cache ou expiré
    if (!entry || Date.now() - entry.timestamp > entry.ttl) {
      if (entry) {
        this.cache.delete(key)
      }
      return null
    }

    return entry.data as T
  }

  // Mettre en cache une entrée avec TTL
  set<T>(key: string, data: T, category?: string): void {
    // Utiliser un TTL plus long pour les projets
    const ttl =
      key.startsWith(CACHE_KEYS.PROJECTS) ||
      key.startsWith(CACHE_KEYS.PROJECT_DETAIL)
        ? this.PROJECT_TTL
        : this.DEFAULT_TTL

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      category,
      ttl,
    })
  }

  // Gérer les requêtes en cours pour éviter les doublons
  async getOrCreateRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    category?: string
  ): Promise<T> {
    // Vérifier le cache d'abord
    const cachedData = this.get<T>(key)
    if (cachedData) {
      return cachedData
    }

    // Si une requête est déjà en cours pour cette clé, renvoyer sa promesse
    const pendingRequest = this.pendingRequests.get(key)
    if (pendingRequest) {
      // Ajouter un nouveau contrôleur pour cette demande existante
      const controller = new AbortController()
      pendingRequest.controllers.push(controller)
      return pendingRequest.promise as T
    }

    // Créer un nouveau contrôleur pour cette requête
    const controller = new AbortController()

    // Créer et mémoriser la nouvelle requête
    const request = async () => {
      try {
        const result = await requestFn()
        // Mettre en cache le résultat
        this.set(key, result, category)
        return result
      } finally {
        // Nettoyer la requête en cours
        this.pendingRequests.delete(key)
      }
    }

    const promise = request()
    this.pendingRequests.set(key, { promise, controllers: [controller] })

    return promise as T
  }
}

// Instance unique du cache
const clientCache = new ClientCache()

// Classe d'adaptateur pour Sanity
export class SanityAdapter implements ISanityService {
  private client
  private builder

  constructor() {
    this.client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })

    this.builder = imageUrlBuilder(this.client)
  }

  // Récupérer tous les projets, filtré par catégorie
  async fetchProjects(category?: string): Promise<Project[]> {
    const cacheKey = category
      ? `${CACHE_KEYS.PROJECTS}_${category}`
      : CACHE_KEYS.PROJECTS

    return clientCache.getOrCreateRequest(
      cacheKey,
      async () => {
        const query = category
          ? `*[_type == "project" && category == $category] | order(order)`
          : `*[_type == "project"] | order(order)`

        const params = category ? { category } : {}
        const data = await this.client.fetch(query, params)
        return data
      },
      category
    )
  }

  // Récupérer un projet par slug et catégorie
  async fetchProjectBySlug(
    slug: string,
    category: string
  ): Promise<ProjectFull> {
    const cacheKey = `${CACHE_KEYS.PROJECT_DETAIL}_${category}_${slug}`
    console.log(
      `Récupération du projet par slug: ${slug}, catégorie: ${category}`
    )

    // Désactiver le cache pour le débogage
    clientCache.invalidateKey(cacheKey)

    return clientCache.getOrCreateRequest(
      cacheKey,
      async () => {
        // Requête simplifiée pour récupérer le projet avec ses images intégrées
        const query = `*[_type == "project" && slug.current == $slug && category == $category][0]{
          ...,
          "coverImage": coverImage.asset->url,
          "images": images[] {
            "url": image.asset->url,
            "width": image.asset->metadata.dimensions.width,
            "height": image.asset->metadata.dimensions.height,
            "alt": title,
            title,
            description,
            order
          }
        }`

        console.log(
          `Exécution de la requête GROQ pour images intégrées: ${query}`
        )
        console.log(`Avec les paramètres:`, { slug, category })

        try {
          const project = await this.client.fetch(query, { slug, category })
          console.log(`Projet récupéré:`, project)

          if (!project) {
            console.error('Projet non trouvé')
            return null
          }

          // Convertir les images intégrées en format Photo pour maintenir la compatibilité
          const photos =
            project.images?.map((img: any, index: number) => {
              // Vérification et debugging des propriétés d'image
              if (!img.url) {
                console.error(`Image ${index} sans URL:`, img)
              }

              return {
                _id: `embedded-image-${index}`,
                _type: 'photo',
                title: img.title || `Image ${index + 1}`,
                description: img.description,
                url: img.url,
                alt: img.alt || img.title || `Image ${index + 1}`,
                order: img.order || index,
                dimensions: {
                  width: img.width || 0,
                  height: img.height || 0,
                  aspectRatio:
                    img.width && img.height ? img.width / img.height : 1.5,
                },
              }
            }) || []

          // Filtrer les photos sans URL
          const validPhotos = photos.filter((photo: any) => Boolean(photo.url))

          console.log(`Images converties en photos:`, photos)
          console.log(
            `Photos valides avec URL: ${validPhotos.length}/${photos.length}`
          )

          // Créer un objet ProjectFull compatible
          const result = {
            ...project,
            photos: validPhotos, // Utiliser uniquement les photos avec URL valide
          }

          console.log(`Résultat final:`, result)
          if (result?.photos) {
            console.log(`Photos trouvées: ${result.photos.length}`)
            if (result.photos.length > 0) {
              console.log(`Première photo:`, result.photos[0])
            }
          } else {
            console.log(`Pas de photos trouvées dans le projet.`)
          }

          return result
        } catch (error) {
          console.error(`Erreur lors de la récupération du projet:`, error)
          throw error
        }
      },
      category
    )
  }

  // Récupérer les photos, peut être utile pour faire un portfolio
  async fetchPhotos(): Promise<Photo[]> {
    return clientCache.getOrCreateRequest(CACHE_KEYS.PHOTOS, async () => {
      const query = `*[_type == "photo"] | order(order) {
          ...,
          "url": image.asset->url,
          "metadata": image.asset->metadata,
          "project": *[_type == "project" && _id == ^.project._ref][0] {
            title,
            slug,
            category
          }
        }`
      const data = await this.client.fetch(query)
      return data
    })
  }

  // Récupérer les paramètres du site
  async fetchSiteSettings(): Promise<SiteSettings> {
    return clientCache.getOrCreateRequest(
      CACHE_KEYS.SITE_SETTINGS,
      async () => {
        const query = `*[_type == "siteSettings"][0]`
        const data = await this.client.fetch(query)
        return data
      }
    )
  }

  // Récupérer les collections
  async fetchCollections(): Promise<Collection[]> {
    return clientCache.getOrCreateRequest(CACHE_KEYS.COLLECTIONS, async () => {
      const query = `*[_type == "collection"] | order(order) {
          ...,
          "photos": *[_type == "photo" && references(^._id)] | order(order) {
            ...,
            "url": image.asset->url,
            "metadata": image.asset->metadata
          }
        }`
      const data = await this.client.fetch(query)
      return data
    })
  }

  // Méthode utilitaire pour générer des URLs d'images
  urlFor(source: unknown) {
    return this.builder.image(source)
  }
}

// Création d'une instance de l'adaptateur
const sanityAdapter = new SanityAdapter()

/**
 * Fonction utilitaire pour invalider le cache des projets
 * @param category Catégorie spécifique à invalider, ou undefined pour invalider toutes les catégories
 */
export function invalidateProjectsCache(category?: string): void {
  if (typeof window === 'undefined') return

  const key = category
    ? `${CACHE_KEYS.PROJECTS}_${category}`
    : `${CACHE_KEYS.PROJECTS}*`

  const event = new CustomEvent(SANITY_CACHE_CLEAR_EVENT, {
    detail: { key },
  })

  window.dispatchEvent(event)
  console.log(
    `Cache invalidé pour les projets ${category || '(toutes catégories)'}`
  )
}

export default sanityAdapter
