import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';
import { IEvent } from './Event';

export type BookingStatus = 'booked' | 'cancelled';

export interface IBooking extends Document {
  user: Types.ObjectId | IUser;
  event: Types.ObjectId | IEvent;
  status: BookingStatus;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema); 