import { Router } from 'express';
import { register, login } from '../controllers/authController';

export const authRouter: Router = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.post('/test', (req, res) => res.json({ ok: true }));

console.log('Auth router loaded');