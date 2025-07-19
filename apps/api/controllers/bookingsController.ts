import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import nodemailer from 'nodemailer';
import { User } from '../models/User';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cassidy97@ethereal.email',
        pass: 'pRPunSyWnBzP9DyWk1'
    }
});
// Helper: send email (stub)
async function sendEmail(to: string, subject: string, text: string) {
    const info = await transporter.sendMail({
        from: '"Ticket Booking" <no-reply@yourapp.com>',
        to,
        subject,
        text
      });
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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
        await sendEmail(user.email, 'Booking Confirmation', `You have booked: ${event.title}`);
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
        await sendEmail(user.email, 'Booking Cancelled', `Your booking for: ${(booking.event as any).title} has been cancelled.`);
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err });
  }
} 