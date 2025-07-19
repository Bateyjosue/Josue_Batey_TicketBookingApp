import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  capacity: number;
  price: number;
  active: boolean;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

export const Event = mongoose.model<IEvent>('Event', EventSchema); 