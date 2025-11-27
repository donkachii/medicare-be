# medicare-be

A Node.js backend application with authentication and authorization for the Medicare project.

## Table of Contents
- [Setup](#setup)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/donkachii/medicare-be.git
cd medicare-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## Authentication & Authorization

This application implements a complete JWT-based authentication and role-based authorization system.

### Architecture Overview

The auth system consists of:
- **User Model** (`models/user.js`) - MongoDB schema for user data
- **Auth Controller** (`controllers/auth.js`) - Business logic for auth operations
- **Auth Middleware** (`middleware/auth.js`) - JWT verification and role-based access control
- **Auth Routes** (`routes/auth.js`) - API endpoint definitions

### Implementation Steps

#### 1. User Model Setup

Created a Mongoose schema with the following fields:
- `firstName`, `lastName`, `username` - User identification
- `email` - Unique, lowercase, trimmed
- `password` - Hashed with bcrypt (min 8 characters)
- `role` - Enum: `['admin', 'user']`, defaults to `'user'`
- `createdAt`, `updatedAt` - Timestamps

#### 2. Dependencies Installation

Installed required packages:
```bash
npm install express mongoose bcrypt jsonwebtoken dotenv cors
```

Key packages:
- `bcrypt` (v6.0.0) - Password hashing
- `jsonwebtoken` (v9.0.2) - JWT token generation and verification
- `mongoose` (v9.0.0) - MongoDB ODM
- `express` (v5.1.0) - Web framework
- `dotenv` (v17.2.3) - Environment variable management
- `cors` (v2.8.5) - Cross-origin resource sharing

#### 3. Authentication Controller

Implemented four main functions:

**a. User Registration (`register`)**
- Validates all required fields (firstName, lastName, username, email, password, role)
- Checks for existing users by email
- Hashes password using bcrypt with salt rounds of 10
- Creates new user in MongoDB
- Generates JWT token with user data (expires in 7 days)
- Returns token and user object (without password)

**b. User Login (`login`)**
- Validates email and password fields
- Finds user by email
- Compares password hash using bcrypt
- Generates JWT token with user data (expires in 7 days)
- Returns token and user object (without password)

**c. Get User By ID (`getUserById`)**
- Fetches single user by MongoDB ID
- Excludes password field from response
- Returns user data or 404 if not found

**d. Get All Users (`getAllUsers`)**
- Fetches all users from database
- Excludes password field from response
- Returns array of user objects

#### 4. Authentication Middleware

Implemented two middleware functions:

**a. Token Verification Middleware (`authMiddleware`)**
- Extracts Bearer token from Authorization header
- Validates token format
- Verifies JWT signature using JWT_SECRET
- Decodes token and attaches user data to `req.user`
- Returns 401 if token is missing, invalid, or expired

**b. Admin Authorization Middleware (`adminMiddleware`)**
- Checks if authenticated user has admin role
- Must be used after `authMiddleware`
- Returns 401 if user is not an admin
- Allows request to proceed if user is admin

#### 5. Route Configuration

Defined four auth endpoints:

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/auth/register` | None | Register new user |
| POST | `/auth/login` | None | Login existing user |
| GET | `/auth/:id` | `authMiddleware` | Get user by ID (authenticated users only) |
| GET | `/auth/` | `authMiddleware`, `adminMiddleware` | Get all users (admin only) |

#### 6. Server Setup

Configured Express application:
- Enabled CORS for cross-origin requests
- Added JSON body parser middleware
- Connected to MongoDB using Mongoose
- Mounted auth routes at `/auth` prefix
- Set up environment variables with dotenv

### Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds before storage
- **JWT Tokens**: Tokens expire after 7 days and include user ID, username, name, email, and role
- **Role-Based Access Control**: Admin-only routes protected with `adminMiddleware`
- **Token Verification**: All protected routes verify JWT signature and expiration
- **Email Uniqueness**: Database enforces unique email addresses
- **Password Minimum Length**: Minimum 8 characters enforced at model level

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

Response:
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Protected Endpoints

#### Get User By ID (Authenticated)
```http
GET /auth/:id
Authorization: Bearer <token>
```

Response:
```json
{
  "message": "User found",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get All Users (Admin Only)
```http
GET /auth/
Authorization: Bearer <token>
```

Response:
```json
{
  "message": "Users found",
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
    }
  ]
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/medicare

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Project Structure

```
medicare-be/
├── controllers/
│   └── auth.js          # Authentication logic
├── middleware/
│   ├── auth.js          # JWT verification & authorization
│   └── error.js         # Error handling
├── models/
│   └── user.js          # User schema
├── routes/
│   ├── auth.js          # Auth endpoints
│   └── index.js         # Route aggregator
├── index.js             # Application entry point
├── package.json         # Dependencies
└── .env                 # Environment variables (not in git)
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
