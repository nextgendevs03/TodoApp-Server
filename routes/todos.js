// Import required packages
const express = require('express');
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/auth');

// Create router
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET all todos for logged-in user
router.get('/', async (req, res) => {
  try {
    // Find all todos for current user
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: todos.length,
      todos
    });
    
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos'
    });
  }
});

// GET single todo by ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      todo
    });
    
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo'
    });
  }
});

// CREATE new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // Check if title is provided
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Todo title is required'
      });
    }
    
    // Validate status if provided
    if (status && !['new', 'inprogress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: new, inprogress, completed'
      });
    }
    
    // Create new todo
    const todo = new Todo({
      title,
      description,
      status,
      user: req.user._id
    });
    
    await todo.save();
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo
    });
    
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo'
    });
  }
});

// UPDATE todo by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // Validate status if provided
    if (status && !['new', 'inprogress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: new, inprogress, completed'
      });
    }
    
    // Find and update todo
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status },
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      todo
    });
    
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo'
    });
  }
});

// TOGGLE todo status (cycle through: new -> inprogress -> completed -> new)
router.patch('/:id/toggle', async (req, res) => {
  try {
    // Find todo first to get current status
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    // Cycle through status: new -> inprogress -> completed -> new
    let nextStatus;
    switch (todo.status) {
      case 'new':
        nextStatus = 'inprogress';
        break;
      case 'inprogress':
        nextStatus = 'completed';
        break;
      case 'completed':
        nextStatus = 'new';
        break;
      default:
        nextStatus = 'new';
    }
    
    todo.status = nextStatus;
    await todo.save();
    
    res.json({
      success: true,
      message: `Todo status changed to ${nextStatus}`,
      todo
    });
    
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling todo status'
    });
  }
});

// DELETE todo by ID
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo'
    });
  }
});

module.exports = router;
