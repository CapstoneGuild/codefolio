import express from "express";
import isAuthenticated from "../middleware/authMiddleware.js";
import projectController from "../controllers/projectController.js";
import postController from "../controllers/postController.js";
import profileController from "../controllers/profileController.js";
import networkController from "../controllers/networkController.js";
import bookmarksController from "../controllers/bookmarksController.js";

const router = express.Router();

router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.get('/projects/user/:userId', projectController.getProjectsByUser);
router.post('/projects', isAuthenticated, projectController.createProject);
router.patch('/projects/:id', isAuthenticated, projectController.updateProject);
router.delete('/projects/:id', isAuthenticated, projectController.deleteProject);

router.get('/posts', postController.getAllPosts);
router.post('/posts', isAuthenticated, postController.createPost);
router.delete('/posts/:id', isAuthenticated, postController.deletePost);
router.post('/posts/:id/comments', isAuthenticated, postController.addComment);

router.get('/posts/:id/comments', postController.getPostComments);

router.get('/hashtags/search', postController.searchHashtags);

router.get('/profiles/user/:user_id', profileController.getProfileByUserId);
router.get('/profiles/:id', profileController.getProfile);
router.post('/profiles', isAuthenticated, profileController.createProfile);
router.patch('/profiles/user/:user_id', isAuthenticated, profileController.updateProfile);

router.post('/network/requests', isAuthenticated, networkController.sendRequest);
router.patch('/network/requests/:networkId/accept', isAuthenticated, networkController.acceptRequest);
router.delete('/network/requests/:networkId/reject', isAuthenticated, networkController.rejectRequest);
router.delete('/network/connections/:networkId', isAuthenticated, networkController.disconnectConnection);
router.get('/network/requests/pending', isAuthenticated, networkController.getPendingRequests);
router.get('/network/connections', isAuthenticated, networkController.getAllConnections);
router.get('/network/suggestedprofiles', isAuthenticated, networkController.getSuggestedProfiles)

router.get('/bookmarks/user/:userId', isAuthenticated, bookmarksController.getBookmarksByUser)
router.post('/bookmarks', isAuthenticated, bookmarksController.createBookmark)
router.delete('/bookmarks/:bookmarkId', isAuthenticated, bookmarksController.deleteBookmark)

export default router;
