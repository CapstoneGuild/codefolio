import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getProjectById, updateProject } from "../services/projectService.jsx"
import { notifyError, notifySuccess } from "../utils/notifications.js"

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
    description: "List the tools and technologies used.",
    fields: ["tech_stack"],
  },
  {
    title: "Links & Demo",
    description: "Add places where people can view or explore it.",
    fields: ["demo_url", "links"],
  },
  {
    title: "Collaboration",
    description: "Mention anyone who helped build it.",
    fields: ["collaborators"],
  },
  {
    title: "Media & License",
    description: "Add a preview image and license details.",
    fields: ["image_url", "license"],
  },
]

const initialProject = {
  title: "",
  description: "",
  tech_stack: "",
  demo_url: "",
  collaborators: "",
  links: "",
  license: "",
  image_url: "",
}

const EditProject = ({ projectId, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [project, setProject] = useState(initialProject)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId)

        setProject({
          title: data.title || "",
          description: data.description || "",
          tech_stack: data.tech_stack || "",
          demo_url: data.demo_url || "",
          collaborators: data.collaborators || "",
          links: data.links || "",
          license: data.license || "",
          image_url: data.image_url || "",
        })
      } catch (error) {
        notifyError(error.message || "Unable to load project.")
      } finally {
        setFetching(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleChange = (e) => {
    const { name, value } = e.target

    setProject((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProject(projectId, project)

      notifySuccess("Project updated successfully!")

      onClose?.()

      if (location.pathname === `/projects/${projectId}` || location.pathname === "/projects") {
        navigate(0)
      } else {
        navigate(`/projects/${projectId}`)
      }
    } catch (error) {
      console.error("Error updating project:", error)
      notifyError(error.message || "Uh-oh, something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="px-4 py-6 text-center text-muted">
        Loading project...
      </div>
    )
  }

  return (
    <div className="px-4 py-2">
      <h2 className="heading-sm mb-5 text-center">Edit Project Details</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {FIELD_GROUPS.map((group) => (
          <section key={group.title} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-app">{group.title}</h2>
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
          className="mt-1 self-end rounded-full border border-muted bg-primary px-5 py-1.5 text-md font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}

export default EditProject