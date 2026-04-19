
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjectById, updateProject, deleteProject } from '../../services/projectService.jsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { buildmarkdown } from '../utils/buildMarkdown.js';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    //initialize the project
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        const fetchProjectById = async () => {

            try {
                const data = await getProjectById(id);
                setProject(data);

                //Generate markdown from stored project data
                const md = buildmarkdown(data);
                setMarkdown(md);

            } catch (error) {
                console.error("Error fetching project: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectById();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div>
            <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                </ReactMarkdown>
            </div>

            //consditional rendering of edit button only for project owner
            {isOwner && (
                <div className="edit-project-btn">
                    <Link to={`/projects/${id}/edit`} className="edit-project-link">
                        Edit Project Details ⚙️
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
