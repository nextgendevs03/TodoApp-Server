# Todo App Server

A simple and beginner-friendly Todo application backend built with Node.js, Express.js, and MongoDB.

## Features

- User registration and login with JWT authentication
- Full CRUD operations for todos
- User-specific todos (users can only see their own todos)
- Password hashing for security
- RESTful API design
- MongoDB for data storage

## Project Structure

```
TodoApp-Server/
├── models/
│   ├── User.js          # User database model
│   └── Todo.js          # Todo database model
├── routes/
│   ├── auth.js          # Authentication routes (register, login)
│   └── todos.js         # Todo CRUD routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── config.env           # Environment configuration example
└── README.md           # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone or download this project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env` to `.env`
   - Update the values in `.env`:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/todoapp
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     NODE_ENV=development
     ```

4. **Make sure MongoDB is running:**
   - If using local MongoDB: Start MongoDB service
   - If using MongoDB Atlas: Update MONGO_URI with your connection string

5. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

#### Register User
- **URL:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
  ```

#### Login User
- **URL:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "phone": "1234567890",
    "password": "password123"
  }
  ```

### Todo Routes (Require Authentication)

**Note:** All todo routes require an Authorization header with JWT token:
```
Authorization: Bearer your-jwt-token-here
```

#### Get All Todos
- **URL:** `GET /api/todos`

#### Get Single Todo
- **URL:** `GET /api/todos/:id`

#### Create New Todo
- **URL:** `POST /api/todos`
- **Body:**
  ```json
  {
    "title": "Buy groceries",
    "description": "Buy milk, eggs, and bread",
    "status": "new"
  }
  ```

#### Update Todo
- **URL:** `PUT /api/todos/:id`
- **Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "inprogress"
  }
  ```

#### Toggle Todo Status
- **URL:** `PATCH /api/todos/:id/toggle`
- **Description:** Cycles through status: new → inprogress → completed → new

#### Delete Todo
- **URL:** `DELETE /api/todos/:id`

## Testing the API

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

### Example curl commands:

1. **Register:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"fullname":"John Doe","email":"john@example.com","phone":"1234567890","password":"password123"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"phone":"1234567890","password":"password123"}'
   ```

3. **Create Todo (replace YOUR_TOKEN with actual token):**
   ```bash
   curl -X POST http://localhost:5000/api/todos \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_TOKEN" \
   -d '{"title":"My first todo","description":"This is my first todo item","status":"new"}'
   ```

## Understanding the Code

This project is designed to be beginner-friendly. Here's what each file does:

- **server.js**: Main entry point, sets up Express server and connects to MongoDB
- **models/User.js**: Defines how user data is stored in the database
- **models/Todo.js**: Defines how todo data is stored in the database
- **middleware/auth.js**: Checks if users are logged in before accessing todos
- **routes/auth.js**: Handles user registration and login
- **routes/todos.js**: Handles all todo operations (create, read, update, delete)

## Common Issues and Solutions

1. **MongoDB connection error**: Make sure MongoDB is running and the connection string is correct
2. **JWT token error**: Make sure you're sending the token in the Authorization header
3. **CORS error**: The server includes CORS middleware, but you might need to adjust it for your frontend

## Next Steps

To extend this application, you could add:
- Email verification for new users
- Password reset functionality
- Todo categories or tags
- File attachments for todos
- Due date reminders
- Sharing todos between users

## Contributing

This is a learning project. Feel free to modify and experiment with the code!
