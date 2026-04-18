import pg from 'pg';

const config = {
    connectionString: process.env.DATABASE_URL,
};

export const pool = new pg.Pool(config);
