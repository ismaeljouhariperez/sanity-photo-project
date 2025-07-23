import React from 'react'
import SharedProjectsLayout from '@/components/ui/SharedProjectsLayout'

/**
 * Layout pour les pages Couleur
 * Utilise le layout partagé pour maintenir l'état des projets
 */
export default function EarlyColorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SharedProjectsLayout>{children}</SharedProjectsLayout>
}
