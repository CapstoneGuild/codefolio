import { pool } from '../config/database.js';

const getBookmarksByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                b.id AS bookmark_id,
                b.created_at,
                p.*,
                prj.id AS project_id,
                prj.profile_id AS project_profile_id,
                prj.title AS project_title,
                prj.description AS project_description,
                prj.tech_stack AS project_tech_stack,
                prj.demo_url AS project_demo_url,
                prj.collaborators AS project_collaborators,
                prj.links AS project_links,
                prj.license AS project_license,
                prj.image_url AS project_image_url,
                prj.created_at AS project_created_at
            FROM bookmarks b
            JOIN profiles pr ON pr.id = b.profile_id
            LEFT JOIN posts p ON p.id = b.post_id
            LEFT JOIN projects prj ON prj.id = b.project_id
            WHERE pr.user_id = $1
            ORDER BY b.created_at DESC
            `,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching bookmarks:', err);
        res.status(500).json({ message: "Unable to fetch bookmarks" });
    }
};

const createBookmark = async (req, res) => {
    const userId = req.user.id;
    const { postId, projectId } = req.body;

    try {
        const userProfile = await pool.query(`
            SELECT id FROM profiles WHERE user_id = $1
            `,
            [userId]
        );

        //Get user's profile
        if (userProfile.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found for user" });
        }
        const profileId = userProfile.rows[0].id;

        //Create bookmark
        const newBookmark = await pool.query(`
            INSERT INTO bookmarks (profile_id, post_id, project_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [profileId, postId || null, projectId || null]
        );

        res.status(201).json(newBookmark.rows[0]);

    } catch (err) {
        console.error('Error creating bookmark:', err);

        if(err.code === '23505') {
            return res.status(409).json({ message: "Already bookmarked"});
        }

        res.status(500).json({ message: "Unable to create bookmark" });
    }
};

const deleteBookmark = async (req, res) => {
    const userId = req.user.id;
    const { bookmarkId } = req.params;

    try {
        //Get user's profile
        const userProfile = await pool.query(`
            SELECT id FROM profiles WHERE user_id = $1
            `,
            [userId]
        );

        if (userProfile.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found for user" });
        }
        const profileId = userProfile.rows[0].id;

        //Delete associated bookmark
        const deletedBookmark = await pool.query(`
            DELETE FROM bookmarks
            WHERE id = $1 AND profile_id = $2
            `,
            [bookmarkId, profileId]
        );

        if (deletedBookmark.rowCount === 0) {
            return res.status(404).json({ message: "Bookmark not found or unauthorized" });
        }

        res.json({ message: "Bookmark deleted successfully" });

    } catch (err) {
        console.error('Error deleting bookmark:', err);
        res.status(500).json({ message: "Unable to delete bookmark" });
    }
};

export default {
    getBookmarksByUser,
    createBookmark,
    deleteBookmark
};
