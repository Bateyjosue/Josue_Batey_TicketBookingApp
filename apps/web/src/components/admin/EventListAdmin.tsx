import React from 'react';
import EventCardAdmin from './EventCardAdmin';
import type { AdminEvent } from './EventCardAdmin';

interface EventListAdminProps {
  events: AdminEvent[];
  onEdit?: (event: AdminEvent) => void;
  onDelete?: (event: AdminEvent) => void;
  onViewBookings?: (event: AdminEvent) => void;
}

export default function EventListAdmin({ events, onEdit, onDelete, onViewBookings }: EventListAdminProps) {
  if (!Array.isArray(events) || events.length === 0) {
    return <div className="text-yellow-200 text-lg">No events found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
      {events.map(event => (
        <EventCardAdmin
          key={event._id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewBookings={onViewBookings}
        />
      ))}
    </div>
  );
} 