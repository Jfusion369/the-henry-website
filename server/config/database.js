const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_URL || path.join(dataDir, 'contacts.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Create contacts table
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'new',
            notes TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating contacts table:', err);
        } else {
            console.log('Contacts table initialized');
        }
    });

    // Create newsletter subscriptions table
    db.run(`
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            active BOOLEAN DEFAULT 1
        )
    `, (err) => {
        if (err) {
            console.error('Error creating newsletter table:', err);
        } else {
            console.log('Newsletter subscriptions table initialized');
        }
    });
}

module.exports = db;
