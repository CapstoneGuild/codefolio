import { createAPIInstance, API_BASE_URL } from './api.jsx'

const profile = createAPIInstance(`${API_BASE_URL}/api/profiles`)

const getProfile = async (id) => {
    try {
        const response = await profile.get(`/${id}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch profile')
    }
}

const getProfileByUserId = async(userId) => {
    try {
        const response = await profile.get(`/user/${userId}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch profile')
    }
}

const createProfile = async (profileData) => {
    try {
        const response = await profile.post('/', profileData)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to create profile')
    }
}

const updateProfile = async (id, profileData) => {
    try {
        const response = await profile.patch(`/${id}`, profileData)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to update profile')
    }
}

export default {
    getProfile,
    getProfileByUserId,
    createProfile,
    updateProfile
}
