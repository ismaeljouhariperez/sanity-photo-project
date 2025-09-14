import { ReactNode } from 'react'

interface CategoryListLayoutProps {
  children: ReactNode
}

/**
 * Layout specific to category listing pages
 * Modern Next.js 15+ pattern using route groups
 */
export default function CategoryListLayout({
  children,
}: CategoryListLayoutProps) {
  return (
    <div className="category-list-layout min-h-screen">
      {children}
    </div>
  )
}