import { renderTechStack } from "./TechStack"
import VisibilityIcon from '@mui/icons-material/Visibility'
import GitHubIcon from '@mui/icons-material/GitHub';

const ProjectModal = ({ project }) => {

  return (
    <div className="w-full h-full bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
			<img src={project.image_url} alt="Project Thumbnail" className="w-full object-cover max-h-52"/>
      <div className="px-8 py-6">
        <div className="flex flex-row items-center justify-between">
          <h2 className="heading-md">{project.title}</h2>
          {/* User Avatar here */}

        </div>
        <div className="flex flex-wrap gap-2 mt-4 [&_span]:text-md">
          {renderTechStack(project.tech_stack)}
        </div>
        <p className="my-2">{project.description}</p>
        {/* Markdown Container */}
        <div>

        </div>
      </div>
    </div>
  )
}

export default ProjectModal