import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useGetBooking(bookingId: string){
  return useQuery(['get-booking'], async () =>{
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/api/v1/bookings/${bookingId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })

    if(!res.ok) throw new Error('Failed to fetch booking')
      return res.json()
  })
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
      return res.json();
    },
    {
      onSuccess: async (cancelledBooking) => {
        try {
          // Although cancelledBooking should be populated, we re-fetch to be safe.
          const populatedBooking = await getBookingById(cancelledBooking._id);
          if (user?.email && populatedBooking?.event) {
            await sendBookingEmailWithEmailJS({
              to_email: user.email,
              subject: 'Booking Cancelled',
              message: `Your booking for: ${populatedBooking.event.title} has been cancelled.`,
              event_name: populatedBooking.event.title,
              event_price: populatedBooking.event.price,
              event_location: populatedBooking.event.location,
              event_date: new Date(populatedBooking.event.date).toLocaleString(),
            });
          }
        } catch (error) {
          console.error("Failed to send cancellation email:", error);
        }
        queryClient.invalidateQueries(['bookings']);
      },
    }
  );
}

// Make sure to run: npm install @emailjs/browser
