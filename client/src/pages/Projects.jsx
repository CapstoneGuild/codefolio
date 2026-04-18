import { useEffect, useState } from "react"
import ProjectCard from "../components/ui/ProjectCard"
import projectService from '../services/projectService'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
          const data = await projectService.getAllProjects()
          setProjects(data.projects)
          console.log(data.projects)
      } catch (err) {
          setError(err.message)
      } finally {
          setLoading(false)
      }
    }

    fetchProjects()
  }, [])
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  
  return (
   <div className="flex flex-col bg-surface rounded-lg">
      <div className="px-8 py-4">
        <h1 className="heading-md">Projects</h1>
      </div>

      <div className="flex-1 px-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-stretch">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Projects