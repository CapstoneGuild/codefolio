// Components
import { renderBadges } from "./Badges"

const ProjectCard = ({ project }) => {
	return (
		<>
			<article className="bg-app-bg rounded-bl-4xl rounded-tr-4xl overflow-hidden border border-muted shadow-sm w-full max-w-none hover:shadow-md transition duration-300">
				<img  src={project.image_url} alt="Project Thumbnail" className="w-full object-cover max-h-32"/>
				<div className="p-6">
						<div className="space-y-2">
							<h1 className="heading-sm font-semibold text-app leading-tight">{project.title}</h1>
							<p className="body-sm text-app leading-relaxed">
								{project.description.length >= 35
										? `${project.description.slice(0,60)} ...more.`
										: project.description }
							</p>
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{renderBadges(project.tech_stack)}
						</div>
				</div>
			</article>
		</>
	)
}

export default ProjectCard
