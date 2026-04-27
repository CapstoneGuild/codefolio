export const up = async (client) => {
    await client.query(`
        ALTER TABLE profiles
        ADD COLUMN IF NOT EXISTS github_url TEXT,
        ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
        ADD COLUMN IF NOT EXISTS other_url TEXT;
    `);
};
