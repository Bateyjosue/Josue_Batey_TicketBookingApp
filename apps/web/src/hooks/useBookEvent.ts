import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import emailjs from '@emailjs/browser';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const SERVICE_ID = 'service_lb6xqra';
const TEMPLATE_ID = 'template_qex0co3';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

async function getBookingById(bookingId: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch booking details');
    return res.json();
}

async function sendBookingEmailWithEmailJS({ to_email, subject, message, event_name, event_price, event_location, event_date }: {
  to_email: string,
  subject: string,
  message: string,
  event_name: string,
  event_price: string,
  event_location: string,
  event_date: string,
}) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email,
      subject,
      message,
      event_name,
      event_price,
      event_location,
      event_date,
    },
    PUBLIC_KEY
  );
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
    return res.json();
  },
  {
    onSuccess: async (newBooking) => {
      try {
        const populatedBooking = await getBookingById(newBooking._id);
        if (user?.email && populatedBooking?.event) {
          await sendBookingEmailWithEmailJS({
            to_email: user.email,
            subject: 'Booking Confirmation',
            message: `You have successfully booked: ${populatedBooking.event.title}`,
            event_name: populatedBooking.event.title,
            event_price: populatedBooking.event.price,
            event_location: populatedBooking.event.location,
            event_date: new Date(populatedBooking.event.date).toLocaleString(),
          });
        }
      } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
      }
    },
  });
} 