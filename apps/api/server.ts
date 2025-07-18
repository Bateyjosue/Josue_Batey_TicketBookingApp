import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import cors from 'cors';
import helmet from 'helmet';
dotenv.config();

const app = express();
const port = process.env.PORT || 3005;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketbooking';



mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');

        app.use(cors());
        app.use(helmet());
        app.use(express.json());

        app.use('/auth', (req, res) => {
            console.log('Not found');
            res.status(404).json({ message: 'Not found' });
        });

        // app.use('*', (req, res) => {
        //     console.log('Not found');
        //     res.status(404).json({ message: 'Not found' });
        // });

        app.get('/', (req, res) => {
            res.send('Hello from Express + TypeScript!');
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err: unknown) => {
        console.error('MongoDB connection error:', err);
    });
