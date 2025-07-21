// src/store/useAuthStore.ts
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: { id: string; username: string; email: string; role: string } | null;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    if (!decoded.exp) return false;
    // exp is in seconds, Date.now() in ms
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export async function initializeAuth() {
  const token = localStorage.getItem('token');
  if (token && isTokenValid(token)) {
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        useAuthStore.getState().setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch {
      localStorage.removeItem('token');
    }
  }
}
