import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'customer';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
});

export const User = mongoose.model<IUser>('User', UserSchema); 