import { DEFAULT_PROJECT_IMAGE_URL } from '../utils/constants.js';

export const up = async (client) => {
    await client.query(`
        ALTER TABLE projects
        ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '${DEFAULT_PROJECT_IMAGE_URL}';

        UPDATE projects
        SET image_url = '${DEFAULT_PROJECT_IMAGE_URL}'
        WHERE image_url IS NULL;
    `);
};
