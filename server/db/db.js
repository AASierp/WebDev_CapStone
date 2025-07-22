// interesting point here - the two statements below do the same thing, the "require" syntax is used by default in Node (CommonJS)
// while the 'import' syntax is used by the frontend(ES Modules) - however u can use 'import' in the backend also, by adding "type" : "module"
// to the top level of your package.json
// also, this is synonymous with using 'using' in c# - it is just saying "we are importing and using this library"

//const Database = require('better-sqlite3');
import Database from "better-sqlite3";

//database instantiation - can now access the database using the alias 'db' . 'method'
const db = new Database("./db/taskforge.db");

//creating user table
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
    )
    `);
//creating "Tasks" table
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         userId INTEGER NOT NULL,
         title TEXT NOT NULL,
         status TEXT DEFAULT 'backlog',
         description TEXT,
         FOREIGN KEY (userId) REFERENCES users(id)
    )`);

export default db;
