import { useEffect, useState } from "react"
import authService from "../services/authService"

const useAuthSession = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isChecking, setIsChecking] = useState(true)

	useEffect(() => {
		let isActive = true

		const verifyAuthStatus = async () => {
			try {
				await authService.checkAuthStatus()
				if (isActive) {
					setIsAuthenticated(true)
				}
			} catch {
				if (isActive) {
					setIsAuthenticated(false)
				}
			} finally {
				if (isActive) {
					setIsChecking(false)
				}
			}
		}

		verifyAuthStatus()

		return () => {
			isActive = false
		}
	}, [])

	return { isAuthenticated, isChecking }
}

export default useAuthSession