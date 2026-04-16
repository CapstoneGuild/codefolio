import { createAPIInstance, API_BASE_URL } from './api.jsx'

const authClient = createAPIInstance(`${API_BASE_URL}/auth`)

const getErrorMessage = (err, fallbackMessage) => {
    return err.response?.data?.message || err.response?.data?.error || fallbackMessage
}

const checkAuthStatus = async () => {
    try {
        const response = await authClient.get('/login/success')
        return response.data
    } catch (err) {
        throw new Error(getErrorMessage(err, 'Unable to check authentication status'))
    }
}

const loginWithGitHub = () => {
    window.location.assign(`${API_BASE_URL}/auth/github`)
}

const logout = async () => {
    try {
        const response = await authClient.get('/logout')
        return response.data
    } catch (err) {
        throw new Error(getErrorMessage(err, 'Unable to log out'))
    }
}

export default {
    checkAuthStatus,
    loginWithGitHub,
    logout
}