import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function sendBookingEmail(to: string, subject: string, text: string) {
  const BASE_URL = import.meta.env.VITE_API_URL || '';
  await fetch(`${BASE_URL}/api/v1/bookings/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text }),
  });
}

export function useBookEvent() {
  const user = useAuthStore.getState().user;
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
    const booking = await res.json();
    // Send confirmation email
    if (user?.email && booking?.event?.title) {
      await sendBookingEmail(
        user.email,
        'Booking Confirmation',
        `You have successfully booked: ${booking.event.title}`
      );
    }
    return booking;
  });
} 