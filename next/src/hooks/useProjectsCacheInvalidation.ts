'use client'

import { useCallback } from 'react'
import { invalidateProjectsCache } from '@/adapters/sanity'
import { useProjectsStore } from '@/store'

/**
 * Hook pour invalider le cache des projets et forcer un rechargement
 * @returns Fonctions pour gérer l'invalidation et le rechargement du cache des projets
 */
export function useProjectsCacheInvalidation() {
  const { loadProjects, activeCategory } = useProjectsStore()

  /**
   * Invalide le cache et recharge les données pour une catégorie spécifique
   * @param category La catégorie à invalider et recharger, ou undefined pour la catégorie active
   */
  const invalidateAndReload = useCallback(
    (category?: 'black-and-white' | 'early-color') => {
      const targetCategory = category || activeCategory

      if (!targetCategory) {
        console.warn("Aucune catégorie active pour l'invalidation du cache")
        return
      }

      // Invalider le cache
      invalidateProjectsCache(targetCategory)

      // Forcer le rechargement des données
      loadProjects(targetCategory, true)
    },
    [activeCategory, loadProjects]
  )

  /**
   * Invalide le cache pour toutes les catégories
   */
  const invalidateAllCategories = useCallback(() => {
    // Invalider le cache pour toutes les catégories
    invalidateProjectsCache()

    // Si une catégorie est active, recharger ses données
    if (activeCategory) {
      loadProjects(activeCategory, true)
    }
  }, [activeCategory, loadProjects])

  return {
    invalidateAndReload,
    invalidateAllCategories,
  }
}

export default useProjectsCacheInvalidation
