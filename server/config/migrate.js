import './dotenv.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { pool } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');

const ensureMigrationsTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name TEXT UNIQUE NOT NULL,
            applied_at TIMESTAMP DEFAULT now()
        );
    `);
};

const getMigrationFiles = async () => {
    const entries = await fs.readdir(MIGRATIONS_DIR, { withFileTypes: true });

    return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
        .map((entry) => entry.name)
        .sort();
};

const getAppliedMigrations = async () => {
    const result = await pool.query('SELECT name FROM schema_migrations ORDER BY name');
    return new Set(result.rows.map((row) => row.name));
};

const loadMigration = async (fileName) => {
    const migrationPath = path.resolve(MIGRATIONS_DIR, fileName);
    const migrationModule = await import(pathToFileURL(migrationPath).href);

    if (typeof migrationModule.up !== 'function') {
        throw new Error(`Migration ${fileName} must export an 'up' function.`);
    }

    return migrationModule.up;
};

const printStatus = async () => {
    const files = await getMigrationFiles();
    const applied = await getAppliedMigrations();

    if (files.length === 0) {
        console.log('No migration files found.');
        return;
    }

    for (const fileName of files) {
        const status = applied.has(fileName) ? 'APPLIED' : 'PENDING';
        console.log(`${status.padEnd(8)} ${fileName}`);
    }
};

const runMigrations = async () => {
    const files = await getMigrationFiles();
    const applied = await getAppliedMigrations();

    const pending = files.filter((fileName) => !applied.has(fileName));

    if (pending.length === 0) {
        console.log('No pending migrations.');
        return;
    }

    for (const fileName of pending) {
        const client = await pool.connect();

        try {
            const up = await loadMigration(fileName);
            await client.query('BEGIN');
            await up(client);
            await client.query(
                'INSERT INTO schema_migrations (name) VALUES ($1)',
                [fileName]
            );
            await client.query('COMMIT');
            console.log(`Applied migration: ${fileName}`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(`Failed migration: ${fileName}`);
            throw err;
        } finally {
            client.release();
        }
    }
};

const main = async () => {
    const shouldPrintStatus = process.argv.includes('--status');

    try {
        await ensureMigrationsTable();

        if (shouldPrintStatus) {
            await printStatus();
        } else {
            await runMigrations();
        }
    } catch (err) {
        console.error('Migration runner error:', err.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

main();
