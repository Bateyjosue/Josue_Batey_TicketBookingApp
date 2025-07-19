// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  user: { id: string; username: string; email: string; role: string } | null;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
