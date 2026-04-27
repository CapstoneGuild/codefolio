import { useEffect } from "react"
import { Navigate, Outlet, useRoutes, useNavigate } from "react-router-dom"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import BodyLayout from "./layouts/BodyLayout"

import Projects from "./pages/Projects"
import Login from "./pages/Login"
import CreateProfile from "./pages/CreateProfile"
import UserProfile from "./pages/UserProfile"
import EditProfile from "./pages/EditProfile"

import AboutTab from "./components/user-profile/AboutTab";
import ProjectsTab from "./components/user-profile/ProjectsTab";
import BookmarksTab from "./components/user-profile/BookmarksTab";

import Community from "./pages/Community"
import Network from "./pages/Network"
import ProjectDetails from "./pages/ProjectDetails"
import EditProject from "./pages/EditProject"

import useAuthSession from "./hooks/useAuthSession"

import LoadingSpinner from "./components/ui/LoadingSpinner"
import NotificationProvider from "./components/ui/NotificationProvider"
import { notifySuccess } from "./utils/notifications"

import profileService from "./services/profileService";

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
	const navigate = useNavigate();
	const { user } = useAuthSession();

	useEffect(() => {
		if (isChecking || !isAuthenticated || !user || !user.id) return

		const checkProfile = async () => {
			try {
				const profile = await profileService.getProfileByUserId(user.id)

				if (profile && profile.is_complete === false) {
					navigate(`/profile/user/${user.id}/create`)
				}
			} catch (err) {
				console.log("Profile not found yet")
				/*if you run into server 500 during testing,
				uncomment the line below to be prompted to create
				your profile⬇️ */
				navigate(`/profile/user/${user.id}/create`)
			}
		};

		checkProfile();
	}, [isChecking, isAuthenticated, user, navigate]);

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
					element: <Navigate to="/projects" replace/>
				},
				{
					path: "projects",
					element: <Projects />
				},
				{
					path: "projects/:id",
					element: <ProjectDetails />,
				},
				{
					path: 'profile/user/:id/create',
					element: <CreateProfile />
				},
				{
					path: 'profile/user/:id/edit',
					element: <EditProfile />
				},
				{
					path: 'profile/user/:id',
					element: <UserProfile />,
					children: [
						{
							index: true,
							element: <AboutTab />
						},
						{
							path: 'projects', element: <ProjectsTab />
						},
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
