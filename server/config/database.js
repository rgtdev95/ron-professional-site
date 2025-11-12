import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_PATH = join(__dirname, '../database/portfolio.db');
const SCHEMA_PATH = join(__dirname, '../database/schema.sql');

// Initialize database
let db = null;

export function initializeDatabase() {
    try {
        // Create database connection
        db = new Database(DB_PATH);
        
        // Enable foreign keys
        db.pragma('foreign_keys = ON');
        
        // Read and execute schema
        const schema = readFileSync(SCHEMA_PATH, 'utf8');
        db.exec(schema);
        
        // Insert default settings if they don't exist
        insertDefaultSettings();
        
        console.log('✅ Database initialized successfully');
        return db;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

function insertDefaultSettings() {
    const defaultSettings = [
        {
            setting_key: 'site_title',
            setting_value: 'My Portfolio',
            description: 'Main site title'
        },
        {
            setting_key: 'site_description',
            setting_value: 'Full-stack developer portfolio',
            description: 'Site meta description'
        },
        {
            setting_key: 'contact_email',
            setting_value: 'contact@example.com',
            description: 'Primary contact email'
        }
    ];

    const insertSetting = db.prepare(`
        INSERT OR IGNORE INTO site_settings (setting_key, setting_value, description)
        VALUES (?, ?, ?)
    `);

    for (const setting of defaultSettings) {
        insertSetting.run(setting.setting_key, setting.setting_value, setting.description);
    }
}

export function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}

export function closeDatabase() {
    if (db) {
        db.close();
        console.log('📝 Database connection closed');
    }
}

// Graceful shutdown
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);
