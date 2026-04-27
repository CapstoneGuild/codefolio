import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { createProject } from '../../services/projectService.jsx';
import { notifyError, notifySuccess } from '../../utils/notifications.js';

// Icons
import DescriptionIcon from '@mui/icons-material/Description';

const FIELDS = {
  title: { label: "Title", placeholder: "What did you build?" },
  description: { label: "Description", placeholder: "What is it about?", type: "textarea" },
  tech_stack: { label: "Tech Stack", placeholder: "React, Express, PostgreSQL" },
  demo_url: { label: "Demo URL", placeholder: "https://" },
  collaborators: { label: "Collaborators", placeholder: "Names or usernames" },
  links: { label: "Links", placeholder: "GitHub, docs, extra links" },
  license: { label: "License", placeholder: "MIT License" },
  image_url: { label: "Image URL", placeholder: "https://" },
}

const FIELD_GROUPS = [
  {
    title: "Basic Info",
    description: "Tell people what your project is.",
    fields: ["title", "description"],
  },
  {
    title: "Tech Stack",
    description: "List the tools and technologies used. (Separate using comma)",
    fields: ["tech_stack"],
  },
  {
    title: "Links & Demo",
    description: "Add places where people can view or explore it.",
    fields: ["demo_url", "links"],
  },
  {
    title: "Collaboration",
    description: "Mention anyone who helped build it. (Separate using comma)",
    fields: ["collaborators"],
  },
  {
    title: "Media & License",
    description: "Add a preview image and license details.",
    fields: ["image_url", "license"],
  },
]

const CreateProject = ({ onClose }) => {
	const navigate = useNavigate()

	const [project, setProject] = useState({
		title: '',
		description: '',
		tech_stack: '',
		demo_url: '',
		collaborators: '',
		links: '',
		license: '',
		image_url: ''
	});

	const [loading, setLoading] = useState(false)

	//handle form inputs
	const handleChange = (e) => {
		const { name, value } = e.target;
		setProject((prev) => ({
				...prev,
				[name]: value
		}));
	};

	//handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)

		//send prject data to backend
		const newProject = {
			...project,
			title: project.title,
			description: project.description,
			tech_stack: project.tech_stack,
			demo_url: project.demo_url,
			collaborators: project.collaborators,
			links: project.links,
			license: project.license,
			image_url: project.image_url
		};

		try {
			await createProject(newProject);

			notifySuccess('Project added successfully!');

			//Reset form after successful submission
			setProject({
					title: '',
					description: '',
					tech_stack: '',
					demo_url: '',
					collaborators: '',
					links: '',
					license: '',
					image_url: ''
			});

			onClose?.()

			navigate("/projects")
		} catch (error) {
			console.error('Error adding project:', error);
			notifyError(error.message || 'Uh-oh, something went wrong.')
		} finally {
			setLoading(false)
		}
	};

	return (
		<>
			<div className="px-4 py-2">
				<h2 className="heading-sm mb-5 text-primary flex flex-row items-center justify-center gap-2"><DescriptionIcon /> Enter New Project Details</h2>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{FIELD_GROUPS.map((group) => (
						<section key={group.title} className="space-y-4">
							<div>
								<h2 className="text-lg font-semibold text-primary">{group.title}</h2>
								<p className="text-sm text-muted">{group.description}</p>
							</div>

							<div className="grid grid-cols-1 gap-4">
								{group.fields.map((fieldName) => {
									const field = FIELDS[fieldName]

									return (
										<label key={fieldName} className="flex flex-col gap-2">
											<span className="text-sm font-medium text-app">
												{field.label}
											</span>

											{field.type === "textarea" ? (
												<textarea
													name={fieldName}
													value={project[fieldName] || ""}
													onChange={handleChange}
													placeholder={field.placeholder}
													rows={4}
													className="w-full rounded-xl border border-muted bg-app-bg px-4 py-3 text-app outline-none focus:border-primary"
												/>
											) : (
												<input
													name={fieldName}
													value={project[fieldName] || ""}
													onChange={handleChange}
													placeholder={field.placeholder}
													className="w-full rounded-xl border border-muted bg-app-bg px-4 py-3 text-app outline-none focus:border-primary"
												/>
											)}
										</label>
									)
								})}
							</div>
						</section>
					))}
					<button
						type="submit"
						disabled={loading || !project.title.trim()}
						className="mt-1 self-end rounded-full border border-muted bg-primary px-6 py-2 text-lg font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Adding..." : "Add"}
					</button>
				</form>
			</div>
		</>
	);
};

export default CreateProject;
