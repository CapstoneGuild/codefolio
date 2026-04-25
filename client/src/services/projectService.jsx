import { createAPIInstance, API_BASE_URL } from './api.jsx'

const project = createAPIInstance(`${API_BASE_URL}/api/projects`)

const getAllProjects = async (limit = 20, offset = 0) => {
    try {
        const response = await project.get(`/?limit=${limit}&offset=${offset}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch projects')
    }
}

export const getProjectById = async (id) => {
    try {
        const response = await project.get(`/${id}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch project details')
    }
}

const createProject = async (projectData) => {
    try {
        const response = await project.post('/', projectData)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to create project')
    }
}

const updateProject = async (id, projectData) => {
    try {
        const response = await project.patch(`/${id}`, projectData)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to update project')
    }
}

const deleteProject = async (id) => {
    try {
        const response = await project.delete(`/${id}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to delete project')
    }
}

export default {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}
