import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Resend } from 'resend';

const EMAIL_KEY = process.env.EMAIL_KEY
const resend = new Resend(EMAIL_KEY);

export async function sendBookingEmail(req: Request, res: Response) {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'to, subject, and text are required.' });
  }
  try {
    const data = await resend.emails.send({
      from: 'josuebatey19@gmail.com',
      to,
      subject,
      text,
    });
    res.status(200).json({ message: 'Email sent', data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
}

export async function createBooking(req: AuthRequest, res: Response) {
  try {

    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    const bookingCount = await Booking.countDocuments({ event: eventId, status: 'booked' });
    if (bookingCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked.' });
    }
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot book past events.' });
    }
    const existing = await Booking.findOne({ user: req.user!.id, event: eventId, status: 'booked' });
    if (existing) {
      return res.status(409).json({ message: 'You have already booked this event.' });
    }
    const booking = new Booking({ user: req.user!.id, event: eventId, status: 'booked' });
    await booking.save();
    const user = await User.findById(req.user!.id);

    if (user && user.email) {
        try {
          const result = await resend.emails.send({
            from: 'noreply@ticketapp.com',
            to: user.email,
            subject: 'Booking Confirmation',
            text: `You have booked: ${event.title}`
          });
          console.log('Resend booking confirmation result:', result);
        } catch (err) {
          console.error('Resend booking confirmation error:', err);
        }
    }
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err });
  }
}

export async function listUserBookings(req: AuthRequest, res: Response) {
  try {
    const bookings = await Booking.find({ user: req.user!.id })
      .populate('event');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err });
  }
}

export async function getUserBooking(req: AuthRequest, res: Response) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user!.id }).populate('event');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking', error: err });
  }
}

export async function cancelBooking(req: AuthRequest, res: Response) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user!.id }).populate('event');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }
    booking.status = 'cancelled';
    await booking.save();

    const user = await User.findById(req.user!.id);
    if (user && user.email) {
        try {
          const result = await resend.emails.send({
            from: 'nnoreply@ticketapp.com',
            to: user.email,
            subject: 'Booking Cancelled',
            text: `Your booking for: ${(booking.event as any).title} has been cancelled.`
          });
          console.log('Resend booking cancelled result:', result);
        } catch (err) {
          console.error('Resend booking cancelled error:', err);
        }
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err });
  }
} 