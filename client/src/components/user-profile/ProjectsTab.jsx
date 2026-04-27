import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProjectCard from "../ui/ProjectCard.jsx"
import projectService from '../../services/projectService'
import LoadingSpinner from "../ui/LoadingSpinner"
import ErrorMessage from "../ui/ErrorMessage"

const ProjectsTab = () => {
    const { id } = useParams();
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjectsByUser(id);
            setProjects(data.projects);

        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [id]);

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
        <div className="px-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default ProjectsTab;
