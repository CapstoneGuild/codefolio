import PostCard from "../components/ui/PostCard"
import postService from "../services/postService";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { notifyError } from "../utils/notifications";
import CreatePost from "../components/ui/CreatePost";

const Community = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [createPost, setCreatePost] = useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const data = await postService.getAllPosts()
                setPosts(data)
            } catch (error) {
                notifyError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (loading) return (
        <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
            <LoadingSpinner />
        </div>
    )

    return (
        <div className="max-h-screen overflow-y-scroll flex flex-col bg-surface rounded-lg">
            <div className="px-8 py-4 flex items-center justify-between">
                <h1 className="heading-md">Community</h1>
                <button onClick={() => setCreatePost(true)} className="text-sm">Add a post</button>
            </div>

            <div className="flex-1 px-8 py-2">
                <div className="flex flex-col gap-8 justify-items-stretch">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>  
            {createPost && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setCreatePost(false)}
                >
                    <div
                        className="w-full max-w-lg mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CreatePost onPostCreated={(post) => {
                            setPosts((prev) => [post, ...prev])
                            setCreatePost(false)
                        }} />
                    </div>
                </div>
            )}
        </div>

    )
}

export default Community