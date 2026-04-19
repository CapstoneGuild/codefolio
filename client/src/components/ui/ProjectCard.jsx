import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import ProjectModal from './ProjectModal'

// Components
import { renderTechStack } from "./TechStack"

// Utils
import { parseCommaList } from "../../utils/format"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
	height: '80%',
	borderRadius: '20px',
  boxShadow: 24,
	overflow: 'hidden'
}

const ProjectCard = ({ project }) => {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)

	const linkArray = parseCommaList(project.links)

	return (
		<>
			<article onClick={handleOpen} className="bg-app-bg rounded-bl-4xl rounded-tr-4xl overflow-hidden border border-muted shadow-sm w-full max-w-none hover:shadow-md transition duration-300">
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
							{renderTechStack(project.tech_stack)}
						</div>
						<div className="flex gap-3 mt-4 caption font-medium">
							{project.demo_url && (
									<button><a href={project.demo_url} target="_blank" rel="nofollow">Live Site</a></button>
							)}
							{linkArray && (
									<button><a href={linkArray[0]} target="_blank" rel="nofollow">View Code</a></button>
							)}
						</div>
				</div>
			</article>
			<Modal
				aria-labelledby="Project"
				aria-describedby="Project"
				open={open}
				onClose={() => setOpen(false)}
				// closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={style}>
						<ProjectModal project={project} links={linkArray} />
					</Box>
				</Fade>
			</Modal>
		</>
	)
}

export default ProjectCard