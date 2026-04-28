import {createAPIInstance, API_BASE_URL} from './api.jsx';

const bookmark = createAPIInstance(`${API_BASE_URL}/api/bookmarks`)

const getBookmarksByUser = async (userId) => {
    try {
        const response = await bookmark.get(`/user/${userId}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to fetch bookmarks')
    }
};

const createBookmark = async ({ postId, projectId }) => {
    try {
        const response = await bookmark.post('/', { postId, projectId });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to create bookmark')
    }
};

const deleteBookmark = async (bookmarkId) => {
    try {
        const response = await bookmark.delete(`/${bookmarkId}`)
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Unable to delete bookmark')
    }
}

export default {
    getBookmarksByUser,
    createBookmark,
    deleteBookmark
};
