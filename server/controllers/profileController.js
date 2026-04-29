import { pool } from "../config/database.js";

const getProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const profile = await pool.query(`SELECT id, user_id, bio, location, github_url, linkedin_url, other_url, created_at, is_complete FROM profiles WHERE id = $1`, [id]);
        if (profile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error fetching profile', error: err.message });
    }
}

const getProfileByUserId = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const result = await pool.query(
            `SELECT
                p.id,
                p.user_id,
                p.bio,
                p.location,
                p.github_url,
                p.linkedin_url,
                p.other_url,
                p.created_at,
                p.is_complete,
                u.username,
                u.avatar_url
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = $1`, [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" })
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
}

const createProfile = async (req, res) => {
    const userId = req.user?.id;
    const { bio, location, github_url, linkedin_url, other_url } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const newProfile = await pool.query(
            `INSERT INTO profiles (user_id, bio, location, github_url, linkedin_url, other_url, is_complete)
             VALUES ($1, $2, $3, $4, $5, $6, true)
             RETURNING *`,
            [userId, bio, location, github_url, linkedin_url, other_url]
        );
        res.status(201).json(newProfile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error creating profile', error: err.message });
    }
}

const updateProfile = async (req, res) => {
    const userId = req.params.user_id;
    const { bio, location, github_url, linkedin_url, other_url } = req.body;

    try {
        const updated = await pool.query(
            `UPDATE profiles
             SET bio = $1,
                 location = $2,
                 github_url = $3,
                 linkedin_url = $4,
                 other_url = $5,
                 is_complete = true
             WHERE user_id = $6
             RETURNING *`,
            [bio, location, github_url, linkedin_url, other_url, userId]
        );
        if (updated.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(updated.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error updating profile', error: err.message });
    }
}

export default {
    getProfile,
    getProfileByUserId,
    createProfile,
    updateProfile
}
