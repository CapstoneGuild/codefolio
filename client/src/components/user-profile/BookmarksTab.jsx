import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import bookmarkService from '../../services/bookmarkService';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import ProjectCard from '../ui/ProjectCard';

const BookmarksTab = () => {
    const { id } = useParams();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                const data = await bookmarkService.getBookmarksByUser(id);
                setBookmarks(data);

            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [id]);

     if (loading) return (
        <div className="w-full h-full flex items-center justify-center bg-app-bg max-w-none transition duration-300 text-app">
        <LoadingSpinner />
        </div>
    )
    if (error) return (
        <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
        <ErrorMessage />
        </div>
    )

    return (
        <div className="px-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {bookmarks.map((bookmark) => (
                    bookmark.project_id && (
                        <Link
                            key={bookmark.project_id}
                            to={`/projects/${bookmark.project_id}`}
                        >
                            <ProjectCard
                                key={bookmark.bookmark_id}
                                project={{
                                    id: bookmark.project_id,
                                    title: bookmark.project_title,
                                    description: bookmark.project_description,
                                    image_url: bookmark.project_image_url,
                                    tech_stack: bookmark.project_tech_stack
                                }}
                            />
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
};

export default BookmarksTab;
