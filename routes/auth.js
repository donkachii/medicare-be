import express from 'express';
import { register, login, getUserById, getAllUsers } from '../controllers/auth.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const authRoutes = express.Router();

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.get('/:id', authMiddleware, getUserById)
authRoutes.get('/', [authMiddleware, adminMiddleware], getAllUsers)

export default authRoutes;