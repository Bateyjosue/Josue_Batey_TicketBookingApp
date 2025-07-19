import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export function useBookings() {
  return useQuery(['bookings'], async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/v1/bookings`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  });
}
