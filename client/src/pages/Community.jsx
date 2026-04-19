import PostCard from "../components/ui/PostCard"
const Community = () => {
    const posts = 10;
    return (
        <div className="h-full flex flex-col bg-surface rounded-lg">
        <div className="px-8 py-4">
            <h1 className="heading-md">Community</h1>
        </div>

        <div className="flex-1 px-8 py-2">
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