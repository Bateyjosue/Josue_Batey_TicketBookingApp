import React, { useState } from 'react';
import { useBookings, useCancelBooking } from '../hooks/useBookings';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  status: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    description: string;
  };
}

export default function CustomerDashboardPage() {
  const { data: bookings, isLoading, error } = useBookings();
  const cancelBooking = useCancelBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (bookingId: string) => {
    setCancellingId(bookingId);
    cancelBooking.mutate(bookingId, {
      onSuccess: () => {
        toast.success('Booking cancelled!');
        setCancellingId(null);
      },
      onError: () => {
        toast.error('Failed to cancel booking');
        setCancellingId(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-10 text-center tracking-wide">My Bookings</h1>
      {isLoading ? (
        <div className="text-yellow-300">Loading bookings...</div>
      ) : error ? (
        <div className="text-red-400">Failed to load bookings.</div>
      ) : Array.isArray(bookings) && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-6xl mb-4">🎟️</span>
          <div className="text-yellow-200 text-lg mb-2">You have no bookings yet.</div>
          <div className="text-zinc-400">Browse events and book your first ticket!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {(bookings as Booking[]).map((booking) => {
            const event = booking.event;
            if (!event) return null;
            const isCancelling = cancellingId === booking._id && cancelBooking.isLoading;
            return (
              <div key={booking._id} className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-yellow-700 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-yellow-300 mb-2">{event.title}</h2>
                  <div className="mb-2 text-yellow-200 font-semibold">{new Date(event.date).toLocaleString()}</div>
                  <div className="mb-2 text-yellow-100">{event.location}</div>
                  <div className="mb-4 text-yellow-400 font-bold">{event.price ? `${event.price.toLocaleString()} RWF` : 'Free'}</div>
                  <p className="text-zinc-300 mb-4 min-h-[60px]">{event.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'booked' ? 'bg-yellow-500 text-black' : 'bg-zinc-700 text-yellow-300'}`}>{booking.status}</span>
                  {booking.status === 'booked' && (
                    <button
                      className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-xs disabled:opacity-60"
                      onClick={() => handleCancel(booking._id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 