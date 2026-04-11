import passportGitHub from 'passport-github2'
import './dotenv.js'
import { pool } from './database.js'

const GitHubStrategy = passportGitHub.Strategy

const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback'
}

const verify = async (accessToken, refreshToken, profile, callback) => {
    const { _json: { id, login, avatar_url} } = profile
    const userData = {
        githubId: id,
        username: login,
        avatarUrl: avatar_url,
        accessToken
    }

    try {
        const results = await pool.query('SELECT * FROM users WHERE user_metadata->>\'username\' = $1', [userData.username])
        const user = results.rows[0]

        if (!user) {
            const newResults = await pool.query(
                `INSERT INTO users (user_metadata)
                VALUES ($1)
                RETURNING *`,
                [JSON.stringify({
                    githubId: userData.githubId,
                    username: userData.username, 
                    avatarUrl: userData.avatarUrl,
                    accessToken: accessToken
                })]
            )

            const newUser = newResults.rows[0]
            return callback(null, newUser)
        }
        return callback(null, user)
    }
    catch(error) {
        return callback(error)
    }
}

export const GitHub = new GitHubStrategy(options, verify)