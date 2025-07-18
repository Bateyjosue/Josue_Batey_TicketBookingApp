import express, { Router } from 'express';
import { listEvents, getEventById, createEvent, updateEvent, listEventBookings } from '../controllers/eventsController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roles';

const eventsRouter: Router = express.Router();

eventsRouter.get('/', listEvents);
eventsRouter.get('/:id', getEventById);

eventsRouter.post('/', authenticateJWT, requireRole('admin'), createEvent);
eventsRouter.put('/:id', authenticateJWT, requireRole('admin'), updateEvent);
eventsRouter.get('/:id/bookings', authenticateJWT, requireRole('admin'), listEventBookings);

export default eventsRouter; 