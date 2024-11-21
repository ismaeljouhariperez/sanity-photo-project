import { projects } from '@/app/data/projects'
import ProjectGrid from '@/app/components/ProjectGrid'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1>Mon Portfolio</h1>
      <ProjectGrid projects={projects} />
    </div>
  )
}
