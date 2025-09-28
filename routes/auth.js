// Import required packages
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create router
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '7d' }
  );
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;
    
    // Check if all required fields are provided
    if (!fullname || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullname, email, phone number, and password'
      });
    }
    
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not ready. Please try again in a moment.'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone number already exists'
      });
    }
    
    // Create new user
    const user = new User({ fullname, email, phone, password });
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Send response (don't send password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.message.includes('before initial connection') || error.message.includes('buffering timed out')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again in a moment.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Check if phone and password are provided
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and password'
      });
    }
    
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not ready. Please try again in a moment.'
      });
    }
    
    // Find user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Send response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.message.includes('before initial connection') || error.message.includes('buffering timed out')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again in a moment.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

module.exports = router;
