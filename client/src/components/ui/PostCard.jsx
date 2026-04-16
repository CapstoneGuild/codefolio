import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '@mui/material'
import { Add, Star, StarBorder, ModeComment } from '@mui/icons-material'

const PostCard = () => {
    const [isStarred, setIsStarred] = useState(false)
    const hashtags = ['react', 'javascript', 'webdev']

    return (
        <article className='w-full rounded-tr-4xl rounded-bl-4xl border border-muted bg-app-bg text-app shadow-sm transition duration-300 hover:shadow-md'>
            <div className='p-6'>
                <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2.5'>
                        <Link to="/profile"><Avatar src='/static/images/avatar/1' sx={{ width: 34, height: 34 }} /></Link>
                        <div className='leading-tight'>
                            <h1 className='body-md font-semibold'>Jane Doe</h1>
                            <p className='body-sm'>@janedoe</p>
                        </div>
                    </div>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700'>
                        <Add className='text-[1rem]' />
                    </div>
                </div>

                <p className='mt-3 leading-6 body-md'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero placeat necessitatibus, iure modi rem enim excepturi inventore laudantium, ipsum temporibus nemo officiis.</p>

                <div className='mt-3 flex flex-wrap gap-2'>
                    {hashtags.map((tag, index) => (
                        <span key={index} className='caption text-app'>
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className='mt-4 flex items-center gap-3 text-app'>
                    <div onClick={() => setIsStarred(!isStarred)} className='flex items-center gap-1 rounded-full border border-muted px-2.5 py-1'>
                        {isStarred ? <Star fontSize='small' /> : <StarBorder fontSize='small' />}
                        <span>5</span>
                    </div>
                    <div className='flex items-center gap-1 rounded-full border border-muted px-2.5 py-1'>
                        <ModeComment fontSize='small' />
                        <span>5</span>
                    </div>
                </div>
            </div>
        </article>               
    )
}        
export default PostCard