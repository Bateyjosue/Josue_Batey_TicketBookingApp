import express, { Router } from 'express';
import { register, login } from '../controllers/authController';

const authRouter: Router = express.Router();


authRouter.post('/register', register);
authRouter.route('/login').post(login);


export default authRouter;