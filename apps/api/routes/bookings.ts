import express, { Router } from 'express';
import { createBooking, listUserBookings, cancelBooking, getUserBooking, sendBookingEmail } from '../controllers/bookingsController';
import { authenticateJWT } from '../middleware/auth';

const bookingsRouter: Router = express.Router();

bookingsRouter.post('/', authenticateJWT, createBooking);
bookingsRouter.get('/', authenticateJWT, listUserBookings);
bookingsRouter.get('/:id', authenticateJWT, getUserBooking);
bookingsRouter.put('/:id', authenticateJWT, cancelBooking);
bookingsRouter.post('/notify', sendBookingEmail);

export default bookingsRouter; 