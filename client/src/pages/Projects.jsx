//Note: This placeholder needs to be updated to pass project as prop to Project card component.

import ProjectCard from "../components/ui/ProjectCard"

const Projects = () => {
  const projects = 10
  return (
   <div className="h-screen flex flex-col bg-gray-50 rounded-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Projects</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-stretch">
          {[...Array(projects)].map((_, index) => (
            <ProjectCard key={index} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Projects
