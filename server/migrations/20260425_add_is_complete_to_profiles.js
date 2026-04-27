export const up = async (client) => {
    await client.query(`
        ALTER TABLE profiles
        ADD COLUMN is_complete BOOLEAN DEFAULT false;
    `);
};

export const down = async (client) => {
    await client.query(`
        ALTER TABLE profiles
        DROP COLUMN is_complete;
    `);
};
