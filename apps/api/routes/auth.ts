import express, { Router } from 'express';
import { register, login } from '../controllers/authController';

const authRouter: Router = express.Router();


authRouter.route('/register').post(register);
authRouter.route('/login').post(login);


export default authRouter;