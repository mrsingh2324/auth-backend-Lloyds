const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Register a new user
exports.register = (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if user already exists
  db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (row) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert new user
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error creating user' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: this.lastID, role: 'user' },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );
        
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: this.lastID,
            username,
            email,
            role: 'user'
          }
        });
      }
    );
  });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Remove password from response
    const { password: _, ...userData } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  });
};

// Get current user profile
exports.getMe = (req, res) => {
  db.get(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [req.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    }
  );
};

// Admin: Get all users (admin only)
exports.getUsers = (req, res) => {
  db.all(
    'SELECT id, username, email, role, created_at FROM users',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(users);
    }
  );
};

// Update user profile
exports.updateProfile = (req, res) => {
  const { username, email, password } = req.body;
  const updates = [];
  const params = [];

  if (username) {
    updates.push('username = ?');
    params.push(username);
  }
  
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    updates.push('password = ?');
    params.push(hashedPassword);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  params.push(req.userId);
  
  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'Username or email already in use' });
        }
        return res.status(500).json({ message: 'Error updating profile' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'Profile updated successfully' });
    }
  );
};

// Delete user account
exports.deleteAccount = (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting account' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  });
};
