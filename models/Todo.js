// Import mongoose for database operations
const mongoose = require('mongoose');

// Define Todo schema
const todoSchema = new mongoose.Schema({
  // Title of the todo - required
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Description of the todo - optional
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Status of the todo - enum with specific values
  status: {
    type: String,
    enum: ['new', 'inprogress', 'completed'],
    default: 'new'
  },
  
  // Reference to the user who owns this todo
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  // Add timestamps for createdAt and updatedAt
  timestamps: true
});

// Create and export Todo model
module.exports = mongoose.model('Todo', todoSchema);
