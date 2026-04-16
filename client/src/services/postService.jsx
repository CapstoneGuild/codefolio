import { createAPIInstance, API_BASE_URL } from './api.jsx'

const post = createAPIInstance(`${API_BASE_URL}/api/posts`)
const api = createAPIInstance(`${API_BASE_URL}/api`)

const getAllPosts = async () => {
    try {
        const response = await post.get('/')
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch posts')
    }
}

const createPost = async (postData) => {
    try {
        const response = await post.post('/', postData)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to create post')
    }
}

const deletePost = async (id) => {
    try {
        const response = await post.delete(`/${id}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to delete post')
    }
}

const addComment = async (postId, commentData) => {
    try {
        const response = await post.post(`/${postId}/comments`, commentData)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to add comment')
    }
}

const getPostComments = async (postId) => {
    try {
        const response = await post.get(`/${postId}/comments`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch comments')
    }
}

const searchHashtags = async (query) => {
    try {
        const response = await api.get(`/hashtags/search?query=${encodeURIComponent(query)}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to search hashtags')
    }
}

export default {
    getAllPosts,
    createPost,
    deletePost,
    addComment,
    getPostComments,
    searchHashtags
}