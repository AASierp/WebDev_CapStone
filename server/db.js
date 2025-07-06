const Database = require('better-sqlite3');

const db = new Database('./users.db');

db.exec(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL);
    `)

module.exports = db;