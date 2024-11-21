import { projects } from '@/app/data/projects'
import ProjectGrid from '@/app/components/ProjectGrid'

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4">
      <h1>Tous les Projets</h1>
      <ProjectGrid projects={projects} />
    </div>
  )
}
