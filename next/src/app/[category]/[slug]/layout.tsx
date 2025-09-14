import { ReactNode } from 'react'

interface ProjectDetailLayoutProps {
  children: ReactNode
}

/**
 * Layout specific to project detail pages
 * Modern Next.js 15+ pattern - separate from category listing
 */
export default function ProjectDetailLayout({
  children,
}: ProjectDetailLayoutProps) {
  return <div className="project-detail-layout bg-cream">{children}</div>
}
