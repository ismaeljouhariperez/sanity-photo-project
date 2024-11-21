import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/app/data/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block group"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-medium">{project.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{project.description}</p>
        <p className="mt-1 text-sm text-gray-500">{project.date}</p>
      </div>
    </Link>
  )
}
