const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database connection
const db = new sqlite3.Database(
  path.join(__dirname, '../database.sqlite'),
  (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      initializeDatabase();
    }
  }
);

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create a default admin user (password: admin123)
    const adminPassword = require('bcryptjs').hashSync('admin123', 10);
    db.get("SELECT id FROM users WHERE username = 'admin'", [], (err, row) => {
      if (!row) {
        db.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          ['admin', 'admin@example.com', adminPassword, 'admin']
        );
        console.log('Default admin user created');
      }
    });
  });
}

module.exports = db;
