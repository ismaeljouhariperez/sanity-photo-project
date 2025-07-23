import { getProjects } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { isValidCategory } from '@/lib/constants'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

/**
 * Category list page - shows all projects in a category
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  // Validate category
  if (!isValidCategory(category)) {
    notFound()
  }

  const projects = await getProjects(category)

  return (
    <div className="min-h-[calc(100vh-5.5rem)] flex justify-center items-center px-16">
      <nav className="flex flex-wrap gap-8 justify-end">
        {projects.map((project) => {
          const projectSlug = project.slug?.current || project.slug
          return (
            <Link
              key={project._id}
              href={`/${category}/${projectSlug}`}
              className="text-6xl leading-[1.3] hover:text-gray-500 cursor-pointer transition-colors duration-300"
            >
              {project.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}