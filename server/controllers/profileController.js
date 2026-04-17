import { pool } from "../config/database.js";

const getProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const profile = await pool.query(`SELECT * FROM profiles WHERE id = $1`, [id]);
        if (profile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error fetching profile', error: err.message });    
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
            `INSERT INTO profiles (user_id, bio, location, github_url, linkedin_url, other_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, bio, location, github_url, linkedin_url, other_url]
        );
        res.status(201).json(newProfile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error creating profile', error: err.message });    
    }
}

const updateprofile = async (req, res) => {
    const id = req.params.id;
    const { bio, location, github_url, linkedin_url, other_url } = req.body;

    try {
        const updatedProfile = await pool.query(
            `UPDATE profiles
             SET bio = $1,
                 location = $2,
                 github_url = $3,
                 linkedin_url = $4,
                 other_url = $5
             WHERE id = $6
             RETURNING *`,
            [bio, location, github_url, linkedin_url, other_url, id]
        );
        if (updatedProfile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(updatedProfile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error updating profile', error: err.message });    
    }
}

export default {
    getProfile,
    createProfile,
    updateprofile
}