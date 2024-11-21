import { projects } from '@/app/data/projects'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4">
      <h1>{project.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${project.title} - Image ${index + 1}`}
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        ))}
      </div>
    </div>
  )
}
