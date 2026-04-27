import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Service
import projectService from '../services/projectService'

// Components
import ProjectCard from "../components/ui/ProjectCard"
import ErrorMessage from "../components/ui/ErrorMessage"
import LoadingSpinner from "../components/ui/LoadingSpinner"

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await projectService.getAllProjects(limit, offset);

      setProjects(data.projects);
      setHasMore(data.pagination.hasMore);
      setTotalCount(data.pagination.totalCount);
    } catch (error) {
      console.error(error.message);
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [offset]);

  const handleNext = () => {
    if (hasMore) {
      setOffset((prev) => prev + limit)
    }
  }

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - limit, 0))
  }

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(totalCount / limit)
  
  if (loading) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg max-w-none transition duration-300 text-app">
      <LoadingSpinner />
    </div>
  )
  if (error) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
      <ErrorMessage />
    </div>
  )
  
  return (
   <div className="flex flex-col h-full">
      <div className="flex-1 min-w-0 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-stretch auto-rows-fr">
          {projects.length > 0 ? projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
            >
              <ProjectCard key={project.id} project={project} />
            </Link>
            )) 
            :
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center py-6">
                <InventoryIcon sx={{ fontSize: "6rem" }} />
                <h1 className="heading-md mt-4">No Projects Found.</h1>
              </div>
            </div>
          }
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 px-8 py-4">
          <button
            onClick={handlePrevious}
            disabled={offset === 0}
            className="max-w-24 w-24 px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={!hasMore}
            className="maxw-24 w-24 px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Projects
