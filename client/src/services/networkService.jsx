import { createAPIInstance, API_BASE_URL } from './api.jsx'

const network = createAPIInstance(`${API_BASE_URL}/api/network`)

const sendConnectionRequest = async (recipientId) => {
    try {
        const response = await network.post('/requests', { connected_userId: recipientId })
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to send connection request')
    }
}

const acceptConnectionRequest = async (networkId) => {
    try {
        const response = await network.patch(`/requests/${networkId}/accept`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to accept connection request')
    }
}

const rejectConnectionRequest = async (networkId) => {
    try {
        const response = await network.delete(`/requests/${networkId}/reject`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to reject connection request')
    }
}

const getConnections = async () => {
    try {
        const response = await network.get('/connections')
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch connections')
    }
}

const getPendingRequests = async () => {
    try {
        const response = await network.get('/requests/pending')
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch pending requests')
    }
}

export default {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnections,
    getPendingRequests
}  