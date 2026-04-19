import { useEffect, useState } from "react"
import { Link } from "react-router"
import { renderTechStack } from "./TechStack"
import projectService from "../../services/projectService"
import { Avatar } from '@mui/material'
import ErrorMessage from "./ErrorMessage"
import { formatDate } from "../../utils/format"
import LoadingSpinner from "./LoadingSpinner"
import VisibilityIcon from '@mui/icons-material/Visibility'
import GitHubIcon from '@mui/icons-material/GitHub'

const ProjectModal = ({ project, links }) => {
  // const [projectData, setProjectData] = useState([])
  const [owner, setOwner] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectById = async () => {
      try {
          const data = await projectService.getProjectById(project.id)
          // setProjectData(data)
          setOwner(data.owner)
      } catch (err) {
          setError(err.message)
      } finally {
          setLoading(false)
      }
    }
    fetchProjectById()
  },[project.id])

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
      <LoadingSpinner />
    </div>
  )
  if (error) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
      <ErrorMessage />
    </div>
  )

  return (
    <div className="w-full h-full bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
			<img src={project.image_url} alt="Project Thumbnail" className="w-full object-cover max-h-52"/>
      <div className="px-8 py-6">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <div>
              <h2 className="heading-md">{project.title}</h2>
              <span className="caption">{formatDate(project.created_at)}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              {project.demo_url && (
									<button><a href={project.demo_url} target="_blank" rel="nofollow"><VisibilityIcon /></a></button>
							)}
							{links && (
									<button><a href={links[0]} target="_blank" rel="nofollow"><GitHubIcon /></a></button>
							)}
            </div>
          </div>
          <Link to="/profile"><Avatar src={owner.avatar_url}></Avatar></Link>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 [&_span]:text-md">
          {renderTechStack(project.tech_stack)}
        </div>
        <p className="my-4">{project.description}</p>
      </div>
    </div>
  )
}

export default ProjectModal