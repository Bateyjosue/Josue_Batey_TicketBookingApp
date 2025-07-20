import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';

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

export function useEventBookings(eventId?: string) {
  return useQuery(['eventBookings', eventId], async () => {
    if (!eventId) return [];
    const token = localStorage.getItem('token');
    const BASE_URL = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${BASE_URL}/api/v1/events/${eventId}/bookings`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch event bookings');
    return res.json();
  }, { enabled: !!eventId });
}

async function sendBookingEmail(to: string, subject: string, text: string) {
  const BASE_URL = import.meta.env.VITE_API_URL || '';
  await fetch(`${BASE_URL}/api/v1/bookings/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text }),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const user = useAuthStore.getState().user;
  return useMutation(
    async (bookingId: string) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      const booking = await res.json();
      // Send cancellation email
      if (user?.email && booking?.event?.title) {
        await sendBookingEmail(
          user.email,
          'Booking Cancelled',
          `Your booking for: ${booking.event.title} has been cancelled.`
        );
      }
      return booking;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
      },
    }
  );
}
