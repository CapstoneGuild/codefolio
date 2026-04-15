import PostCard from "../components/ui/PostCard"
const Community = () => {
    const posts = 10;
    return (
        <div className="h-screen flex flex-col bg-gray-50 rounded-lg">
        <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Community</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
            <div className="flex flex-col gap-8 justify-items-stretch">
                {[...Array(posts)].map((_, index) => (
                    <PostCard key={index} />
                ))}
            </div>
        </div>  
        </div>

    )
}

export default Community