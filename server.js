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

// MongoDB connection handling for serverless
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';
    console.log('🔄 Connecting to MongoDB...', mongoUri ? 'URI provided' : 'Using localhost');
    
    cachedConnection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Reduced for serverless
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5, // Reduced pool size for serverless
      maxIdleTimeMS: 30000,
      bufferCommands: false, // Important for serverless
    });
    
    console.log('✅ Connected to MongoDB');
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

// Initialize database connection (but don't await in serverless)
if (process.env.NODE_ENV !== 'production') {
  connectDB().catch(console.error);
}

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 Database not connected, connecting...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/todos', todoRoutes); // Todo CRUD routes

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Todo App Server is running!' });
});

// Start server locally (not in serverless environment)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
