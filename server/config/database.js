import pg from 'pg';

const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
}

export const pool = new pg.Pool(config)