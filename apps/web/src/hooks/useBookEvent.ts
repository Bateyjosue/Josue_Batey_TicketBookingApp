import { useMutation } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export function useBookEvent() {
  return useMutation(async (eventId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ eventId }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to book event');
    }
    return res.json();
  });
} 