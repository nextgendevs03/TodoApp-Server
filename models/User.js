// Import mongoose for database operations
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema
const userSchema = new mongoose.Schema({
  // Full name field - required
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  
  // Email field - required and must be unique
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Phone number field - required and must be unique
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 10,
    maxlength: 15
  },
  
  // Password field - required
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  // Add timestamps for createdAt and updatedAt
  timestamps: true
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) return next();
  
  // Hash password with salt rounds of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export User model
module.exports = mongoose.model('User', userSchema);
