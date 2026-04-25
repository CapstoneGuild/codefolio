import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@mui/material'
import { Add, Star, StarBorder, ModeComment } from '@mui/icons-material'
import { formatDate } from '../../utils/format'
import postService from '../../services/postService'
import { notifyError } from '../../utils/notifications'

const PostCard = ({ post }) => {
    const [isStarred, setIsStarred] = useState(false)
    const [likes, setLikes] = useState(post.likes_count ?? 0)
    const [comments, setComments] = useState([])
    const [openComment, setOpenComment] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [loadingComments, setLoadingComments] = useState(false)
    const hashtags = post.hashtags ?? []

    const handleStarred = () => {
        setIsStarred(!isStarred)
        setLikes(isStarred ? likes - 1 : likes + 1)
    }

    const handleToggleComments = async () => {
        setOpenComment((prev) => !prev)
        if (comments !== null) return
        setLoadingComments(true)
        try {
            const data = await postService.getPostComments(post.id)
            setComments(data.comments ?? data)
        } catch (err) {
            notifyError(err.message)
            setComments([])
        } finally {
            setLoadingComments(false)
        }
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return
        try {
            const data = await postService.addComment(post.id, { content: commentText.trim() })
            setComments((prev) => [data, ...(prev ?? [])])
            setCommentText('')
        } catch (err) {
            notifyError(err.message)
        }
    }

    return (
        <article className='w-full rounded-tr-4xl rounded-bl-4xl border border-muted bg-app-bg text-app shadow-sm transition duration-300 hover:shadow-md'>
            <div className='p-6'>
                <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2.5'>
                        <Link to="/profile"><Avatar src={post.avatar_url} sx={{ width: 48, height: 48 }} /></Link>
                        <div className='leading-tight'>
                            <h1 className='body-sm text-sm font-semibold'>{post.username}</h1>
                            <p className='body-sm text-xs'>@janedoe</p>
                            <span className='caption text-muted text-xs'>{formatDate(post.created_at)}</span>
                        </div>
                    </div>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700'>
                        <Add className='text-[1rem]' />
                    </div>
                </div>
                <h2 className='mt-3 body-lg'>{post.title}</h2>

                <p className='mt-1 leading-6 body-sm'>{post.description}</p>

                <div className='mt-3 flex flex-wrap gap-2'>
                    {hashtags.map((tag, index) => (
                        <span key={index} className='caption text-app text-color-primary'>
                            #{tag}
                        </span>
                    ))}
                </div>

                {post.media_url && <img src={post.media_url} alt="Project Thumbnail" className="mt-6 w-full rounded-2xl object-cover" />}
                <div className='flex items-center justify-between'>
                    <div className='mt-4 flex items-center gap-3 text-app'>
                        <div onClick={() => handleStarred()} className='flex flex-col items-center justify-center rounded-lg border border-muted px-2.5 py-1 cursor-pointer hover:bg-gray-100'>
                            <span className='flex items-center gap-2'>{isStarred ? <Star fontSize='small' /> : <StarBorder fontSize='small' />}{likes}</span>
                            <p className='text-sm'>Like</p>
                        </div>
                        <div onClick={handleToggleComments} className='flex flex-col items-center justify-center rounded-lg border border-muted px-2.5 py-1 cursor-pointer hover:bg-gray-100'>
                            <ModeComment fontSize='small' />
                            <p className='text-sm'>Comment</p>
                        </div>
                    </div>
                </div>
            </div>
            {openComment && (
                <div className='border-t border-muted px-5 py-4 flex flex-col gap-4'>
                    <div className='flex gap-2'>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className='flex-1 rounded-full border border-muted bg-app-bg px-4 py-1.5 text-sm text-app placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-primary transition'
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            className='rounded-full border border-muted px-4 py-1.5 text-sm font-medium transition hover:bg-surface disabled:opacity-40'
                        >
                            Post
                        </button>
                    </div>

                    {loadingComments && <p className='text-xs text-app-muted'>Loading...</p>}

                    {!loadingComments && comments?.length === 0 && (
                        <p className='text-xs text-app-muted'>No comments yet.</p>
                    )}

                    {!loadingComments && comments?.map((c) => (
                        <div key={c.id} className='flex gap-2.5'>
                            <Link to="/profile">
                                <Avatar src={c.author?.avatar_url} sx={{ width: 28, height: 28 }} />
                            </Link>
                            <div className='flex flex-col leading-tight'>
                                <div className='flex items-baseline gap-1.5'>
                                    <span className='text-sm font-semibold text-app'>{c.author?.username}</span>
                                    <span className='text-xs text-app-muted'>{formatDate(c.created_at)}</span>
                                </div>
                                <p className='text-sm text-app mt-0.5'>{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </article>               
    )
}        
export default PostCard