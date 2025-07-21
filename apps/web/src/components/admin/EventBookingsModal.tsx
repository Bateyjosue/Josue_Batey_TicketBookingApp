import { useEventBookings } from '../../hooks/useBookings';
import type { AdminEvent } from './EventCardAdmin';

interface EventBookingsModalProps {
  open: boolean;
  onClose: () => void;
  event: AdminEvent | null;
}

type Booking = {
  _id: string;
  user?: { username?: string; email?: string };
  status: string;
  event?: { title?: string };
};

export default function EventBookingsModal({ open, onClose, event }: EventBookingsModalProps) {
  const { data: bookings, isLoading, error } = useEventBookings(event?._id);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-zinc-950 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto flex flex-col gap-6 relative border-2 border-yellow-700">
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-yellow-400 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-yellow-400 mb-2 text-center">
          Bookings for: <span className="text-yellow-200">{event?.title}</span>
        </h2>
        {isLoading ? (
          <div className="text-yellow-300 text-center">Loading bookings...</div>
        ) : error ? (
          <div className="text-red-400 text-center">Failed to load bookings.</div>
        ) : Array.isArray(bookings) && bookings.length === 0 ? (
          <div className="text-yellow-200 text-center">No bookings for this event.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-zinc-900 border border-yellow-700 rounded-xl">
              <thead>
                <tr className="text-yellow-400 text-left">
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(bookings) ? (bookings as Booking[]).filter((booking) => booking.status === 'booked') : []).map((booking) => (
                  <tr key={booking._id} className="border-t border-yellow-800 hover:bg-zinc-800">
                    <td className="px-4 py-2 text-yellow-200">{booking.user?.username}</td>
                    <td className="px-4 py-2 text-yellow-100">{booking.user?.email}</td>
                    <td className="px-4 py-2 text-yellow-100">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 