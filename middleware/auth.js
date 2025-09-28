// Import required packages
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to protect routes
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check database connection status
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database connection not ready. Please try again.' 
      });
    }
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found' 
      });
    }
    
    // Add user info to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.message.includes('buffering timed out') || error.message.includes('before initial connection')) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database connection error. Please try again.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

module.exports = authenticateToken;
