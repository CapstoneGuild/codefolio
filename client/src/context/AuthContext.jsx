import { createContext, useEffect, useState } from "react"
import authService from "../services/authService"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState(null)

  const checkAuth = async () => {
    try {
      const response = await authService.checkAuthStatus()

      if (!response?.user) {
        setUser(null)
        setIsAuthenticated(false)
        return
      }

      setUser({
        username: response.user.username,
        avatar_url: response.user.avatar_url,
      })
      setIsAuthenticated(true)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsChecking(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {    
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isChecking,
        user,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext