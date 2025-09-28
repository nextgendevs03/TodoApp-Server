// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration to accept requests from anywhere
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Set to true if you need to include credentials
}));

app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB with proper error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
      connectTimeoutMS: 15000, // Connection timeout
      socketTimeoutMS: 45000, // Socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    console.error('Please check your MONGO_URI and network connectivity');
    // Don't exit process, let it retry
  }
};

// Initialize database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/todos', todoRoutes); // Todo CRUD routes

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Todo App Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
