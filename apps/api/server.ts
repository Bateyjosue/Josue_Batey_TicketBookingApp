import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import http from 'http';

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketbooking';

const server = http.createServer(app);

const startServer = async () => {
    try{
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (err: unknown) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

startServer();

