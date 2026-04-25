import { useEffect } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import BodyLayout from "./layouts/BodyLayout"
import Projects from "./pages/Projects"
import Login from "./pages/Login"
import UserProfile from "./pages/UserProfile"
import AboutTab from "./components/user-profile/AboutTab";
import ProjectsTab from "./components/user-profile/ProjectsTab";
import BookmarksTab from "./components/user-profile/BookmarksTab";
import Community from "./pages/Community"
import Network from "./pages/Network"
import useAuthSession from "./hooks/useAuthSession"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import NotificationProvider from "./components/ui/NotificationProvider"
import { notifySuccess } from "./utils/notifications"

const AppShell = () => {
	return (
		<div className="min-h-screen flex flex-col bg-app-bg dark:bg-app-bg">
			<Navbar />
			<main className="flex-1 w-full max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<BodyLayout element={<Outlet />} />
			</main>
			<Footer />
		</div>
	)
}

const ProtectedRoute = ({ isAuthenticated, isChecking }) => {
	if (isChecking) {
		return <LoadingSpinner fullScreen />
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return <AppShell />
}

const PublicRoute = ({ isAuthenticated, children }) => {
	if (isAuthenticated) {
		return <Navigate to="/" replace />
	}

	return children
}

function App() {
	const { isAuthenticated, isChecking } = useAuthSession()

	useEffect(() => {
		if (isChecking || !isAuthenticated) {
			return
		}

		const isPendingOAuthLogin = sessionStorage.getItem('oauth_login_pending') === '1'
		if (isPendingOAuthLogin) {
			sessionStorage.removeItem('oauth_login_pending')
			notifySuccess('Successfully logged in!')
		}
	}, [isAuthenticated, isChecking])

	const element = useRoutes([
		{
			path: '/login',
			element: (
				<PublicRoute isAuthenticated={isAuthenticated}>
					<Login />
				</PublicRoute>
			)
		},
		{
			path: '/',
			element: <ProtectedRoute isAuthenticated={isAuthenticated} isChecking={isChecking} />,
			children: [
				{
					index: true,
					element: <Projects />
				},
				// {
				// 	path: 'projects/:id',
				// 	element: <ProjectDetails />
				// },
				{
					path: 'profile/:id',
					element: <UserProfile />,
					children: [
						{
							index: true,
							element: <AboutTab />
						},
						{
							path: 'projects', element: <ProjectsTab />
						},
						{
							path: 'bookmarks', element: <BookmarksTab />
						}
					]
				},
				{
					path: 'community',
					element: <Community />
				},
				{
					path: 'network',
					element: <Network />
				}
			]
		},
	])

	return (
		<>
			{element}
			<NotificationProvider />
		</>
	)
}

export default App
