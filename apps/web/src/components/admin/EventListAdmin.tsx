import { useState } from 'react';
import type { AdminEvent } from './EventCardAdmin';
import EventBookingsModal from './EventBookingsModal';

interface EventListAdminProps {
  events: AdminEvent[];
  onEdit?: (event: AdminEvent) => void;
  onDelete?: (event: AdminEvent) => void;
  isLoading?: boolean;
}

export default function EventListAdmin({ events, onEdit, onDelete, isLoading }: EventListAdminProps) {
  const [showBookings, setShowBookings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  if (isLoading) {
    return (
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-zinc-900 border border-yellow-700 rounded-xl animate-pulse">
          <thead>
            <tr className="text-yellow-400 text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t border-yellow-800">
                <td className="px-4 py-3">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-zinc-800 rounded w-2/3" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <div className="h-8 w-16 bg-yellow-900 rounded" />
                  <div className="h-8 w-16 bg-yellow-900 rounded" />
                  <div className="h-8 w-24 bg-yellow-900 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (!Array.isArray(events) || events.length === 0) {
    return <div className="text-yellow-200 text-lg">No events found.</div>;
  }
  const handleViewBookings = (event: AdminEvent) => {
    setSelectedEvent(event);
    setShowBookings(true);
  };
  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-zinc-900 border border-yellow-700 rounded-xl">
          <thead>
            <tr className="text-yellow-400 text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id} className="border-t border-yellow-800 hover:bg-zinc-800">
                <td className="px-4 py-3 font-semibold text-yellow-200 align-middle">{event.title}</td>
                <td className="px-4 py-3 text-yellow-100 align-middle">{new Date(event.date).toLocaleString()}</td>
                <td className="px-4 py-3 text-yellow-100 align-middle">{event.location}</td>
                <td className="px-4 py-3 text-yellow-100 align-middle">{event.price ? `${event.price.toLocaleString()} RWF` : 'Free'}</td>
                <td className="px-4 py-3 flex gap-2 items-center align-middle">
                  <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold hover:bg-yellow-600 text-xs" onClick={() => onEdit?.(event)}>Edit</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 text-xs" onClick={() => onDelete?.(event)}>Delete</button>
                  <button className="bg-zinc-800 text-yellow-400 px-3 py-1 rounded font-bold hover:bg-yellow-700 text-xs" onClick={() => handleViewBookings(event)}>View Bookings</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EventBookingsModal
        open={showBookings}
        onClose={() => { setShowBookings(false); setSelectedEvent(null); }}
        event={selectedEvent}
      />
    </>
  );
} 