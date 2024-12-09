import { projects } from '@/app/data/projects'
import ProjectGrid from '@/app/components/ProjectGrid'

export default async function ColorProjects() {
  const colorProjects = projects.filter(project => project.category === 'couleur')
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Projets Couleur</h1>
      <ProjectGrid projects={colorProjects} />
    </main>
  )
} 