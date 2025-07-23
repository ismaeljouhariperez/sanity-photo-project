import { getProjectBySlug, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { isValidCategory } from '@/lib/constants'
import Image from 'next/image'

interface ProjectDetailPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

/**
 * Unified project detail page for all categories
 */
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { category, slug } = await params
  
  // Validate category
  if (!isValidCategory(category)) {
    notFound()
  }

  const project = await getProjectBySlug(slug, category)
  
  if (!project) {
    notFound()
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
      {project.description && (
        <p className="text-lg mb-8 text-gray-600">{project.description}</p>
      )}
      
      {/* Photo Grid */}
      {project.photos && project.photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.photos.map((photo: any, index: number) => (
            <div key={photo._key || index} className="aspect-square overflow-hidden rounded">
              {photo.asset && (
                <Image
                  src={urlFor(photo.asset).width(600).height(600).url()}
                  alt={photo.alt || `${project.title} - Photo ${index + 1}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}