import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'User with that email or username already exists.' });
    }
    const userRole = role || 'customer';
    const user = new User({ username, email, password, role: userRole });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(400).json({ message: 'Email or username and password are required.' });
    }
    // Find user by email or username
    const user = await User.findOne(email ? { email } : { username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Create JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
} 