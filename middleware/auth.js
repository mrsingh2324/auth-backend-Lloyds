const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user has admin role
exports.isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Middleware to check if user is the owner or admin
exports.isOwnerOrAdmin = (req, res, next) => {
  const { id } = req.params;
  
  db.get('SELECT id, role FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.userId === id || req.userRole === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized to access this resource' });
    }
  });
};
