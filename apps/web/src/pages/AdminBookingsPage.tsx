import React from 'react';
import { useBookings } from '../hooks/useBookings';

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, error } = useBookings();
  return (
    <div className="p-8 bg-black min-h-screen">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-8 text-center">All Bookings</h1>
      {isLoading ? (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-zinc-900 border border-yellow-700 rounded-xl animate-pulse">
            <thead>
              <tr className="text-yellow-400 text-left">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
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
                  <td className="px-4 py-3">
                    <div className="h-4 bg-yellow-900 rounded w-1/2" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-red-400">Failed to load bookings.</div>
      ) : Array.isArray(bookings) && bookings.length === 0 ? (
        <div className="text-yellow-200 text-lg">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-zinc-900 border border-yellow-700 rounded-xl">
            <thead>
              <tr className="text-yellow-400 text-left">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: { _id: string; event?: { title?: string; date?: string }; user?: { username?: string; email?: string }; status: string }) => (
                <tr key={booking._id} className="border-t border-yellow-800 hover:bg-zinc-800">
                  <td className="px-4 py-3 text-yellow-200 align-middle">{booking.event?.title}</td>
                  <td className="px-4 py-3 text-yellow-100 align-middle">{booking.user?.username}</td>
                  <td className="px-4 py-3 text-yellow-100 align-middle">{booking.user?.email}</td>
                  <td className="px-4 py-3 text-yellow-100 align-middle">{booking.status}</td>
                  <td className="px-4 py-3 text-yellow-100 align-middle">{booking.event?.date ? new Date(booking.event.date).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 