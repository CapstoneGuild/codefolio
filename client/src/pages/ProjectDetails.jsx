import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Service
import { getProjectById } from '../services/projectService'
import useAuthSession from "../hooks/useAuthSession.jsx";

// Components
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ZoomImage from "../components/ui/ZoomImage";
import { renderBadges } from "../components/ui/Badges"
import EditProject from "./EditProject.jsx";
import GlobalModal from "../components/ui/GlobalModal.jsx";

// Utilities
import { buildmarkdown } from '../utils/buildMarkdown.js'
import { formatDate, parseCommaList, formatLink } from "../utils/format"

// Icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import Avatar from "@mui/material/Avatar";
import VisibilityIcon from '@mui/icons-material/Visibility'
import GitHubIcon from '@mui/icons-material/GitHub'
import CheckIcon from "@mui/icons-material/Check"
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import Tooltip from "@mui/material/Tooltip"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import HomeIcon from "@mui/icons-material/Home"
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LaunchIcon from '@mui/icons-material/Launch';
import IosShareIcon from '@mui/icons-material/IosShare';

const ProjectDetails = () => {
  const { id } = useParams();
	const { user } = useAuthSession()
  const [copied, setCopied] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  //initialize the project
  const [owner, setOwner] = useState([])
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markdown, setMarkdown] = useState("");
  const [linkArray, setLinkArray] = useState(null)

	// Edit Project modal
	const [openEdit, setOpenEdit] = useState(false)

  const handleCopyProjectLink = async (projectId) => {
    const projectUrl = `${window.location.origin}/projects/${projectId}`

    try {
      await navigator.clipboard.writeText(projectUrl)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
      setUrlCopied(false)
    }
  }

  useEffect(() => {    
    const fetchProjectById = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
        setOwner(data.owner)
        setLinkArray(parseCommaList(data.links))
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

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden max-w-none text-app">
      <LoadingSpinner />
    </div>
  )

  if (!project) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden max-w-none text-app">
      <h1>Project not found.</h1>
    </div>
  )

  return (
    <>
      <div className="w-full h-full bg-surface px-6 py-4 rounded-xl overflow-hidden max-w-none text-app md:px-8 md:py-6">
				<div className="mb-2 block lg:hidden shrink-0"> 
					<Breadcrumbs aria-label="breadcrumb" className="text-sm text-app-muted">
						<Link component={RouterLink} to="/" className="text-primary flex items-center gap-1">
							<HomeIcon fontSize="small" />
							Projects
						</Link>

						<Typography>
							{project.title}
						</Typography>
					</Breadcrumbs>
				</div>
        <div className="relative">
          {project.image_url && (
            <ZoomImage alt={project.title} src={project.image_url} />
          )}
          <div className="absolute bottom-4 right-6">
            <div className="flex flex-row gap-2 items-center justify-center">
              {/* Copy Button */}
							<CopyToClipboard
								text={markdown}
								onCopy={() => {
									setCopied(true)
									setTimeout(() => setCopied(false), 2000)
								}}
							>
								<Tooltip title="Copy Markdown" arrow>
									<button
										disabled={copied}
										className={`flex items-center gap-1 px-4 caption
											${copied ? "opacity-60 cursor-not-allowed" : "bg-surface text-primary hover:text-surface hover:bg-app"}
										`}
									>
										{copied ? (
											<> <CheckIcon fontSize="small" /> Copied </>
										) : (
											<> <ContentCopyIcon fontSize="small" /> Markdown </>
										)}
									</button>	
								</Tooltip>
							</CopyToClipboard>
              <Tooltip title="Share Project" arrow>
                <button 
                  disabled={urlCopied}
                  onClick={() => handleCopyProjectLink(project.id)} 
                  className={`flex items-center gap-1 px-4 caption
                    ${urlCopied ? "opacity-60 cursor-not-allowed" : "bg-surface text-primary hover:text-surface hover:bg-app"}
                  `}
                >
                  {urlCopied ? (
                    <> <CheckIcon fontSize="small" /> </>
                  ) : (
                    <> <IosShareIcon fontSize="small" /> </>
                  )}
                </button>	
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="pt-6">
					{/* Header */}
          <div className="flex flex-row items-center justify-between">
						<div className="flex flex-col gap-1 items-start">
							<div className="flex flex-row gap-2 items-center justify-center">
								<h2 className="heading-lg text-primary">{project.title}</h2>
								{/* conditional rendering of edit button only for project owner */}
								{user.username === owner.username && (
									<Tooltip title="Edit Project" arrow>
										<button onClick={() => setOpenEdit(true)} className="bg-transparent text-app">
											<EditDocumentIcon fontSize="medium"/>
										</button>
									</Tooltip>
								)}
								{user.username !== owner.username && (
									<Tooltip title="Bookmark" arrow>
										{/* Add onClick function, insert row to bookmarks table */}
										<button className="bg-transparent text-app">
											<BookmarkBorderIcon fontSize="medium"/>
										</button>
									</Tooltip>
								)}
							</div>
							<span className="caption">{formatDate(project.created_at)}</span>
						</div>
            <div className="hover:scale-110">
              <Tooltip title={owner.username} arrow>
              	<RouterLink to={`/profile/${project.profile_id}`}><Avatar src={owner.avatar_url}></Avatar></RouterLink>
							</Tooltip>		
            </div>
          </div>
  
          {/* Description */}
          <div className="mt-4">
            <h2 className="heading-sm text-muted">Description</h2>
            <p className="body-lg font-medium">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="mt-4">
            <h2 className="heading-sm text-muted">Tech Stack</h2>
            <div className="flex flex-wrap gap-2 mt-4 [&_span]:body-lg">
              {renderBadges(project.tech_stack, null)}
            </div>
          </div>

          {/* Demo */}
          {project.demo_url && (
            <div className="mt-4">
              <h2 className="heading-sm text-muted">Demo</h2>
              <a 
                href={formatLink(project.demo_url)} 
                className="body-lg underline text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.demo_url} <LaunchIcon fontSize="small"/>
              </a>
            </div>
          )}

          {/* Collaborators */}
          {project.collaborators && (
            <div className="mt-4">
              <h2 className="heading-sm text-muted">Collaborators</h2>
              <div className="flex flex-wrap gap-2 mt-4 [&_span]:body-lg">
                {renderBadges(project.collaborators, null)}
              </div>
            </div>
          )}

          {/* Links */}
          {project.links && (
            <div className="mt-4">
              <h2 className="heading-sm text-muted mb-2">Links</h2>
              {linkArray && (
                <button><a href={linkArray[0]} target="_blank" rel="nofollow"><GitHubIcon /></a></button>
              )}
            </div>
          )}

          {/* License */}
          {project.license && (
            <div className="mt-4">
              <h2 className="heading-sm text-muted">License</h2>
              <p className="body-lg">{project.license}</p>
            </div>
          )}
        </div>
      </div>

			<GlobalModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        element={
          <EditProject
            projectId={project.id}
            onClose={() => setOpenEdit(false)}
          />
        }
      />
    </>
  )
}

export default ProjectDetails