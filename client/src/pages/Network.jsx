import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Service
import { 
	getConnections, 
	getPendingRequests, 
	removeConnection, 
	acceptConnectionRequest, 
	rejectConnectionRequest, 
	getSuggestedProfiles,
	sendConnectionRequest
} from "../services/networkService"

// Components
import LoadingSpinner from "../components/ui/LoadingSpinner"

// Utilities
import { getStatusData } from "../utils/status"
import { notifySuccess, notifyError } from "../utils/notifications.js"
import { formatLink } from "../utils/format.jsx"

// Icons
import Avatar from "@mui/material/Avatar"
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import Tooltip from "@mui/material/Tooltip"
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { Badge } from "@mui/material"

const Network = () => {
	const [loading, setLoading] = useState(true)

	const [activeTab, setActiveTab] = useState("accepted")

	const tabs = [
		{ key: "accepted", label: "Connections" },
		{ key: "pending", label: "Pending" },
		{ key: "collaborators", label: "Find Collaborators" },
	]

	const [connectionData, setConnectionData] = useState({
		accepted: { items: [], count: 0 },
		pending: { items: [], count: 0 },
	})

	const [suggestedProfiles, setSuggestedProfiles] = useState([])

	const fetchConnections = async () => {
		try {
			const connectionsResponse = await getConnections()
			const pendingConnectionsResponse = await getPendingRequests()
			const suggestedProfilesResponse = await getSuggestedProfiles()

			if (connectionsResponse?.connections && pendingConnectionsResponse?.pendingRequests) {
				setConnectionData({
					accepted: getStatusData(connectionsResponse.connections),
					pending: getStatusData(pendingConnectionsResponse.pendingRequests)
				})
			}
			setSuggestedProfiles(suggestedProfilesResponse.profiles)
		} catch (error) {
			console.error("Error fetching connections:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchConnections()
	}, [])

	const handleRemoveConnection = async (id) => {
		const confirmDelete = window.confirm("Are you sure you want to remove this connection?")

		if (!confirmDelete) return

		try {
			const response = await removeConnection(id)
			if (response?.message) {
				notifySuccess("Connection has been removed.")
			}
		} catch (error) {
			console.error("Error deleting connection:", error)
			notifyError("Error encountered in deleting connection.")
		} finally {
			fetchConnections()
		}
	}

	const handleAcceptRequest = async (id) => {
		try {
			const response = await acceptConnectionRequest(id)
			if (response) {
				notifySuccess("Request accepted.")
			}
		} catch (error) {
			console.error("Error encountered in accepting request:", error)
			notifyError("Error encountered in accepting request.")
		} finally {
			fetchConnections()
		}
	}

	const handleRejectRequest = async (id) => {
		const confirmRemove = window.confirm("Are you sure you want to remove this request?")

		if (!confirmRemove) return

		try {
			const response = await rejectConnectionRequest(id)
			if (response) {
				notifySuccess("Request removed.")
			}
		} catch (error) {
			console.error("Error encountered in rejecting request:", error)
			notifyError("Error encountered in rejecting request.")
		} finally {
			fetchConnections()
		}
	}

	const handleSendRequest = async (user_id) => {
		try {
			const response = await sendConnectionRequest(user_id)
			if (response) {
				notifySuccess("Sent request.")
			}
		} catch (error) {
			console.error("Error encountered in sending request:", error)
			notifyError("Error encountered in sending request.")
		} finally {
			fetchConnections()
		}
	}

	if (loading) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden max-w-none text-app">
      <LoadingSpinner />
    </div>
  )

	return (
		<>
			{/* Badges: Connections, Requests, Find */}
			<div className="flex flex-col md:flex-row gap-4">
				{tabs.map(tab => {
					const count = connectionData[tab.key]?.count || 0
					const showCount = tab.key === "accepted" || tab.key === "pending"

					return (
						<Badge key={tab.key} variant="dot" color="error" invisible={tab.key !== "pending" || count === 0} >
							<button
								onClick={() => setActiveTab(tab.key)}
								className={`flex flex-row gap-2 px-6 ${
									activeTab === tab.key
										? "bg-primary text-surface"
										: "bg-surface text-muted"
								}`}
							>
								{showCount && (
									<span className="font-semibold">{count}</span>
								)}

								<i>
									{tab.key === "accepted"
										? count === 1
											? "Connection"
											: "Connections"
										: tab.label}
								</i>
							</button>
						</Badge>
					)
				})}
			</div>
			{/* Accepted Connections */}
			{activeTab === "accepted" && (
				<div className="bg-surface text-app p-4 rounded-xl mt-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{connectionData && connectionData.accepted.items.length > 0 ? connectionData.accepted.items.map((user) => (
							<div key={user.id} className="flex flex-row items-center justify-between px-6 py-4 rounded-xl border border-muted">
								<div className="flex flex-row gap-8 items-center justify-between">
									{/* Profile */}
									<div className="flex-1 min-w-48">
									<Link to={`/profile/user/${user.other_profile.user_id}`} className="flex flex-row gap-4 items-center">
											<Avatar src={user.other_profile.avatar_url} />
											<div className="flex flex-col items-start">
												<span>{user.other_profile.username}</span>
												{user.other_profile.location && (
													<span className="caption">{user.other_profile.location}</span>
												)}
											</div>
										</Link>
									</div>
									{/* Social Links */}
									<div className="hidden md:block">
										<div className="flex flex-row gap-4 [&_a]:hover:scale-110">
											<a href={formatLink(user.other_profile.github_url)} target="_blank" rel="nofollow"><GitHubIcon /></a>
											<a href={formatLink(user.other_profile.linkedin_url)} target="_blank" rel="nofollow"><LinkedInIcon /></a>
										</div>
									</div>
								</div>
								{/* Remove Connection */}
								<div onClick={() => handleRemoveConnection(user.id)}>
									<Tooltip title="Remove Connection" arrow>
										<button><PersonRemoveIcon /></button>
									</Tooltip>
								</div>
							</div>
							))
							:
							<div className="col-span-full">
								<div className="flex flex-col items-center justify-center gap-4 p-6">
									<EmojiPeopleIcon sx={{ fontSize: "4rem"}}/>
									<span>No connections found.</span>
								</div>
							</div>
						}
					</div>
				</div>
			)}
			{/* Pending Requests */}
			{activeTab === "pending" && (
				<div className="bg-surface text-app p-4 rounded-xl mt-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{connectionData && connectionData.pending.items.length > 0 ? connectionData.pending.items.map((user) => (
							<div key={user.id} className="flex flex-row items-center justify-between px-6 py-4 rounded-xl border border-muted">
								<div className="flex flex-row gap-8 items-center">
									{/* Profile */}
									<div className="flex-1 min-w-48">
									<Link to={`/profile/user/${user.requester_profile.user_id}`} className="flex flex-row gap-4 items-center">
											<Avatar src={user.requester_profile.avatar_url} />
											<div className="flex flex-col items-start">
												<span>{user.requester_profile.username}</span>
												{user.requester_profile.location && (
													<span className="caption">{user.requester_profile.location}</span>
												)}
											</div>
										</Link>
									</div>
									{/* Social Links */}
									<div className="hidden md:block">
										<div className="flex flex-row gap-4 [&_a]:hover:scale-110">
											<a href={formatLink(user.requester_profile.github_url)} target="_blank" rel="nofollow"><GitHubIcon /></a>
											<a href={formatLink(user.requester_profile.linkedin_url)} target="_blank" rel="nofollow"><LinkedInIcon /></a>
										</div>
									</div>
								</div>
								{/* Accept or Decline Connection */}
								<div className="flex flex-row gap-4">
									<Tooltip title="Accept" arrow>
										<button onClick={() => handleAcceptRequest(user.id)}><AddIcon /></button>
									</Tooltip>
									<Tooltip title="Decline" arrow>
										<button onClick={() => handleRejectRequest(user.id)}><DeleteOutlineOutlinedIcon /></button>
									</Tooltip>
								</div>
							</div>
							))
							:
							<div className="col-span-full"> 
								<div className="flex flex-col items-center justify-center gap-4 p-6">
									<EmojiPeopleIcon sx={{ fontSize: "4rem"}} />
									<span>No pending requests found.</span>
								</div>
							</div>
						}
					</div>
				</div>
			)}
			{/* Suggested Profiles */}
			{activeTab === "collaborators" && (
				<div className="bg-surface text-app p-4 rounded-xl mt-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{suggestedProfiles && suggestedProfiles.length > 0 ? suggestedProfiles.map((profile) => (
							<div key={profile.id} className="flex flex-row items-center justify-between px-6 py-4 rounded-xl border border-muted">
								<div className="flex flex-row gap-8 items-center">
									{/* Profile */}
									<div className="flex-1 min-w-48">
											<Link to={`/profile/user/${profile.user_id}`} className="flex flex-row gap-4 items-center">
											<Avatar src={profile.avatar_url} />
											<div className="flex flex-col items-start">
												<span>{profile.username}</span>
												{profile.location && (
													<span className="caption">{profile.location}</span>
												)}
											</div>
										</Link>
									</div>
									{/* Social Links */}
									<div className="hidden md:block">
										<div className="flex flex-row gap-4 [&_a]:hover:scale-110">
											<a href={formatLink(profile.github_url)} target="_blank" rel="nofollow"><GitHubIcon /></a>
											<a href={formatLink(profile.linkedin_url)} target="_blank" rel="nofollow"><LinkedInIcon /></a>
										</div>
									</div>
								</div>
								{/* Request Connection */}
								<div className="flex flex-row gap-4">
									<Tooltip title="Collaborate" arrow>
										<button onClick={() => handleSendRequest(profile.user_id)}><AddIcon /></button>
									</Tooltip>
								</div>
							</div>
							))
							:
							<div className="col-span-full">
								<div className="flex flex-col items-center justify-center gap-4 p-6">
									<EmojiPeopleIcon sx={{ fontSize: "4rem"}} />
									<span>No suggested profiles.</span>
								</div>
							</div>
						}
					</div>
				</div>
			)}
		</>
	)
}

export default Network