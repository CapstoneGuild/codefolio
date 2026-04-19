import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    const techStack = ['React', 'JavaScript', 'Express']
    return (
        <article className="bg-white rounded-bl-4xl rounded-tr-4xl overflow-hidden border border-gray-200 shadow-sm w-full max-w-none hover:shadow-md transition duration-300">
            <img  src="https://picsum.photos/640/360" alt="Project Thumbnail" className="w-full object-cover h-32"/>
            <div className="p-4">
            <div className="space-y-2">
                <h1 className="text-base font-semibold text-gray-800 leading-tight"> {project.name} </h1>
                <p className="text-[0.7rem] text-gray-500 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.
                </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
                {techStack.map((tech, index) => (
                    <span key={index} className="text-[0.6rem] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex gap-3 mt-4 text-[0.7rem] font-medium">
                <button>Live Site</button>
                <button>View Code</button>
                <Link to={`/projects/${projectService.id}`}>
                    <button>View Details</button>
                </Link>
            </div>
            </div>
        </article>


    )
}

export default ProjectCard;
