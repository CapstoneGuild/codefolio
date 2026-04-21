import { createAPIInstance, API_BASE_URL } from './api.jsx'

const authClient = createAPIInstance(`${API_BASE_URL}/auth`)

const getErrorMessage = (err, fallbackMessage) => {
    return ( err?.response?.data?.message || err?.response?.data?.error || err?.message || fallbackMessage )
}

const checkAuthStatus = async () => {
    try {
        const response = await authClient.get('/login/success')
        return response.data
    } catch (err) {
        if (err?.response?.status === 401) {
            return null
        }

        console.error("Auth check error:", err)
        return null
    }
}

export const loginWithGitHub = () => {
    window.location.assign(`${API_BASE_URL}/auth/github`)
}

export const logout = async () => {
    try {
        await authClient.get('/logout')
    } catch (err) {
        throw new Error(getErrorMessage(err, 'Unable to log out'))
    } finally {
        sessionStorage.removeItem("oauth_login_pending")
    }
}

export default {
    checkAuthStatus,
    loginWithGitHub,
    logout
}