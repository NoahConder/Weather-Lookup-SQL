const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database("./public/db/data.db");
db.run(`CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT,
        temperature INTEGER,
        feels_like INTEGER,
        humidity INTEGER,
        conditions TEXT,
        detailed_conditions TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

console.log("Database is fully created.")

