import { projects } from '@/app/data/projects'
import ProjectGrid from '@/app/components/ProjectGrid'

export default async function BWProjects() {
  const bwProjects = projects.filter(project => project.category === 'noir-et-blanc')
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Projets Noir & Blanc</h1>
      <ProjectGrid projects={bwProjects} />
    </main>
  )
} 