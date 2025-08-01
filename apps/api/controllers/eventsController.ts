import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Booking } from '../models/Booking';

// GET /events - List all active and future events, with optional filtering
export async function listEvents(req: Request, res: Response) {
  try {
    // Deactivate past events
    await Event.updateMany({ date: { $lt: new Date() }, active: true }, { $set: { active: false } });

    const events = await Event.find({}); // No filters, just return all
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err });
  }
}

// GET /events/:id - Get event by ID
export async function getEventById(req: Request, res: Response) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event', error: err });
  }
}

// POST /events - Create a new event (admin only)
export async function createEvent(req: Request, res: Response) {
  try {
    const { title, description, location, date, capacity, price, active } = req.body;
    if (!title || !description || !location || !date || !capacity || !price) {
      return res.status(400).json({ message: 'All event fields are required.' });
    }
    const event = new Event({ title, description, location, date, capacity, price, active });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err });
  }
}

// PUT /events/:id - Update an event (admin only)
export async function updateEvent(req: Request, res: Response) {
  try {
    const { title, description, location, date, capacity, price, active } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, location, date, capacity, price, active },
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err });
  }
}

// GET /events/:id/bookings - List all bookings for an event (admin only)
export async function listEventBookings(req: Request, res: Response) {
  try {
    const bookings = await Booking.find({ event: req.params.id })
      .populate('user', 'username email')
      .populate('event', 'title');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings for event', error: err });
  }
}

export async function deleteEvent(req: Request, res: Response){
  try {
    const event = await Event.deleteOne({_id:req.params.id})

    if(!event) return res.status (404).json({ message: 'Event not found' });

    res.json(event)
  } catch(err) {

  }
}