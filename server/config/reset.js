import { pool } from './database.js';
import './dotenv.js';
import hashtagData from '../data/hashtags.js';

dotenv.config();

//🧹 DROP All tables

const dropTables = async () => {
    const query =`
    DROP TABLE IF EXISTS post_hashags;
    DROP TABLE IF EXISTS profile_hashtags;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS bookmarks;
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS network;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS profiles;
    DROP TABLE IF EXISTS hashtags;
    DROP TABLE IF EXISTS auth.users;
    `;

    try {
        await pool.query(query);
        console.log('🧹 All tables dropped successfully!');
    } catch (err) {
        console.error('⚠️Error dropping table:', err);
    }
};


/* 🪄 Create all tables */

//Table 1 of 11 - Authorized Users
const createAuthUsersTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS auth.users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE,
            encrypted_password TEXT,
            github_id TEXT UNIQUE,
            provider TEXT DEFAULT 'github',
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Auth users table created successfully');
    } catch (err) {
        console.error('Error creating auth users table:', err);
    }
};

//Table 2 of 11 - Hashtags
const createHashtagsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tag_text TEXT UNIQUE,
            category TEXT,
            created_at TIMESTAMP DEFAULT now()
        );

        -- Function: auto-convert tags to lowercase before saving
        CREATE OR REPLACE FUNCTION tag_case()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.tag_text := LOWER(NEW.tag_text);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Trigger: applies lowercase conversion before insert or update
        CREATE TRIGGER tag_case_trigger
        BEFORE INSERT OR UPDATE ON hashtags
        FOR EACH ROW EXECUTE FUNCTION tag_case();
    `;

    try {
        await pool.query(query);
        console.log('Hashtags table created successfully');
    } catch (err) {
        console.error('Error creating hashtags table:', err);
    }
};

//Table 3 of 11 - Profiles
const createProfilesTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            username TEXT UNIQUE,
            bio TEXT,
            location TEXT,
            avatar_url TEXT,
            links TEXT,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Profiles table created successfully');
    } catch (err) {
        console.error('Error creating profiles table:', err);
    }
};

//Table 4 of 11 - Posts
const createPostsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            profile_id UUID REFERENCES profiles(id),
            title TEXT,
            description TEXT,
            media_url TEXT,
            link TEXT,
            likes_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Posts table created successfully');
    } catch (err) {
        console.error('Error creating posts table:', err);
    }
};

//Table 5 of 11 - Projects
const createProjectsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            profile_id UUID REFERENCES profiles(id),
            title TEXT,
            description TEXT,
            tech_stack TEXT,
            demo_url TEXT,
            collaborators TEXT,
            links TEXT,
            license TEXT,
            md_content TEXT,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Projects table created successfully');
    } catch (err) {
        console.error('Error creating projects table:', err);
    }
};

//Table 6 of 11 - Network
const createNetworkTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS network (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            requester_id UUID REFERENCES profiles(id),
            receiver_id UUID REFERENCES profiles(id),
            status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Network table created successfully');
    } catch (err) {
        console.error('Error creating network table:', err);
    }
};

//Table 7 of 11 - Messages
const createMessagesTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            sender_id UUID REFERENCES profiles(id),
            receiver_id UUID REFERENCES profiles(id),
            status TEXT CHECK (status IN ('read', 'unread')),
            content TEXT,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Messages table created successfully');
    } catch (err) {
        console.error('Error creating messages table:', err);
    }
};

//Table 8 of 11 - Bookmarks
const createBookmarksTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS bookmarks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(id),
            post_id REFERENCES posts(id),
            project_id REFERENCES projects(id),
            created_at TIMESTAMP DEFAULT now(),
            CHECK (
                (post_id IS NOT NULL AND project_id IS NULL)
                OR (post_id IS NULL AND project_id IS NOT NULL)
            ),
            UNIQUE (profile_id, post_id),
            UNIQUE (profile_id, project_id)
        );
    `;

    try {
        await pool.query(query);
        console.log('Bookmarks table created successfully');
    } catch (err) {
        console.error('Error creating bookmarks table:', err);
    }
};

//Table 9 of 11 - Comments
const createCommentsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            post_id UUID REFERENCES posts(id),
            profile_id UUID REFERENCES profiles(id),
            content TEXT,
            created_at TIMESTAMP DEFAULT now()
            UNIQUE (post_id, profile_id, content)
        );
    `;

    try {
        await pool.query(query);
        console.log('Comments table created successfully');
    } catch (err) {
        console.error('Error creating comments table:', err);
    }
};

//Table 10 of 11 - Profile Hashtags
const createProfileHashtagsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS profile_hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(id),
            hashtag_id UUID REFERENCES hashtags(id)
        );
    `;

    try {
        await pool.query(query);
        console.log('Profile hashtags table created successfully');
    } catch (err) {
        console.error('Error creating profile hashtags table:', err);
    }
};

//Table 11 of 11 - Post Hashtags
const createPostHashtagsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS post_hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            post_id UUID REFERENCES posts(id),
            hashtag_id UUID REFERENCES hashtags(id)
        );
    `;

    try {
        await pool.query(query);
        console.log('Post hashtags table created successfully');
    } catch (err) {
        console.error('Error creating post hashtags table:', err);
    }
};



/* 🌱 Seed tables */

//Table 2: Hashtags
const seedHashtagsTable = async () => {
    for (const hashtag of hashtagData) {
        const insertQuery = `
        INSERT INTO hashtags (tag_text, category)
        VALUES ($1, $2)
        `;

        const values = [
            hashtag.tag_text,
            hashtag.category
        ];

        try {
            await pool.query(insertQuery, values);
            console.log(`Hashtag added successfully: ${hashtag.tag_text}!`);
        } catch (err) {
            console.error('Error inserting hashtag:', err);
        }
    }
};

//Reset function to drop, create, and seed tables in the correct order
const resetDatabase = async () => {
    await dropTables();

    await createAuthUsersTable();
    await createHashtagsTable();
    await createProfilesTable();
    await createPostsTable();
    await createProjectsTable();
    await createNetworkTable();
    await createMessagesTable();
    await createBookmarksTable();
    await createCommentsTable();
    await createProfileHashtagsTable();
    await createPostHashtagsTable();

    await seedHashtagsTable();

    console.log('🎉 Database reset complete!');
}

resetDatabase();
